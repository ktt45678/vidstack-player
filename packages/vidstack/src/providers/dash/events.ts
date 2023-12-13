import dashjs from 'dashjs';
import type { DOMEvent } from 'maverick.js/std';

import type { MediaPlayer } from '../../components/player';

export interface DASHProviderEvents {
  'dash-lib-load-start': DASHLibLoadStartEvent;
  'dash-lib-loaded': DASHLibLoadedEvent;
  'dash-lib-load-error': DASHLibLoadErrorEvent;
  'dash-instance': DASHInstanceEvent;
  'dash-unsupported': DASHUnsupportedEvent;
  // re-dispatched `dash.js` events below
  'dash-media-attaching': DASHMediaAttachingEvent;
  'dash-media-attached': DASHMediaAttachedEvent;
  'dash-media-detaching': DASHMediaDetachingEvent;
  'dash-media-detached': DASHMediaDetachedEvent;
  'dash-buffer-reset': DASHBufferResetEvent;
  'dash-buffer-codecs': DASHBufferCodecsEvent;
  'dash-buffer-created': DASHBufferCreatedEvent;
  'dash-buffer-appending': DASHBufferAppendingEvent;
  'dash-buffer-appended': DASHBufferAppendedEvent;
  'dash-buffer-eos': DASHBufferEosEvent;
  'dash-buffer-flushing': DASHBufferFlushingEvent;
  'dash-buffer-flushed': DASHBufferFlushedEvent;
  'dash-manifest-loading': DASHManifestLoadingEvent;
  'dash-manifest-loaded': DASHManifestLoadedEvent;
  'dash-manifest-parsed': DASHManifestParsedEvent;
  'dash-level-switching': DASHLevelSwitchingEvent;
  'dash-level-switched': DASHLevelSwitchedEvent;
  'dash-level-loading': DASHLevelLoadingEvent;
  'dash-level-loaded': DASHLevelLoadedEvent;
  'dash-level-updated': DASHLevelUpdatedEvent;
  'dash-level-pts-updated': DASHLevelPtsUpdatedEvent;
  'dash-levels-updated': DASHLevelsUpdatedEvent;
  'dash-audio-tracks-updated': DASHAudioTracksUpdatedEvent;
  'dash-audio-track-switching': DASHAudioTrackSwitchingEvent;
  'dash-audio-track-switched': DASHAudioTrackSwitchedEvent;
  'dash-audio-track-loading': DASHAudioTrackLoadingEvent;
  'dash-audio-track-loaded': DASHAudioTrackLoadedEvent;
  'dash-subtitle-tracks-updated': DASHSubtitleTracksUpdatedEvent;
  'dash-subtitle-tracks-cleared': DASHSubtitleTracksClearedEvent;
  'dash-subtitle-track-switch': DASHSubtitleTrackSwitchEvent;
  'dash-subtitle-track-loading': DASHSubtitleTrackLoadingEvent;
  'dash-subtitle-track-loaded': DASHSubtitleTrackLoadedEvent;
  'dash-subtitle-frag-processed': DASHSubtitleFragProcessedEvent;
  'dash-cues-parsed': DASHCuesParsedEvent;
  'dash-non-native-text-tracks-found': DASHNonNativeTextTracksFoundEvent;
  'dash-init-pts-found': DASHInitPtsFoundEvent;
  'dash-frag-loading': DASHFragLoadingEvent;
  'dash-frag-load-emergency-aborted': DASHFragLoadEmergencyAbortedEvent;
  'dash-frag-loaded': DASHFragLoadedEvent;
  'dash-frag-decrypted': DASHFragDecryptedEvent;
  'dash-frag-parsing-init-segment': DASHFragParsingInitSegmentEvent;
  'dash-frag-parsing-userdata': DASHFragParsingUserdataEvent;
  'dash-frag-parsing-metadata': DASHFragParsingMetadataEvent;
  'dash-frag-parsed': DASHFragParsedEvent;
  'dash-frag-buffered-data': DASHFragBufferedDataEvent;
  'dash-frag-changed': DASHFragChangedEvent;
  'dash-fps-drop': DASHFpsDropEvent;
  'dash-fps-drop-level-capping': DASHFpsDropLevelCappingEvent;
  'dash-error': DASHErrorEvent;
  'dash-destroying': DASHDestroyingEvent;
  'dash-key-loading': DASHKeyLoadingEvent;
  'dash-key-loaded': DASHKeyLoadedEvent;
  'dash-back-buffer-reached': DASHBackBufferReachedEvent;
}

