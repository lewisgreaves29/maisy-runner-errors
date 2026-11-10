/**
 * Engine.ts - Core Game Loop, State Machine, and Input Manager
 *
 * Coordinates Maisy, ObstacleManager, Scoreboard, and Physics.
 * Uses fixed 800x240 internal resolution with CSS responsive scaling.
 */

import { Maisy } from './Maisy';
import { ObstacleManager } from './ObstacleManager';
import { Scoreboard } from './Scoreboard';
import { checkAABBCollision, calculateSpeed } from './Physics';
import { drawMoorlandHorizon, LANDSCAPE_COLORS } from '../assets/sprites/obstacles';

export type GameState = 'IDLE' | 'RUNNING' | 'GAME_OVER';

export interface EngineOptions {
  canvas: HTMLCanvasElement;
  onScoreChange?: (score: number, highScore: number) => void;
  onGameOver?: (score: number, highScore: number) => void;
}

export class Engine {
  public canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;

  public state: GameState = 'IDLE';
  public readonly virtualWidth = 800;
  public readonly virtualHeight = 240;
  public readonly groundY = 200;

  public maisy: Maisy;
  public obstacleManager: ObstacleManager;
  public scoreboard: Scoreboard;

  private animationFrameId: number | null = null;
  private lastTimestamp = 0;
  private scrollOffset = 0;

  private onScoreChange?: (score: number, highScore: number) => void;
  private onGameOver?: (score: number, highScore: number) => void;

  private boundKeyDown: (e: KeyboardEvent) => void;
  private boundKeyUp: (e: KeyboardEvent) => void;
  private boundTouchStart: (e: TouchEvent) => void;
  private boundTouchEnd: (e: TouchEvent) => void;

  constructor(options: EngineOptions) {
    this.canvas = options.canvas;
    const context = this.canvas.getContext('2d');
    if (!context) {
      throw new Error('Could not get 2D context from canvas');
    }
    this.ctx = context;

    this.onScoreChange = options.onScoreChange;
    this.onGameOver = options.onGameOver;

    // Set internal resolution
    this.canvas.width = this.virtualWidth;
    this.canvas.height = this.virtualHeight;

    this.maisy = new Maisy(this.groundY);
    this.obstacleManager = new ObstacleManager(this.groundY, this.virtualWidth);
    this.scoreboard = new Scoreboard();

    this.boundKeyDown = this.handleKeyDown.bind(this);
    this.boundKeyUp = this.handleKeyUp.bind(this);
    this.boundTouchStart = this.handleTouchStart.bind(this);
    this.boundTouchEnd = this.handleTouchEnd.bind(this);

    this.attachEventListeners();
    this.render(); // Initial idle render
  }

  public attachEventListeners(): void {
    window.addEventListener('keydown', this.boundKeyDown);
    window.addEventListener('keyup', this.boundKeyUp);
    this.canvas.addEventListener('touchstart', this.boundTouchStart, { passive: true });
    this.canvas.addEventListener('touchend', this.boundTouchEnd, { passive: true });
  }

  public destroy(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    window.removeEventListener('keydown', this.boundKeyDown);
    window.removeEventListener('keyup', this.boundKeyUp);
    this.canvas.removeEventListener('touchstart', this.boundTouchStart);
    this.canvas.removeEventListener('touchend', this.boundTouchEnd);
  }

  public start(): void {
    if (this.state === 'RUNNING') return;
    this.reset();
    this.state = 'RUNNING';
    this.lastTimestamp = performance.now();
    this.loop(this.lastTimestamp);
  }

  public reset(): void {
    this.maisy.reset();
    this.obstacleManager.reset();
    this.scoreboard.resetCurrentScore();
    this.scrollOffset = 0;
    this.state = 'IDLE';
    this.onScoreChange?.(0, this.scoreboard.getHighScore());
  }

