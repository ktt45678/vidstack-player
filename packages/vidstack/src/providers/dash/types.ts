import type * as dashjs from 'dashjs';

import type { DASHProviderEvents } from './events';

export { type DASHProviderEvents };

export type DASHConstructor = typeof dashjs;
export type DASHConstructorLoader = () => Promise<{ default: typeof dashjs } | undefined>;
export type DASHLibrary = typeof dashjs | string | undefined;
export type DASHInstanceCallback = (dash: dashjs.MediaPlayerClass) => void;