export interface DASHMediaEvent<DetailType = unknown> extends DOMEvent<DetailType> {
  target: MediaPlayer;
}

/**
 * Fired when the browser begins downloading the `dash.js` library.
 */
export interface DASHLibLoadStartEvent extends DASHMediaEvent<void> {}

/**
 * Fired when the `dash.js` library has been loaded.
 *
 * @detail constructor
 */
export interface DASHLibLoadedEvent extends DASHMediaEvent<typeof dashjs> {}

/**
 * Fired when the `dash.js` library fails during the download process.
 *
 * @detail error
 */
export interface DASHLibLoadErrorEvent extends DASHMediaEvent<Error> {}

/**
 * Fired when the `dash.js` instance is built. This will not fire if the browser does not
 * support `dash.js`.
 *
 * @detail instance
 */
export interface DASHInstanceEvent extends DASHMediaEvent<dashjs.MediaPlayerClass> {}

/**
 * Fired when the browser doesn't support DASH natively, _and_ `dash.js` doesn't support
 * this environment either, most likely due to missing Media Extensions or video codecs.
 */
export interface DASHUnsupportedEvent extends DASHMediaEvent<void> {}

/**
 * Fired before `MediaSource` begins attaching to the media element.
 *
 * @detail data
 */
export interface DASHMediaAttachingEvent extends DASHMediaEvent<any> {}

/**
 * Fired when `MediaSource` has been successfully attached to the media element.
 *
 * @detail data
 */
export interface DASHMediaAttachedEvent extends DASHMediaEvent<dashjs.StreamInitializedEvent> {}

/**
 * Fired before detaching `MediaSource` from the media element.
 */
export interface DASHMediaDetachingEvent extends DASHMediaEvent<void> {}

/**
 * Fired when `MediaSource` has been detached from media element.
 */
export interface DASHMediaDetachedEvent extends DASHMediaEvent<void> {}

/**
 * Fired when we buffer is going to be reset.
 */
export interface DASHBufferResetEvent extends DASHMediaEvent<void> {}

/**
 * Fired when we know about the codecs that we need buffers for to push into.
 *
 * @detail data
 */
export interface DASHBufferCodecsEvent extends DASHMediaEvent<dashjs.BufferEvent> {}

/**
 * Fired when `SourceBuffer`'s have been created.
 *
 * @detail data
 */
export interface DASHBufferCreatedEvent extends DASHMediaEvent<dashjs.BufferEvent> {}

/**
 * Fired when we begin appending a media segment to the buffer.
 *
 * @detail data
 */
export interface DASHBufferAppendingEvent extends DASHMediaEvent<dashjs.BufferEvent> {}

/**
 * Fired when we are done with appending a media segment to the buffer.
 *
 * @detail data
 */
export interface DASHBufferAppendedEvent extends DASHMediaEvent<dashjs.BufferEvent> {}

/**
 * Fired when the stream is finished and we want to notify the media buffer that there will be no
 * more data.
 *
 * @detail data
 */
export interface DASHBufferEosEvent extends DASHMediaEvent<dashjs.BufferEvent> {}

/**
 * Fired when the media buffer should be flushed.
 *
 * @detail data
 */
export interface DASHBufferFlushingEvent extends DASHMediaEvent<dashjs.BufferEvent> {}