  private handleKeyDown(e: KeyboardEvent): void {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
      e.preventDefault();
      if (this.state === 'IDLE' || this.state === 'GAME_OVER') {
        this.start();
        this.maisy.jump();
      } else if (this.state === 'RUNNING') {
        this.maisy.jump();
      }
    } else if (e.code === 'ArrowDown') {
      e.preventDefault();
      if (this.state === 'RUNNING') {
        this.maisy.setDucking(true);
      }
    }
  }

  private handleKeyUp(e: KeyboardEvent): void {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
      if (this.state === 'RUNNING') {
        this.maisy.releaseJump();
      }
    } else if (e.code === 'ArrowDown') {
      if (this.state === 'RUNNING') {
        this.maisy.setDucking(false);
      }
    }
  }

  private handleTouchStart(): void {
    if (this.state === 'IDLE' || this.state === 'GAME_OVER') {
      this.start();
      this.maisy.jump();
    } else if (this.state === 'RUNNING') {
      this.maisy.jump();
    }
  }

  private handleTouchEnd(): void {
    if (this.state === 'RUNNING') {
      this.maisy.releaseJump();
    }
  }

  public step(): void {
    if (this.state !== 'RUNNING') return;

    // 1. Update score
    const score = this.scoreboard.increment(1);
    this.onScoreChange?.(score, this.scoreboard.getHighScore());

    // 2. Update player physics
    this.maisy.update(score);

    // 3. Update obstacles
    this.obstacleManager.update(score);

    // 4. Update parallax terrain offset
    const currentSpeed = calculateSpeed(score);
    this.scrollOffset += currentSpeed;

    // 5. Check collision
    const maisyHitbox = this.maisy.getHitbox();
    const obstacleHitboxes = this.obstacleManager.getHitboxes();

    for (const obsBox of obstacleHitboxes) {
      if (checkAABBCollision(maisyHitbox, obsBox)) {
        this.triggerGameOver();
        break;
      }
    }
  }

  private triggerGameOver(): void {
    this.state = 'GAME_OVER';
    this.maisy.setGameOver();
    this.scoreboard.saveHighScore();
    this.onGameOver?.(this.scoreboard.getScore(), this.scoreboard.getHighScore());
  }

  private loop(timestamp: number): void {
    if (this.state !== 'RUNNING') {
      this.render();
      return;
    }

    this.step();
    this.render();

    this.lastTimestamp = timestamp;
    this.animationFrameId = requestAnimationFrame(this.loop.bind(this));
  }

  public render(): void {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.virtualWidth, this.virtualHeight);

    // 1. Base canvas background (Warm Cream #FAF7F2)
    ctx.fillStyle = '#FAF7F2';
    ctx.fillRect(0, 0, this.virtualWidth, this.virtualHeight);

    // 2. Parallax undulating moorland hills (15% Sage Green)
    drawMoorlandHorizon(ctx, this.scrollOffset, this.virtualWidth, 160);

    // 3. Ground plane (Forest Charcoal #242A25 line with Sage Green base #4A614E)
    ctx.fillStyle = LANDSCAPE_COLORS.sageGreen;
    ctx.fillRect(0, this.groundY, this.virtualWidth, this.virtualHeight - this.groundY);

    // Crisp high-contrast ground line
    ctx.strokeStyle = '#242A25';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, this.groundY);
    ctx.lineTo(this.virtualWidth, this.groundY);
    ctx.stroke();

    // Subtle grass tussock ground details
    ctx.fillStyle = '#3a4e3e';
    for (let x = -(this.scrollOffset % 60); x < this.virtualWidth + 60; x += 60) {
      ctx.fillRect(x + 10, this.groundY + 3, 4, 2);
      ctx.fillRect(x + 35, this.groundY + 7, 6, 2);
    }

    // 4. Render obstacles
    this.obstacleManager.render(ctx);

    // 5. Render Maisy
    this.maisy.render(ctx);

    // 6. Render in-canvas score indicator (top right)
    ctx.font = '600 13px "Fira Code", monospace';
    ctx.fillStyle = '#242A25';
    ctx.textAlign = 'right';
    const scoreText = `SCORE: ${this.scoreboard.getFormattedScore()}  HI: ${this.scoreboard.getFormattedHighScore()}`;
    ctx.fillText(scoreText, this.virtualWidth - 20, 28);

    // 7. Overlay for IDLE and GAME OVER states
    if (this.state === 'IDLE') {
      ctx.fillStyle = 'rgba(250, 247, 242, 0.75)';
      ctx.fillRect(0, 0, this.virtualWidth, this.virtualHeight);

      ctx.fillStyle = '#4A614E';
      ctx.font = '600 16px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('PRESS [SPACE] OR TAP SCREEN TO START RUNNING', this.virtualWidth / 2, 110);

      ctx.font = '400 12px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#5e685f';
      ctx.fillText('[↑ / SPACE] Jump   •   [↓] Duck / Fast Drop', this.virtualWidth / 2, 135);
    } else if (this.state === 'GAME_OVER') {
      ctx.fillStyle = 'rgba(250, 247, 242, 0.85)';
      ctx.fillRect(0, 0, this.virtualWidth, this.virtualHeight);

      // Terracotta Accent for Game Over
      ctx.fillStyle = '#D47C59';
      ctx.font = '700 22px "Fraunces", Georgia, serif';
      ctx.textAlign = 'center';
      ctx.fillText('MAISY TOOK A REST', this.virtualWidth / 2, 95);

      ctx.fillStyle = '#242A25';
      ctx.font = '600 14px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(
        `FINAL SCORE: ${this.scoreboard.getScore()}  |  HIGH SCORE: ${this.scoreboard.getHighScore()}`,
        this.virtualWidth / 2,
        125,
      );

      ctx.fillStyle = '#4A614E';
      ctx.font = '500 13px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('PRESS [SPACE] OR TAP SCREEN TO RETRY', this.virtualWidth / 2, 155);
    }
  }
}
