import { describe, it, expect } from 'vitest';
import { ObstacleManager, MIN_OBSTACLE_GAP } from '../../src/game/ObstacleManager';
import { calculateSpeed } from '../../src/game/Physics';

describe('ObstacleManager & Procedural Spacing', () => {
  it('initializes with empty obstacle list and correct default dimensions', () => {
    const manager = new ObstacleManager(200, 800);
    expect(manager.obstacles.length).toBe(0);
    expect(manager.groundY).toBe(200);
    expect(manager.canvasWidth).toBe(800);
  });

  describe('Fair Obstacle Spacing (> 350px Invariant)', () => {
    it('ensures procedural generator never places two obstacles closer than 350px (preventing unwinnable death traps)', () => {
      const manager = new ObstacleManager(200, 800);

      // Generate 25 sequential obstacles
      for (let i = 0; i < 25; i++) {
        manager.spawnObstacle();
      }

      expect(manager.obstacles.length).toBe(25);

      for (let i = 1; i < manager.obstacles.length; i++) {
        const prev = manager.obstacles[i - 1];
        const curr = manager.obstacles[i];

        // Gap between the right edge of prev and the left edge of curr
        const gap = curr.x - (prev.x + prev.width);

        expect(gap).toBeGreaterThanOrEqual(MIN_OBSTACLE_GAP);
      }
    });

    it('enforces 350px spacing even when specific obstacle types are overridden', () => {
      const manager = new ObstacleManager(200, 800);

      const obs1 = manager.spawnObstacle('WOODEN_FENCE');
      const obs2 = manager.spawnObstacle('STONE_WALL');
      const obs3 = manager.spawnObstacle('MUD_PUDDLE');

      expect(obs2.x - (obs1.x + obs1.width)).toBeGreaterThanOrEqual(MIN_OBSTACLE_GAP);
      expect(obs3.x - (obs2.x + obs2.width)).toBeGreaterThanOrEqual(MIN_OBSTACLE_GAP);
    });
  });

  describe('Speed Sync with Global Difficulty Curve', () => {
    it('confirms obstacle speed matches the global difficulty curve during update', () => {
      const manager = new ObstacleManager(200, 800);
      const obs = manager.spawnObstacle('STONE_WALL');
      const initialX = obs.x;

      const score = 500;
      const expectedSpeed = calculateSpeed(score); // 6 + 5 * 0.2 = 7.0

      manager.update(score);

      // Obstacle should have moved left by expectedSpeed
      expect(obs.x).toBeCloseTo(initialX - expectedSpeed, 2);
    });

    it('prunes obstacles once they scroll past the left edge', () => {
      const manager = new ObstacleManager(200, 800);
      const obs = manager.spawnObstacle('STONE_WALL');
      obs.x = -100; // Far off screen to the left

      manager.update(0);

      // The off-screen obstacle must be pruned
      const found = manager.obstacles.find((o) => o.id === obs.id);
      expect(found).toBeUndefined();
    });

    it('resets correctly on manager.reset()', () => {
      const manager = new ObstacleManager(200, 800);
      manager.spawnObstacle();
      manager.spawnObstacle();
      expect(manager.obstacles.length).toBe(2);

      manager.reset();
      expect(manager.obstacles.length).toBe(0);
    });

    it('renders all obstacle types on canvas context without error', () => {
      const manager = new ObstacleManager(200, 800);
      manager.spawnObstacle('STONE_WALL');
      manager.spawnObstacle('WOODEN_FENCE');
      manager.spawnObstacle('MUD_PUDDLE');

      const mockCtx = {
        save: () => {},
        restore: () => {},
        translate: () => {},
        fillRect: () => {},
        beginPath: () => {},
        arc: () => {},
        fill: () => {},
        moveTo: () => {},
        lineTo: () => {},
        closePath: () => {},
        ellipse: () => {},
      } as unknown as CanvasRenderingContext2D;

      expect(() => manager.render(mockCtx)).not.toThrow();
    });
  });
});
