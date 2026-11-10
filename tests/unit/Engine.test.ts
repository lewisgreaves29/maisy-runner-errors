import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Engine } from '../../src/game/Engine';
import {
  drawStoneWall,
  drawWoodenFence,
  drawMudPuddle,
  drawMoorlandHorizon,
} from '../../src/assets/sprites/obstacles';

describe('Game Engine & State Coordination', () => {
  let canvas: HTMLCanvasElement;
  let mockCtx: any;

  beforeEach(() => {
    mockCtx = {
      clearRect: vi.fn(),
      fillRect: vi.fn(),
      strokeRect: vi.fn(),
      fillText: vi.fn(),
      beginPath: vi.fn(),
      closePath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      stroke: vi.fn(),
      fill: vi.fn(),
      arc: vi.fn(),
      ellipse: vi.fn(),
      save: vi.fn(),
      restore: vi.fn(),
      translate: vi.fn(),
      scale: vi.fn(),
      quadraticCurveTo: vi.fn(),
      font: '',
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
      textAlign: 'left',
    };

    canvas = document.createElement('canvas');
    vi.spyOn(canvas, 'getContext').mockReturnValue(mockCtx as any);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('throws error if 2D context cannot be acquired', () => {
    const brokenCanvas = document.createElement('canvas');
    vi.spyOn(brokenCanvas, 'getContext').mockReturnValue(null);

    expect(() => new Engine({ canvas: brokenCanvas })).toThrow(
      'Could not get 2D context from canvas',
    );
  });

  it('initializes in IDLE state with 800x240 resolution', () => {
    const engine = new Engine({ canvas });
    expect(engine.state).toBe('IDLE');
    expect(canvas.width).toBe(800);
    expect(canvas.height).toBe(240);
    engine.destroy();
  });

  it('starts running on start() and executes step update', () => {
    const scoreSpy = vi.fn();
    const engine = new Engine({ canvas, onScoreChange: scoreSpy });

    engine.start();
    expect(engine.state).toBe('RUNNING');
    expect(engine.scoreboard.getScore()).toBe(1);

    // Run a manual step
    engine.step();
    expect(engine.scoreboard.getScore()).toBe(2);
    expect(scoreSpy).toHaveBeenCalledWith(2, 2);

    engine.destroy();
  });

  it('handles keyboard jump and duck controls', () => {
    const engine = new Engine({ canvas });

    // Press Space in IDLE -> starts game and jumps
    window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space' }));
    expect(engine.state).toBe('RUNNING');
    expect(engine.maisy.state).toBe('JUMPING');

    // Release jump
    window.dispatchEvent(new KeyboardEvent('keyup', { code: 'Space' }));
    expect(engine.maisy.isJumpHeld).toBe(false);

    // ArrowDown ducks
    window.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowDown' }));
    // Keyup ArrowDown stops ducking
    window.dispatchEvent(new KeyboardEvent('keyup', { code: 'ArrowDown' }));
    expect(engine.maisy.physicsState.isDucking).toBe(false);

    // ArrowUp jumps
    window.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowUp' }));
    window.dispatchEvent(new KeyboardEvent('keyup', { code: 'ArrowUp' }));

    engine.destroy();
  });

  it('handles touch gestures on mobile devices', () => {
    const engine = new Engine({ canvas });

    // Touch in IDLE starts game
    canvas.dispatchEvent(new TouchEvent('touchstart'));
    expect(engine.state).toBe('RUNNING');
    expect(engine.maisy.state).toBe('JUMPING');

    canvas.dispatchEvent(new TouchEvent('touchend'));
    expect(engine.maisy.isJumpHeld).toBe(false);

    // Touch while already RUNNING triggers jump
    engine.maisy.physicsState.isGrounded = true;
    canvas.dispatchEvent(new TouchEvent('touchstart'));
    expect(engine.maisy.state).toBe('JUMPING');

    // Calling start() while already running is a no-op
    engine.start();
    expect(engine.state).toBe('RUNNING');

    // Calling loop when state is not running renders and returns
    engine.state = 'IDLE';
    (engine as any).loop(0);

    engine.destroy();
  });

  it('triggers GAME_OVER upon collision with an obstacle', () => {
    const gameOverSpy = vi.fn();
    const engine = new Engine({ canvas, onGameOver: gameOverSpy });
    engine.start();

    // Place obstacle directly on Maisy's position (x = 70, y = 168)
    const obs = engine.obstacleManager.spawnObstacle('STONE_WALL');
    obs.x = 70;

    engine.step();

    expect(engine.state).toBe('GAME_OVER');
    expect(engine.maisy.state).toBe('GAME_OVER');
    expect(gameOverSpy).toHaveBeenCalled();

    engine.destroy();
  });

  it('renders IDLE, RUNNING, and GAME_OVER states cleanly', () => {
    const engine = new Engine({ canvas });

    // Render in IDLE
    engine.render();
    expect(mockCtx.fillText).toHaveBeenCalledWith(
      expect.stringContaining('PRESS [SPACE] OR TAP SCREEN TO START RUNNING'),
      expect.any(Number),
      expect.any(Number),
    );

    // Render in RUNNING
    engine.start();
    engine.render();

    // Render in GAME_OVER
    (engine as any).triggerGameOver();
    engine.render();
    expect(mockCtx.fillText).toHaveBeenCalledWith(
      'MAISY TOOK A REST',
      expect.any(Number),
      expect.any(Number),
    );

    engine.destroy();
  });

  describe('Obstacle Sprite Draw Helpers', () => {
    it('draws stone wall, wooden fence, mud puddle, and moorland horizon', () => {
      expect(() => drawStoneWall(mockCtx, 100, 168)).not.toThrow();
      expect(() => drawWoodenFence(mockCtx, 150, 156)).not.toThrow();
      expect(() => drawMudPuddle(mockCtx, 200, 186)).not.toThrow();
      expect(() => drawMoorlandHorizon(mockCtx, 50, 800)).not.toThrow();
    });
  });
});
