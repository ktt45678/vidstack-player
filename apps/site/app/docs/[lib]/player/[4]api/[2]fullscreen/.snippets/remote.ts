import { MediaRemoteControl } from 'vidstack';

const remote = new MediaRemoteControl(),
  button = document.querySelector('button');

button.addEventListener('pointerup', (event) => {
  // - We are providing the "trigger" here.
  // - Trigger events allow us to trace events back to their origin.
  // - The fullscreen change event will have this pointer event in its chain.
  remote.toggleFullscreen('prefer-media', event);
});
