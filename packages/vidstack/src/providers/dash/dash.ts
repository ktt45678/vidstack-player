import dashjs from 'dashjs';
import { peek } from 'maverick.js';
import { camelToKebabCase, DOMEvent, listenEvent } from 'maverick.js/std';

import { QualitySymbol } from '../../core/quality/symbols';
import { ListSymbol } from '../../foundation/list/symbols';
import { IS_CHROME } from '../../utils/support';
import type { MediaSetupContext } from '../types';
import type { DASHConstructor, DASHInstanceCallback } from './types';

const toDOMEventType = (type: string) => camelToKebabCase(type);

export class DASHController {
  private _ctx!: MediaSetupContext;
  private _instance: dashjs.MediaPlayerClass | null = null;

  _config: Partial<dashjs.MediaPlayerSettingClass> = {};
  _callbacks = new Set<DASHInstanceCallback>();

  get instance() {
    return this._instance;
  }

  constructor(private _video: HTMLVideoElement) {}

  setup(ctor: DASHConstructor, ctx: MediaSetupContext) {
    this._ctx = ctx;

    this._instance = ctor().create();
    this._instance.initialize(this._video, undefined, peek(ctx.$state.autoplay));
    this._instance.updateSettings(this._config);

    for (const event of Object.values(dashjs.MediaPlayer.events))
      this._instance.on(event, (detail) => this._dispatchDASHEvent(event, detail));

    this._instance.on('error', (detail) => this._onError('error', detail));
    this._instance.on('playbackError', (detail) => this._onError('playbackError', detail));
    for (const callback of this._callbacks) callback(this._instance);

    ctx.player.dispatch(new DOMEvent('dash-instance', { detail: this._instance }));

    this._instance.on(dashjs.MediaPlayer.events.TRACK_CHANGE_RENDERED, (detail) => {
      if ((<dashjs.TrackChangeRenderedEvent>detail).mediaType === 'audio')
        this._onAudioSwitch(
          dashjs.MediaPlayer.events.TRACK_CHANGE_RENDERED,
          <dashjs.TrackChangeRenderedEvent>detail,
        );
    });
    this._instance.on(dashjs.MediaPlayer.events.QUALITY_CHANGE_REQUESTED, (detail) => {
      this._onLevelSwitched(dashjs.MediaPlayer.events.QUALITY_CHANGE_REQUESTED, detail);
    });
    this._instance.on(dashjs.MediaPlayer.events.QUALITY_CHANGE_RENDERED, (detail) => {
      this._onLevelLoaded(dashjs.MediaPlayer.events.QUALITY_CHANGE_RENDERED, detail);
    });

    ctx.qualities[QualitySymbol._enableAuto] = this._enableAutoQuality.bind(this);

    listenEvent(ctx.qualities, 'change', this._onQualityChange.bind(this));
    listenEvent(ctx.audioTracks, 'change', this._onAudioChange.bind(this));
  }

  private _dispatchDASHEvent(eventType: string, detail: any) {
    this._ctx.player?.dispatch(new DOMEvent(toDOMEventType(eventType), { detail }));
  }

  private _onAudioSwitch(eventType: string, data: dashjs.TrackChangeRenderedEvent) {
    const track = this._ctx.audioTracks[data.id];
    if (track) {
      this._ctx.audioTracks[ListSymbol._select](
        track,
        true,
        new DOMEvent(eventType, { detail: data }),
      );
    }
  }

  private _onLevelSwitched(eventType: string, data: dashjs.QualityChangeRequestedEvent) {
    const bitrateInfoList = this._instance?.getBitrateInfoListFor('video') || [];
    const newQuality =
      bitrateInfoList.find((info) => info.qualityIndex === data.newQuality)?.height || 0;
    const quality = this._ctx.qualities[newQuality];
    if (quality) {
      this._ctx.qualities[ListSymbol._select](
        quality,
        true,
        new DOMEvent(eventType, { detail: data }),
      );
    }
  }

  private _onLevelLoaded(eventType: string, data: dashjs.QualityChangeRenderedEvent): void {
    if (this._ctx.$state.canPlay()) return;

    const { duration } = data;
    const event = new DOMEvent(eventType, { detail: data });

    this._ctx.delegate._notify('duration-change', duration, event);

    const media = this._instance!.getVideoElement();

    const autoQuality = !!this.instance!.getSettings().streaming?.abr?.autoSwitchBitrate?.video;
    if (autoQuality) {
      this._ctx.qualities[QualitySymbol._setAuto](true, event);
    }

    for (const track of this._instance!.getTracksFor('audio')) {
      this._ctx.audioTracks[ListSymbol._add](
        {
          id: track.index + '',
          label: track.id || '',
          language: track.lang || '',
          kind: 'main',
        },
        event,
      );
    }

    const videoTrackInfo = this._instance!.getTracksFor('video')[0];
    for (const level of videoTrackInfo.bitrateList) {
      this._ctx.qualities[ListSymbol._add](
        {
          id: (level.id ?? level.height + 'p') + '',
          width: level.width || 0,
          height: level.height || 0,
          codec: videoTrackInfo.codec || '',
          bitrate: level.bandwidth || 0,
        },
        event,
      );
    }

    media.dispatchEvent(new DOMEvent<void>('canplay', { trigger: event }));
  }

  private _onError(type: string, data: dashjs.ErrorEvent | dashjs.PlaybackErrorEvent) {
    if (__DEV__) {
      this._ctx.logger
        ?.errorGroup(`DASH error \`${type}\``)
        .labelledLog('Media Element', this._instance?.getVideoElement())
        .labelledLog('DASH Instance', this._instance)
        .labelledLog('Event Type', data.type)
        .labelledLog('Data', data)
        .labelledLog('Src', peek(this._ctx.$state.source))
        .labelledLog('Media Store', { ...this._ctx.$state })
        .dispatch();
    }

    if (data.error) {
      switch (data.error) {
        case 'download':
          this._instance?.play();
          break;
        // case 'mediaError':
        //   this._instance?.recoverMediaError();
        //   break;
        default:
          // We can't recover here - better course of action?
          this._instance?.destroy();
          this._instance = null;
          break;
      }
    }
  }

  private _enableAutoQuality() {
    if (this._instance)
      this._instance.updateSettings({ streaming: { abr: { autoSwitchBitrate: { video: true } } } });
  }

  private _onQualityChange() {
    const { qualities } = this._ctx;
    if (!this._instance || qualities.auto) return;
    this._instance.setQualityFor('video', qualities.selectedIndex);
    /**
     * Chrome has some strange issue with detecting keyframes inserted before the current
     * playhead position. This can cause playback to freeze until a new keyframe. It seems
     * setting the current time forces chrome to seek back to the last keyframe and adjust
     * playback. Weird fix, but it works!
     */
    if (IS_CHROME) this._video.currentTime = this._video.currentTime;
  }

  private _onAudioChange() {
    const { audioTracks } = this._ctx;
    if (!this._instance) return;
    this._instance.setQualityFor('audio', audioTracks.selectedIndex);
  }

  _destroy() {
    if (this._ctx) this._ctx.qualities[QualitySymbol._enableAuto] = undefined;
    this._instance?.destroy();
    this._instance = null;
    if (__DEV__) this._ctx?.logger?.info('🏗️ Destroyed DASH instance');
  }
}
