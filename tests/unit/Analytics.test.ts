import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { trackUmamiEvent } from '../../src/web/analytics';

describe('Umami Analytics Integration', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    delete (window as any).umami;
  });

  afterEach(() => {
    delete (window as any).umami;
  });

  it('immediately calls window.umami.track if window.umami is defined', () => {
    const trackSpy = vi.fn();
    (window as any).umami = { track: trackSpy };

    trackUmamiEvent('http-error', { statusCode: 404, path: '/test-broken' });

    expect(trackSpy).toHaveBeenCalledWith('http-error', { statusCode: 404, path: '/test-broken' });
  });

  it('waits for window load event if window.umami is not yet ready', () => {
    const trackSpy = vi.fn();

    trackUmamiEvent('http-error', { statusCode: 502, path: '/api/v1' });
    expect(trackSpy).not.toHaveBeenCalled();

    // Script finishes loading
    (window as any).umami = { track: trackSpy };
    window.dispatchEvent(new Event('load'));

    expect(trackSpy).toHaveBeenCalledWith('http-error', { statusCode: 502, path: '/api/v1' });
  });

  it('safely handles exceptions thrown by window.umami.track without crashing', () => {
    (window as any).umami = {
      track: () => {
        throw new Error('Blocked by adblocker');
      },
    };

    expect(() => {
      trackUmamiEvent('http-error', { statusCode: 404 });
    }).not.toThrow();
  });
});
