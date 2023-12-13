import type dashjs from 'dashjs';

import type { DASHProviderEvents } from './events';

export { type DASHProviderEvents };

export type DASHConstructor = () => dashjs.MediaPlayerFactory;
export type DASHConstructorLoader = () => Promise<{ default: typeof dashjs } | undefined>;
export type DASHLibrary = typeof dashjs | DASHConstructorLoader | string | undefined;
export type DASHInstanceCallback = (dash: dashjs.MediaPlayerClass) => void;
