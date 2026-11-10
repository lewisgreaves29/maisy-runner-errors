/**
 * ObstacleManager - Procedural Generation, Spacing, and Obstacle Lifecycle
 *
 * Guarantees fair gameplay:
 * - Obstacles never placed closer than MIN_OBSTACLE_GAP (350px).
 * - Speeds match global difficulty curve.
 * - Out-of-bounds obstacles pruned to maintain constant memory footprint.
 */

import { calculateSpeed, getObstacleHitbox, BoundingBox } from './Physics';
import {
  OBSTACLE_TYPES,
  ObstacleTypeDefinition,
  drawStoneWall,
  drawWoodenFence,
  drawMudPuddle,
} from '../assets/sprites/obstacles';

export const MIN_OBSTACLE_GAP = 350;

export interface ObstacleInstance {
  id: number;
  type: 'STONE_WALL' | 'WOODEN_FENCE' | 'MUD_PUDDLE';
  x: number;
  y: number;
  width: number;
  height: number;
  hitboxInset: { x: number; y: number };
}

export class ObstacleManager {
  public obstacles: ObstacleInstance[] = [];
  public readonly groundY: number = 200;
  public readonly canvasWidth: number = 800;

  private nextId = 1;
  private minNextSpawnX = 0;

  constructor(groundY = 200, canvasWidth = 800) {
    this.groundY = groundY;
    this.canvasWidth = canvasWidth;
    this.reset();
  }

  public reset(): void {
    this.obstacles = [];
    this.nextId = 1;
    // Initial spawn point after player start
    this.minNextSpawnX = this.canvasWidth + 100;
  }

  /**
   * Spawns an obstacle procedurally.
   * Enforces that the new obstacle is placed AT LEAST MIN_OBSTACLE_GAP (350px)
   * away from the previous obstacle.
   */
  public spawnObstacle(typeOverride?: 'STONE_WALL' | 'WOODEN_FENCE' | 'MUD_PUDDLE'): ObstacleInstance {
    const types: Array<'STONE_WALL' | 'WOODEN_FENCE' | 'MUD_PUDDLE'> = [
      'STONE_WALL',
      'WOODEN_FENCE',
      'MUD_PUDDLE',
    ];

    const selectedType =
      typeOverride ?? types[Math.floor(Math.random() * types.length)];
    const def: ObstacleTypeDefinition = OBSTACLE_TYPES[selectedType];

    let spawnX = this.canvasWidth;
    if (this.obstacles.length > 0) {
      const lastObstacle = this.obstacles[this.obstacles.length - 1];
      const earliestValidX = lastObstacle.x + lastObstacle.width + MIN_OBSTACLE_GAP;
      spawnX = Math.max(spawnX, earliestValidX);
    } else {
      spawnX = Math.max(spawnX, this.minNextSpawnX);
    }

    // Additional random pacing jitter (0 to 180px) for varied gameplay
    const jitter = typeOverride ? 0 : Math.floor(Math.random() * 180);
    spawnX += jitter;

    const obstacleY = this.groundY - def.height;

    const instance: ObstacleInstance = {
      id: this.nextId++,
      type: selectedType,
      x: spawnX,
      y: obstacleY,
      width: def.width,
      height: def.height,
      hitboxInset: def.hitboxInset,
    };

    this.obstacles.push(instance);
    this.minNextSpawnX = spawnX + def.width + MIN_OBSTACLE_GAP;
    return instance;
  }

  /**
   * Updates obstacle positions based on score speed curve and prunes off-screen hurdles.
   */
  public update(score = 0): void {
    const speed = calculateSpeed(score);

    for (let i = 0; i < this.obstacles.length; i++) {
      this.obstacles[i].x -= speed;
    }

    // Prune off-screen obstacles (x + width < 0)
    this.obstacles = this.obstacles.filter((obs) => obs.x + obs.width >= -20);

    // Check if new obstacle should be spawned
    const lastObstacle = this.obstacles[this.obstacles.length - 1];
    if (!lastObstacle || lastObstacle.x < this.canvasWidth) {
      this.spawnObstacle();
    }
  }

  public getHitboxes(): BoundingBox[] {
    return this.obstacles.map((obs) =>
      getObstacleHitbox(obs.x, obs.y, obs.width, obs.height, obs.hitboxInset.x),
    );
  }

  public render(ctx: CanvasRenderingContext2D): void {
    for (const obs of this.obstacles) {
      switch (obs.type) {
        case 'STONE_WALL':
          drawStoneWall(ctx, obs.x, obs.y, obs.width, obs.height);
          break;
        case 'WOODEN_FENCE':
          drawWoodenFence(ctx, obs.x, obs.y, obs.width, obs.height);
          break;
        case 'MUD_PUDDLE':
          drawMudPuddle(ctx, obs.x, obs.y, obs.width, obs.height);
          break;
      }
    }
  }
}