/**
 * Fired when the media buffer has been flushed.
 *
 * @detail data
 */
export interface DASHBufferFlushedEvent extends DASHMediaEvent<dashjs.BufferEvent> {}

/**
 * Fired to signal that manifest loading is starting.
 *
 * @detail data
 */
export interface DASHManifestLoadingEvent extends DASHMediaEvent<any> {}

/**
 * Fired after the manifest has been loaded.
 *
 * @detail data
 */
export interface DASHManifestLoadedEvent extends DASHMediaEvent<dashjs.ManifestLoadedEvent> {}

/**
 * Fired after manifest has been parsed.
 *
 * @detail data
 */
export interface DASHManifestParsedEvent extends DASHMediaEvent<any> {}

/**
 * Fired when a level switch is requested.
 *
 * @detail data
 */
export interface DASHLevelSwitchingEvent
  extends DASHMediaEvent<dashjs.QualityChangeRequestedEvent> {}

/**
 * Fired when a level switch is effective.
 *
 * @detail data
 */
export interface DASHLevelSwitchedEvent extends DASHMediaEvent<dashjs.QualityChangeRenderedEvent> {}

/**
 * Fired when a level playlist loading starts.
 *
 * @detail data
 */
export interface DASHLevelLoadingEvent extends DASHMediaEvent<any> {}

/**
 * Fired when a level playlist loading finishes.
 *
 * @detail data
 */
export interface DASHLevelLoadedEvent extends DASHMediaEvent<any> {}

/**
 * Fired when a level's details have been updated based on previous details, after it has been
 * loaded.
 *
 * @detail data
 */
export interface DASHLevelUpdatedEvent extends DASHMediaEvent<any> {}

/**
 * Fired when a level's PTS information has been updated after parsing a fragment.
 *
 * @detail data
 */
export interface DASHLevelPtsUpdatedEvent extends DASHMediaEvent<any> {}

/**
 * Fired when a level is removed after calling `removeLevel()`.
 *
 * @detail data
 */
export interface DASHLevelsUpdatedEvent extends DASHMediaEvent<any> {}

/**
 * Fired to notify that the audio track list has been updated.
 *
 * @detail data
 */
export interface DASHAudioTracksUpdatedEvent extends DASHMediaEvent<any> {}

/**
 * Fired when an audio track switching is requested.
 *
 * @detail data
 */
export interface DASHAudioTrackSwitchingEvent extends DASHMediaEvent<any> {}

/**
 * Fired when an audio track switch actually occurs.
 *
 * @detail data
 */
export interface DASHAudioTrackSwitchedEvent extends DASHMediaEvent<any> {}

/**
 * Fired when loading an audio track starts.
 *
 * @detail data
 */
export interface DASHAudioTrackLoadingEvent extends DASHMediaEvent<any> {}

/**
 * Fired when loading an audio track finishes.
 *
 * @detail data
 */
export interface DASHAudioTrackLoadedEvent extends DASHMediaEvent<any> {}

/**
 * Fired to notify that the subtitle track list has been updated.
 *
 * @detail data
 */
export interface DASHSubtitleTracksUpdatedEvent extends DASHMediaEvent<any> {}

/**
 * Fired to notify that subtitle tracks were cleared as a result of stopping the media.
 */
export interface DASHSubtitleTracksClearedEvent extends DASHMediaEvent<void> {}

/**
 * Fired when a subtitle track switch occurs.
 *
 * @detail data
 */
export interface DASHSubtitleTrackSwitchEvent extends DASHMediaEvent<any> {}

/**
 * Fired when loading a subtitle track starts.
 *
 * @detail data
 */
export interface DASHSubtitleTrackLoadingEvent extends DASHMediaEvent<any> {}

/**
 * Fired when loading a subtitle track finishes.
 *
 * @detail data
 */
export interface DASHSubtitleTrackLoadedEvent extends DASHMediaEvent<any> {}

