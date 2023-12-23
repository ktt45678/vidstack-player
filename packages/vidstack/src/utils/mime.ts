import { isString } from 'maverick.js/std';

import type { MediaResource, MediaSrc, ParsedDashManifest } from '../core';

// https://github.com/cookpete/react-player/blob/master/src/patterns.js#L16
export const AUDIO_EXTENSIONS =
  /\.(m4a|m4b|mp4a|mpga|mp2|mp2a|mp3|m2a|m3a|wav|weba|aac|oga|spx)($|\?)/i;

// TODO: We'll need to extend this later.
export const AUDIO_TYPES = new Set<string>([
  'audio/mpeg',
  'audio/ogg',
  'audio/3gp',
  'audio/mp4',
  'audio/webm',
  'audio/flac',
]);

// https://github.com/cookpete/react-player/blob/master/src/patterns.js#L16
export const VIDEO_EXTENSIONS = /\.(mp4|og[gv]|webm|mov|m4v)(#t=[,\d+]+)?($|\?)/i;

// TODO: We'll need to extend this later.
export const VIDEO_TYPES = new Set<string>([
  'video/mp4',
  'video/webm',
  'video/3gp',
  'video/ogg',
  'video/avi',
  'video/mpeg',
]);

export const DASH_VIDEO_EXTENSIONS = /\.(mpd)($|\?)/i;

export const DASH_VIDEO_TYPES = new Set<string>([
  // Dash xml
  'application/dash+xml',
  // Common xml
  'application/xml',
  // Included for completeness
  'video/dash+xml',
  'video/xml',
  'video/dash',
]);

export const HLS_VIDEO_EXTENSIONS = /\.(m3u8)($|\?)/i;

// Taken from video.js
export const HLS_VIDEO_TYPES = new Set<string>([
  // Apple sanctioned
  'application/vnd.apple.mpegurl',
  // Apple sanctioned for backwards compatibility
  'audio/mpegurl',
  // Very common
  'audio/x-mpegurl',
  // Very common
  'application/x-mpegurl',
  // Included for completeness
  'video/x-mpegurl',
  'video/mpegurl',
  'application/mpegurl',
]);

export function isDashSrc({ src, type, provider }: MediaSrc): boolean {
  return (
    provider === 'dash' ||
    isParsedManifest(src) ||
    (isString(src) && DASH_VIDEO_EXTENSIONS.test(src)) ||
    DASH_VIDEO_TYPES.has(type)
  );
}

export function isHLSSrc({ src, type, provider }: MediaSrc): boolean {
  return (
    provider === 'hls' ||
    (isString(src) && HLS_VIDEO_EXTENSIONS.test(src)) ||
    HLS_VIDEO_TYPES.has(type)
  );
}

export function isMediaStream(src: unknown): src is MediaStream {
  return (
    !__SERVER__ && typeof window.MediaStream !== 'undefined' && src instanceof window.MediaStream
  );
}

export function isParsedManifest(src: MediaResource): src is ParsedDashManifest {
  return typeof src === 'object' && 'protocol' in src && src.protocol === 'DASH';
}

// export function isMediaSource(src: unknown): src is MediaSource {
//   const MediaSource = getMediaSource();
//   return !!MediaSource && src instanceof MediaSource;
// }

// export function isBlob(src: unknown): src is Blob {
//   // We can't use `instanceof Blob` because it might be polyfilled.
//   return src?.constructor.name === 'Blob';
// }
