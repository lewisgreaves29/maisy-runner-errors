/**
 * Scoreboard - Score Tracking & Resilient Storage
 *
 * Implements:
 * - Linear score increment per elapsed frame
 * - High score persistence in window.localStorage['greaveslabs_runner_hi']
 * - Graceful resilience against disabled storage, SecurityError, and QuotaExceededError
 * - Standard 5-digit zero-padded score formatting
 */

export const STORAGE_KEY = 'greaveslabs_runner_hi';

export class Scoreboard {
  private currentScore = 0;
  private highScore = 0;
  private isStorageAvailable = true;

  constructor() {
    this.highScore = this.loadHighScore();
  }

  /**
   * Safely loads high score from localStorage with error fallback.
   */
  public loadHighScore(): number {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        this.isStorageAvailable = false;
        return 0;
      }
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return 0;
      const parsed = parseInt(raw, 10);
      return isNaN(parsed) || parsed < 0 ? 0 : parsed;
    } catch {
      this.isStorageAvailable = false;
      return 0;
    }
  }

  /**
   * Safely saves high score to localStorage.
   * Catches QuotaExceededError or security exceptions silently to keep game functional.
   */
  public saveHighScore(): boolean {
    if (this.currentScore > this.highScore) {
      this.highScore = this.currentScore;
    }

    if (!this.isStorageAvailable) return false;

    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(STORAGE_KEY, this.highScore.toString());
        return true;
      }
    } catch {
      // LocalStorage disabled, private browsing, or QuotaExceededError
      this.isStorageAvailable = false;
    }
    return false;
  }

  /**
   * Increments the current score linearly with elapsed frames.
   */
  public increment(delta = 1): number {
    this.currentScore += delta;
    if (this.currentScore > this.highScore) {
      this.highScore = this.currentScore;
    }
    return this.currentScore;
  }

  public getScore(): number {
    return this.currentScore;
  }

  public getHighScore(): number {
    return this.highScore;
  }

  public resetCurrentScore(): void {
    this.currentScore = 0;
  }

  public resetAll(): void {
    this.currentScore = 0;
    this.highScore = 0;
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // Ignore
    }
  }

  public getFormattedScore(digits = 5): string {
    return this.currentScore.toString().padStart(digits, '0');
  }

  public getFormattedHighScore(digits = 5): string {
    return this.highScore.toString().padStart(digits, '0');
  }
}
