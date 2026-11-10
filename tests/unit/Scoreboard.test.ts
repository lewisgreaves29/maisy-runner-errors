import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Scoreboard, STORAGE_KEY } from '../../src/game/Scoreboard';

describe('Scoreboard & Persistence Resilience', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('Linear Score Increments', () => {
    it('verifies score increments linearly with elapsed game frames', () => {
      const scoreboard = new Scoreboard();
      expect(scoreboard.getScore()).toBe(0);

      // Simulate 60 sequential frame ticks
      for (let frame = 1; frame <= 60; frame++) {
        const current = scoreboard.increment(1);
        expect(current).toBe(frame);
        expect(scoreboard.getScore()).toBe(frame);
      }
    });

    it('formats score with 5 zero-padded digits', () => {
      const scoreboard = new Scoreboard();
      expect(scoreboard.getFormattedScore()).toBe('00000');

      scoreboard.increment(42);
      expect(scoreboard.getFormattedScore()).toBe('00042');

      scoreboard.increment(1000);
      expect(scoreboard.getFormattedScore()).toBe('01042');
    });

    it('resets current score cleanly without losing high score', () => {
      const scoreboard = new Scoreboard();
      scoreboard.increment(150);
      scoreboard.saveHighScore();

      scoreboard.resetCurrentScore();
      expect(scoreboard.getScore()).toBe(0);
      expect(scoreboard.getHighScore()).toBe(150);
    });
  });

  describe('LocalStorage Read/Write Resilience', () => {
    it('loads existing high score on initialization', () => {
      localStorage.setItem(STORAGE_KEY, '450');
      const scoreboard = new Scoreboard();
      expect(scoreboard.getHighScore()).toBe(450);
      expect(scoreboard.getFormattedHighScore()).toBe('00450');
    });

    it('persists higher score to localStorage', () => {
      const scoreboard = new Scoreboard();
      scoreboard.increment(320);
      const saved = scoreboard.saveHighScore();

      expect(saved).toBe(true);
      expect(localStorage.getItem(STORAGE_KEY)).toBe('320');
    });

    it('handles QuotaExceededError gracefully without throwing', () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        const error = new DOMException('The quota has been exceeded.', 'QuotaExceededError');
        throw error;
      });

      const scoreboard = new Scoreboard();
      scoreboard.increment(500);

      expect(() => {
        const result = scoreboard.saveHighScore();
        expect(result).toBe(false);
      }).not.toThrow();

      // High score still tracked in memory
      expect(scoreboard.getHighScore()).toBe(500);
    });

    it('handles disabled localStorage (SecurityError / private mode) gracefully', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new DOMException('Access is denied for this document.', 'SecurityError');
      });
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new DOMException('Access is denied for this document.', 'SecurityError');
      });

      expect(() => {
        const scoreboard = new Scoreboard();
        expect(scoreboard.getHighScore()).toBe(0);
        scoreboard.increment(100);
        const result = scoreboard.saveHighScore();
        expect(result).toBe(false);

        // Calling saveHighScore again when storage unavailable returns false
        const secondAttempt = scoreboard.saveHighScore();
        expect(secondAttempt).toBe(false);
      }).not.toThrow();
    });

    it('handles corrupt non-numeric data in localStorage without crashing', () => {
      localStorage.setItem(STORAGE_KEY, 'not-a-number');
      const scoreboard = new Scoreboard();
      expect(scoreboard.getHighScore()).toBe(0);
    });

    it('handles negative numbers in localStorage without crashing', () => {
      localStorage.setItem(STORAGE_KEY, '-200');
      const scoreboard = new Scoreboard();
      expect(scoreboard.getHighScore()).toBe(0);
    });

    it('clears storage with resetAll()', () => {
      localStorage.setItem(STORAGE_KEY, '800');
      const scoreboard = new Scoreboard();
      expect(scoreboard.getHighScore()).toBe(800);

      scoreboard.resetAll();
      expect(scoreboard.getScore()).toBe(0);
      expect(scoreboard.getHighScore()).toBe(0);
      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });

    it('handles environment where window.localStorage is undefined', () => {
      const originalStorage = window.localStorage;
      Object.defineProperty(window, 'localStorage', {
        value: undefined,
        configurable: true,
      });

      const scoreboard = new Scoreboard();
      expect(scoreboard.getHighScore()).toBe(0);
      expect(scoreboard.saveHighScore()).toBe(false);

      scoreboard.resetAll();

      Object.defineProperty(window, 'localStorage', {
        value: originalStorage,
        configurable: true,
      });
    });
  });
});
