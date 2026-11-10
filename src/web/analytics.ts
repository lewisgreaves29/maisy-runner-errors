/**
 * Umami Analytics Integration for Maisy Runner Error Service
 */

export interface UmamiTrackPayload {
  statusCode?: number;
  path?: string;
  url?: string;
  referrer?: string;
  host?: string;
  score?: number;
  highScore?: number;
  [key: string]: unknown;
}

declare global {
  interface Window {
    umami?: {
      track: (eventName: string, eventData?: UmamiTrackPayload) => void;
    };
  }
}

export function trackUmamiEvent(eventName: string, data?: UmamiTrackPayload): void {
  if (typeof window === 'undefined') return;

  const send = () => {
    try {
      if (window.umami && typeof window.umami.track === 'function') {
        window.umami.track(eventName, data);
      }
    } catch {
      // Analytics should never break user error page experience
    }
  };

  if (window.umami && typeof window.umami.track === 'function') {
    send();
  } else {
    // If Umami tracker script is still loading (defer), retry on window load
    window.addEventListener('load', () => send(), { once: true });
  }
}
