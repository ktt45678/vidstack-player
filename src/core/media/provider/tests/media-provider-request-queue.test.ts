import { elementUpdated, expect, oneEvent } from '@open-wc/testing';
import { spy, stub } from 'sinon';

import { buildMediaFixture } from '../../../fakes/fakes.helpers';
import { VdsErrorEvent } from '../../media.events';

describe('media provider request queue', () => {
  it('should queue request given provider is not ready and flush once ready', async () => {
    const { provider } = await buildMediaFixture();

    const volumeSpy = spy(provider, 'setVolume');

    // Queue.
    provider.volume = 0.53;
    expect(provider.mediaRequestQueue.size, 'queue size').to.equal(1);

    // Flush.
    await provider.mediaRequestQueue.flush();

    // Check.
    expect(provider.mediaRequestQueue.size, 'new queue size').to.equal(0);
    expect(volumeSpy).to.have.been.calledWith(0.53);
  });

  it('should make request immediately if provider is ready', async () => {
    const { provider } = await buildMediaFixture();

    const volumeSpy = spy(provider, 'setVolume');

    provider.mediaRequestQueue.serveImmediately = true;

    provider.volume = 0.53;

    await elementUpdated(provider);

    expect(provider.mediaRequestQueue.size, 'queue size').to.equal(0);
    expect(volumeSpy).to.have.been.calledWith(0.53);
  });

  it('should overwrite request keys and only call once per "type"', async () => {
    const { provider } = await buildMediaFixture();

    const playSpy = spy(provider, 'play');
    const pauseSpy = spy(provider, 'pause');

    provider.paused = false;

    setTimeout(() => {
      provider.paused = true;
      expect(provider.mediaRequestQueue.size, 'queue size').to.equal(1);
      provider.mediaRequestQueue.flush();
    });

    await provider.mediaRequestQueue.waitForFlush();

    expect(playSpy).to.not.have.been.called;
    expect(pauseSpy).to.have.been.calledOnce;
  });

  // TODO: should this be the case??
  it.skip('should gracefully handle errors when flushing queue', async () => {
    const { provider } = await buildMediaFixture();

    stub(provider, 'play').throws(new Error('No play.'));

    provider.mediaRequestQueue.serveImmediately = true;

    setTimeout(() => {
      provider.paused = false;
    });

    const { detail } = await oneEvent(provider, VdsErrorEvent.TYPE);
    expect(detail.message).to.equal('No play.');
  });
});