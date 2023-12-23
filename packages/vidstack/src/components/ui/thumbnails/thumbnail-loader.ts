import { effect, onDispose, peek, signal, type ReadSignal } from 'maverick.js';
import { isString } from 'maverick.js/std';
import type { VTTCue } from 'media-captions';

import { useMediaContext, type MediaContext } from '../../../core/api/media-context';
import { parseJSONCaptionsFile } from '../../../core/tracks/text/text-track';
import { getRequestCredentials } from '../../../utils/network';
import type { ThumbnailSrc } from './thumbnail';

const cache = new Map<string, VTTCue[]>(),
  pending = new Set<string>(),
  registry = new Set<ThumbnailsLoader>();

export class ThumbnailsLoader {
  readonly $cues = signal<VTTCue[]>([]);

  static create($src: ReadSignal<string | ThumbnailSrc>) {
    const media = useMediaContext();
    return new ThumbnailsLoader($src, media);
  }

  constructor(
    readonly $src: ReadSignal<string | ThumbnailSrc>,
    private _media: MediaContext,
  ) {
    effect(this._onLoadCues.bind(this));

    registry.add(this);
    onDispose(() => registry.delete(this));
  }

  protected _onLoadCues() {
    const { canLoad } = this._media.$state;

    if (!canLoad()) return;

    const controller = new AbortController(),
      { crossorigin } = this._media.$state;

    const srcProp = this.$src();
    const src = isString(srcProp) ? srcProp : srcProp.src;
    if (!src) return;

    if (isString(src)) {
      if (cache.has(src)) {
        // Really basic LRU cache implementation.
        const cues = cache.get(src)!;
        cache.delete(src);
        cache.set(src, cues);

        if (cache.size > 30) {
          const firstKey = cache.keys().next().value;
          cache.delete(firstKey);
        }

        this.$cues.set(cache.get(src)!);
      } else if (!pending.has(src)) {
        pending.add(src);
        import('media-captions').then(async ({ parseResponse }) => {
          try {
            const response = await fetch(src, {
                signal: controller.signal,
                credentials: getRequestCredentials(crossorigin()),
              }),
              isJSON = response.headers.get('content-type') === 'application/json';

            if (isJSON) {
              try {
                const { cues } = parseJSONCaptionsFile(await response.text(), window.VTTCue);
                this._updateCues(src, cues);
              } catch (e) {
                // no-op
              }

              return;
            }

            const { cues } = await parseResponse(response);
            this._updateCues(src, cues);
          } catch (e) {
            // no-op
          }
        });
      }
    } else if (!isString(srcProp) && srcProp.type === 'cues') {
      const baseURL = srcProp.baseURL;
      if (cache.has(baseURL)) {
        // Really basic LRU cache implementation.
        const cues = cache.get(baseURL)!;
        cache.delete(baseURL);
        cache.set(baseURL, cues);

        if (cache.size > 30) {
          const firstKey = cache.keys().next().value;
          cache.delete(firstKey);
        }

        this.$cues.set(cache.get(baseURL)!);
      } else if (!pending.has(baseURL)) {
        this._updateCues(baseURL, src);
      }
    }

    return () => {
      controller.abort();
      this.$cues.set([]);
    };
  }

  private _updateCues(currentSrc: string, cues: VTTCue[]) {
    this.$cues.set(cues);

    for (const t of registry) {
      if (peek(t.$src) === currentSrc) t.$cues.set(cues);
    }

    cache.set(currentSrc, cues);
    pending.delete(currentSrc);
  }
}
