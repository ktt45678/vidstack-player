const createPlugin = require('tailwindcss/plugin');

const mediaAttributes = [
  'autoplay',
  'autoplay-error',
  'buffering',
  'captions',
  'can-fullscreen',
  'can-pip',
  'can-load',
  'can-play',
  'can-seek',
  'ended',
  'error',
  'fullscreen',
  'controls',
  'loop',
  'live',
  'live-edge',
  'muted',
  'paused',
  'pip',
  'playing',
  'playsinline',
  'preview',
  'seeking',
  'started',
  'waiting',
  'ios-controls',
];

module.exports = createPlugin.withOptions(function (options) {
  const selector = options?.selector ?? (options?.webComponents ? 'media-player' : 'div'),
    prefixOpt = options?.prefix ?? options?.mediaPrefix,
    prefix = prefixOpt ? `${prefixOpt}-` : 'media-';

  return function ({ addVariant }) {
    mediaAttributes.forEach((name) => {
      addVariant(`${prefix}${name}`, `${selector}[data-${name}] &`);
      addVariant(`not-${prefix}${name}`, `${selector}:not([data-${name}]) &`);
    });
  };
});