/**
 * Fired when a subtitle fragment has been processed.
 *
 * @detail data
 */
export interface DASHSubtitleFragProcessedEvent extends DASHMediaEvent<any> {}

/**
 * Fired when a set of `VTTCue`'s to be managed externally has been parsed.
 *
 * @detail data
 */
export interface DASHCuesParsedEvent extends DASHMediaEvent<any> {}

/**
 * Fired when a text track to be managed externally is found.
 *
 * @detail data
 */
export interface DASHNonNativeTextTracksFoundEvent extends DASHMediaEvent<any> {}

/**
 * Fired when the first timestamp is found.
 *
 * @detail data
 */
export interface DASHInitPtsFoundEvent extends DASHMediaEvent<any> {}

/**
 * Fired when loading a fragment starts.
 *
 * @detail data
 */
export interface DASHFragLoadingEvent extends DASHMediaEvent<any> {}

/**
 * Fired when fragment loading is aborted for emergency switch down.
 *
 * @detail data
 */
export interface DASHFragLoadEmergencyAbortedEvent extends DASHMediaEvent<any> {}

/**
 * Fired when fragment loading is completed.
 *
 * @detail data
 */
export interface DASHFragLoadedEvent extends DASHMediaEvent<dashjs.FragmentLoadingCompletedEvent> {}

/**
 * Fired when a fragment has finished decrypting.
 *
 * @detail data
 */
export interface DASHFragDecryptedEvent extends DASHMediaEvent<any> {}

/**
 * Fired when `InitSegment` has been extracted from a fragment.
 *
 * @detail data
 */
export interface DASHFragParsingInitSegmentEvent extends DASHMediaEvent<any> {}

/**
 * Fired when parsing sei text is completed.
 *
 * @detail data
 */
export interface DASHFragParsingUserdataEvent extends DASHMediaEvent<any> {}

/**
 * Fired when parsing id3 is completed.
 *
 * @detail data
 */
export interface DASHFragParsingMetadataEvent extends DASHMediaEvent<any> {}

/**
 * Fired when fragment parsing is completed.
 *
 * @detail data
 */
export interface DASHFragParsedEvent extends DASHMediaEvent<any> {}

/**
 * Fired when fragment remuxed MP4 boxes have all been appended into `SourceBuffer`.
 *
 * @detail data
 */
export interface DASHFragBufferedDataEvent extends DASHMediaEvent<any> {}

/**
 * Fired when fragment matching with current media position is changing.
 *
 * @detail data
 */
export interface DASHFragChangedEvent extends DASHMediaEvent<any> {}

/**
 * Fired when a FPS drop is identified.
 *
 * @detail data
 */
export interface DASHFpsDropEvent extends DASHMediaEvent<any> {}

/**
 * Fired when FPS drop triggers auto level capping.
 *
 * @detail data
 */
export interface DASHFpsDropLevelCappingEvent extends DASHMediaEvent<any> {}

/**
 * Fired when an error has occurred during loading or playback.
 *
 * @detail data
 */
export interface DASHErrorEvent extends DASHMediaEvent<dashjs.ErrorEvent> {}

/**
 * Fired when the `dash.js` instance is being destroyed. Different from `dash-media-detached` as
 * one could want to detach, and reattach media to the `dash.js` instance to handle mid-rolls.
 */
export interface DASHDestroyingEvent extends DASHMediaEvent<any> {}

/**
 * Fired when a decrypt key loading starts.
 *
 * @detail data
 */
export interface DASHKeyLoadingEvent extends DASHMediaEvent<any> {}

/**
 * Fired when a decrypt key has been loaded.
 *
 * @detail data
 */
export interface DASHKeyLoadedEvent extends DASHMediaEvent<any> {}

/**
 * Fired when the back buffer is reached as defined by the `backBufferLength` config option.
 *
 * @detail data
 */
export interface DASHBackBufferReachedEvent extends DASHMediaEvent<any> {}
