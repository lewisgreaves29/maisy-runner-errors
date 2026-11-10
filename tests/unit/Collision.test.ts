import { describe, it, expect } from 'vitest';
import {
  getPlayerHitbox,
  getObstacleHitbox,
  checkAABBCollision,
  BoundingBox,
} from '../../src/game/Physics';

describe('Collision Detection & Hitbox Boundaries', () => {
  const DEFAULT_WIDTH = 60;
  const DEFAULT_HEIGHT = 40;
  const INSET = 4;

  describe('Ducking Hitbox Reduction', () => {
    it('verifies that the ducking hitbox reduces player height by 40%', () => {
      const normalHitbox = getPlayerHitbox(0, 160, DEFAULT_WIDTH, DEFAULT_HEIGHT, false, 0);
      const duckingHitbox = getPlayerHitbox(0, 160, DEFAULT_WIDTH, DEFAULT_HEIGHT, true, 0);

      expect(normalHitbox.height).toBe(40);
      expect(duckingHitbox.height).toBe(24);

      // Height reduction percentage
      const heightReduction = (normalHitbox.height - duckingHitbox.height) / normalHitbox.height;
      expect(heightReduction).toBeCloseTo(0.4, 2);
    });

    it('applies 4px internal inset to ducking hitbox to prevent frustrating collisions', () => {
      const duckingHitboxWithInset = getPlayerHitbox(
        0,
        160,
        DEFAULT_WIDTH,
        DEFAULT_HEIGHT,
        true,
        INSET,
      );
      // Base ducking height is 24, inset is 4px on top and bottom -> 24 - 8 = 16px
      expect(duckingHitboxWithInset.height).toBe(16);
      expect(duckingHitboxWithInset.width).toBe(DEFAULT_WIDTH - INSET * 2);
    });

    it('applies jumping tucked-paw hitbox inset to ensure aerodynamic clearance', () => {
      const jumpingHitbox = getPlayerHitbox(
        0,
        160,
        DEFAULT_WIDTH,
        DEFAULT_HEIGHT,
        false,
        INSET,
        true,
      );
      // Jumping adds 4px horizontal inset (total 8px) and 2px vertical inset (total 6px)
      expect(jumpingHitbox.width).toBe(DEFAULT_WIDTH - (INSET + 4) * 2);
      expect(jumpingHitbox.height).toBe(DEFAULT_HEIGHT - (INSET + 2) * 2);
    });
  });

  describe('Stone Wall Collision Intersections', () => {
    it('detects collision when stone wall coordinates overlap Maisy bounding box', () => {
      // Maisy running on ground: x = 70, y = 160 (height 40, bottom at 200)
      const playerBox = getPlayerHitbox(70, 160, DEFAULT_WIDTH, DEFAULT_HEIGHT, false, INSET);

      // Stone wall at same position: x = 90 (overlaps 70..130), y = 168 (wall height 32, bottom at 200)
      const stoneWallBox = getObstacleHitbox(90, 168, 48, 32, INSET);

      const isColliding = checkAABBCollision(playerBox, stoneWallBox);
      expect(isColliding).toBe(true);
    });

    it('returns false when stone wall is far ahead or behind Maisy', () => {
      const playerBox = getPlayerHitbox(70, 160, DEFAULT_WIDTH, DEFAULT_HEIGHT, false, INSET);

      // Wall ahead at x = 300
      const stoneWallAhead = getObstacleHitbox(300, 168, 48, 32, INSET);
      expect(checkAABBCollision(playerBox, stoneWallAhead)).toBe(false);

      // Wall behind at x = 0
      const stoneWallBehind = getObstacleHitbox(0, 168, 48, 32, INSET);
      expect(checkAABBCollision(playerBox, stoneWallBehind)).toBe(false);
    });
  });

  describe('Near-Miss Scenarios', () => {
    it('ensures near-miss clearance of 1–3px above the fence rail does not register a collision', () => {
      // Wooden fence: height 44, sits at ground 200, so top is at y = 156
      const fenceX = 80;
      const fenceY = 156;
      const fenceWidth = 28;
      const fenceHeight = 44;
      const fenceHitbox = getObstacleHitbox(fenceX, fenceY, fenceWidth, fenceHeight, INSET);

      // Fence hitbox top is fenceY + INSET = 156 + 4 = 160

      // Test 1px, 2px, and 3px clearance above the raw fence rail
      const clearances = [1, 2, 3];

      clearances.forEach((clearance) => {
        // Player raw bottom is at fenceY - clearance = 156 - clearance
        // So player Y = (fenceY - clearance) - DEFAULT_HEIGHT
        const playerY = fenceY - clearance - DEFAULT_HEIGHT;
        const playerHitbox = getPlayerHitbox(fenceX, playerY, DEFAULT_WIDTH, DEFAULT_HEIGHT, false, INSET);

        const isColliding = checkAABBCollision(playerHitbox, fenceHitbox);
        expect(isColliding).toBe(false);
      });
    });

    it('registers collision when jumping too low (player overlaps fence top)', () => {
      const fenceX = 80;
      const fenceY = 156;
      const fenceHitbox = getObstacleHitbox(fenceX, fenceY, 28, 44, INSET);

      // Player penetrates fence top by 10px
      const playerY = fenceY + 10 - DEFAULT_HEIGHT;
      const playerHitbox = getPlayerHitbox(fenceX, playerY, DEFAULT_WIDTH, DEFAULT_HEIGHT, false, INSET);

      expect(checkAABBCollision(playerHitbox, fenceHitbox)).toBe(true);
    });
  });

  describe('Direct checkAABBCollision Logic', () => {
    it('returns false for disjoint boxes', () => {
      const boxA: BoundingBox = { x: 0, y: 0, width: 10, height: 10 };
      const boxB: BoundingBox = { x: 20, y: 20, width: 10, height: 10 };
      expect(checkAABBCollision(boxA, boxB)).toBe(false);
    });

    it('returns false for edge touching without overlapping', () => {
      const boxA: BoundingBox = { x: 0, y: 0, width: 10, height: 10 };
      const boxB: BoundingBox = { x: 10, y: 0, width: 10, height: 10 };
      expect(checkAABBCollision(boxA, boxB)).toBe(false);
    });
  });
});
