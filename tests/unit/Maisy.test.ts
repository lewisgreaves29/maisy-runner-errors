import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Maisy } from '../../src/game/Maisy';
import { JUMP_CUT_VELOCITY } from '../../src/game/Physics';
import { drawMaisy, MAISY_SPRITES } from '../../src/assets/sprites/maisy';

describe('Maisy Entity & Visual Sprites', () => {
  let maisy: Maisy;

  beforeEach(() => {
    maisy = new Maisy(200);
  });

  it('initializes in RUNNING state at ground line', () => {
    expect(maisy.state).toBe('RUNNING');
    expect(maisy.physicsState.isGrounded).toBe(true);
    expect(maisy.getScreenY()).toBe(160); // groundY (200) - height (40)
  });

  it('triggers jump from ground', () => {
    maisy.jump();
    expect(maisy.state).toBe('JUMPING');
    expect(maisy.physicsState.isGrounded).toBe(false);
    expect(maisy.isJumpHeld).toBe(true);
  });

  it('releases jump key and cuts upward velocity', () => {
    maisy.jump();
    maisy.releaseJump();
    expect(maisy.isJumpHeld).toBe(false);
    expect(maisy.physicsState.vy).toBeGreaterThanOrEqual(JUMP_CUT_VELOCITY);
  });

  it('sets ducking state when grounded', () => {
    maisy.setDucking(true);
    expect(maisy.state).toBe('DUCKING');
    expect(maisy.physicsState.isDucking).toBe(true);

    maisy.setDucking(false);
    expect(maisy.state).toBe('RUNNING');
    expect(maisy.physicsState.isDucking).toBe(false);
  });

  it('sets game over state', () => {
    maisy.setGameOver();
    expect(maisy.state).toBe('GAME_OVER');

    // Subsequent actions should be ignored in GAME_OVER
    maisy.jump();
    expect(maisy.state).toBe('GAME_OVER');
    maisy.setDucking(true);
    expect(maisy.state).toBe('GAME_OVER');

    // update() during GAME_OVER is a no-op
    maisy.update(100);
    expect(maisy.state).toBe('GAME_OVER');
  });

  it('advances run animation frame indices during update()', () => {
    expect(maisy.state).toBe('RUNNING');
    // Update multiple ticks to cycle frames
    for (let i = 0; i < 25; i++) {
      maisy.update(0);
    }
    expect(maisy.state).toBe('RUNNING');
  });

  it('resets state cleanly', () => {
    maisy.jump();
    maisy.setGameOver();
    expect(maisy.state).toBe('GAME_OVER');

    maisy.reset();
    expect(maisy.state).toBe('RUNNING');
    expect(maisy.physicsState.isGrounded).toBe(true);
  });

  it('returns valid bounding hitbox', () => {
    const hitbox = maisy.getHitbox();
    expect(hitbox.width).toBe(52); // 60 - 8
    expect(hitbox.height).toBe(32); // 40 - 8
    expect(hitbox.x).toBe(74); // 70 + 4
  });

  describe('Sprite Definitions & Canvas Rendering', () => {
    it('contains all required sprite frame SVGs with Maisy Working Cocker Spaniel traits', () => {
      expect(MAISY_SPRITES.run0.svg).toContain('svg');
      expect(MAISY_SPRITES.run1.svg).toContain('svg');
      expect(MAISY_SPRITES.run2.svg).toContain('svg');
      expect(MAISY_SPRITES.run3.svg).toContain('svg');
      expect(MAISY_SPRITES.jump.svg).toContain('svg');
      expect(MAISY_SPRITES.duck.svg).toContain('svg');
      expect(MAISY_SPRITES.gameOver.svg).toContain('svg');

      // Verify trademark white chest flash present in all poses
      expect(MAISY_SPRITES.run0.svg).toContain('#FFFFFF');
      expect(MAISY_SPRITES.jump.svg).toContain('#FFFFFF');
      expect(MAISY_SPRITES.duck.svg).toContain('#FFFFFF');
      expect(MAISY_SPRITES.gameOver.svg).toContain('#FFFFFF');
    });

    it('renders on canvas context without crashing for all poses', () => {
      const mockCtx = {
        save: vi.fn(),
        restore: vi.fn(),
        translate: vi.fn(),
        scale: vi.fn(),
        beginPath: vi.fn(),
        closePath: vi.fn(),
        fill: vi.fn(),
        stroke: vi.fn(),
        fillRect: vi.fn(),
        moveTo: vi.fn(),
        lineTo: vi.fn(),
        arc: vi.fn(),
        ellipse: vi.fn(),
        quadraticCurveTo: vi.fn(),
      } as unknown as CanvasRenderingContext2D;

      const poses: Array<'run0' | 'run1' | 'run2' | 'run3' | 'jump' | 'duck' | 'gameOver'> = [
        'run0',
        'run1',
        'run2',
        'run3',
        'jump',
        'duck',
        'gameOver',
      ];

      poses.forEach((pose) => {
        expect(() => drawMaisy(mockCtx, pose, 70, 160)).not.toThrow();
      });

      // Also call maisy.render directly
      expect(() => maisy.render(mockCtx)).not.toThrow();
      maisy.jump();
      expect(() => maisy.render(mockCtx)).not.toThrow();
      maisy.setDucking(true);
      expect(() => maisy.render(mockCtx)).not.toThrow();
      maisy.setGameOver();
      expect(() => maisy.render(mockCtx)).not.toThrow();
    });
  });
});
