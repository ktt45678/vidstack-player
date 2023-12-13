import type { MediaSrc } from '../../core';
import { isDASHSrc } from '../../utils/mime';
import { isDASHSupported } from '../../utils/support';
import type { MediaProviderLoader } from '../types';
import { VideoProviderLoader } from '../video/loader';
import type { DASHProvider } from './provider';

export class DASHProviderLoader
  extends VideoProviderLoader
  implements MediaProviderLoader<DASHProvider>
{
  static supported = isDASHSupported();

  override canPlay(src: MediaSrc) {
    return DASHProviderLoader.supported && isDASHSrc(src);
  }

  override async load(context) {
    if (__SERVER__) {
      throw Error('[vidstack] can not load dash provider server-side');
    }

    if (__DEV__ && !this.target) {
      throw Error(
        '[vidstack] `<video>` element was not found - did you forget to include `<media-provider>`?',
      );
    }

    return new (await import('./provider')).DASHProvider(this.target, context);
  }
}
