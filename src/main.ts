/**
 * main.ts - Bootstrap entry point for Maisy Runner Custom Error Service
 */

import { Engine } from './game/Engine';
import { getErrorContext } from './web/error-context';
import { trackUmamiEvent } from './web/analytics';

export function bootstrap(): Engine | null {
  // 1. Parse and apply error context
  if (typeof window !== 'undefined') {
    const errorDetails = getErrorContext(window.location.href);

    const titleEl = document.getElementById('error-title');
    if (titleEl) {
      titleEl.textContent = errorDetails.title;
    }

    const messageEl = document.getElementById('error-message');
    if (messageEl) {
      messageEl.textContent = errorDetails.message;
    }

    const hostEl = document.getElementById('diag-host');
    if (hostEl) {
      hostEl.textContent = errorDetails.host;
    }

    const rayIdEl = document.getElementById('diag-rayid');
    if (rayIdEl) {
      rayIdEl.textContent = errorDetails.rayId;
    }

    const clusterEl = document.getElementById('diag-cluster');
    if (clusterEl) {
      clusterEl.textContent = errorDetails.cluster;
    }

    document.title = `${errorDetails.title} — GreavesLabs`;

    // Track HTTP error occurrence in Umami
    trackUmamiEvent('http-error', {
      statusCode: errorDetails.statusCode,
      path: window.location.pathname,
      url: window.location.href,
      referrer: document.referrer || '(direct)',
      host: errorDetails.host,
    });
  }

  // 2. Initialize Game Engine
  const canvas = document.getElementById('game-canvas') as HTMLCanvasElement | null;
  if (!canvas) {
    console.warn('Canvas element #game-canvas not found');
    return null;
  }

  const engine = new Engine({
    canvas,
    onGameOver: (score, highScore) => {
      trackUmamiEvent('runner-game-over', {
        score,
        highScore,
      });
    },
  });

  return engine;
}

// Auto-run bootstrap if in browser environment
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      bootstrap();
    });
  } else {
    bootstrap();
  }
}
