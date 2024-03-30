import { peek, type Dispose } from 'maverick.js';
import { isString } from 'maverick.js/std';

import type { Src } from '../../core/api/src-types';
import { isParsedManifest } from '../../utils/mime';
import { preconnect } from '../../utils/network';
import { isDashSupported } from '../../utils/support';
import type { MediaProviderAdapter } from '../types';
import { VideoProvider } from '../video/provider';
import { DASHController } from './dash';
import { DASHLibLoader } from './lib-loader';
import type { DASHConstructor, DASHInstanceCallback, DASHLibrary } from './types';

const JS_DELIVR_CDN = 'https://cdn.jsdelivr.net';

/**
 * The DASH provider introduces support for DASH streaming via the popular `dash.js`
 * library. DASH streaming is either [supported natively](https://caniuse.com/?search=dash) (generally
 * on iOS), or in environments that [support the Media Stream API](https://caniuse.com/?search=mediastream).
 *
 * @docs {@link https://www.vidstack.io/docs/player/providers/dash}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video}
 * @see {@link https://github.com/video-dev/dash.js/blob/master/docs/API.md}
 * @example
 * ```html
 * <media-player
 *   src="https://media-files.vidstack.io/dash/index.m3u8"
 *   poster="https://media-files.vidstack.io/poster.png"
 * >
 *   <media-provider></media-provider>
 * </media-player>
 * ```
 */
export class DASHProvider extends VideoProvider implements MediaProviderAdapter {
  protected override $$PROVIDER_TYPE = 'DASH';

  private _ctor: DASHConstructor | null = null;
  private readonly _controller = new DASHController(this.video, this._ctx);

  /**
   * The `dash.js` constructor.
   */
  get ctor() {
    return this._ctor;
  }

  /**
   * The current `dash.js` instance.
   */
  get instance() {
    return this._controller.instance;
  }

  /**
   * Whether `dash.js` is supported in this environment.
   */
  static supported = isDashSupported();

  override get type() {
    return 'dash';
  }

  get canLiveSync() {
    return true;
  }

  protected _library: DASHLibrary = `${JS_DELIVR_CDN}/npm/dashjs@^4.7/dist/dash.all${__DEV__ ? '.debug.js' : '.min.js'}`;

  /**
   * The `dash.js` configuration object.
   *
   */
  get config() {
    return this._controller._config;
  }

  set config(config) {
    this._controller._config = config;
  }

  /**
   * The `dash.js` constructor (supports dynamic imports) or a URL of where it can be found.
   *
   * @defaultValue `https://cdn.jsdelivr.net/npm/dashjs@^4.7/dist/dash.min.js`
   */
  get library() {
    return this._library;
  }

  set library(library) {
    this._library = library;
  }

  preconnect(): void {
    if (!isString(this._library)) return;
    preconnect(this._library);
  }

  override setup() {
    super.setup();
    new DASHLibLoader(this._library, this._ctx, (ctor) => {
      this._ctor = ctor;
      this._controller.setup(ctor);
      this._ctx.delegate._notify('provider-setup', this);
      const src = peek(this._ctx.$state.source);
      if (src) this.loadSource(src);
    });
  }

  override async loadSource(src: Src, preload?: HTMLMediaElement['preload']) {
    if (!isString(src.src) && !isParsedManifest(src.src)) return;
    this._media.preload = preload || '';
    this._controller.instance?.attachSource(src.src);
    this._currentSrc = src as Src<string>;
  }

  /**
   * The given callback is invoked when a new `dash.js` instance is created and right before it's
   * attached to media.
   */
  onInstance(callback: DASHInstanceCallback): Dispose {
    const instance = this._controller.instance;
    if (instance) callback(instance);
    this._controller._callbacks.add(callback);
    return () => this._controller._callbacks.delete(callback);
  }

  destroy() {
    this._controller._destroy();
  }
}
