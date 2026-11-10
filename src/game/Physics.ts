/**
 * Deterministic Physics Engine for Maisy Runner
 *
 * Implements:
 * - Gravity: 1.6 px/frame^2
 * - Initial Jump Velocity: -14 px/frame
 * - Variable Jump Height: Cutting jump short if Jump key is released early
 * - Horizontal Velocity: Base speed 6 px/frame, accelerating by +0.2 px/frame
 *   per 100 points scored (capped at 16 px/frame)
 * - Ground plane clamp at Y = 0 (prevents falling through floor)
 * - Terminal falling velocity clamp (16 px/frame)
 * - AABB Collision detection with 4px inset hitboxes
 */

export const GRAVITY = 1.45;
export const INITIAL_JUMP_VELOCITY = -14.5;
export const TERMINAL_VELOCITY = 16;
export const JUMP_CUT_VELOCITY = -7.5;

export const BASE_HORIZONTAL_SPEED = 6;
export const MAX_HORIZONTAL_SPEED = 16;
export const SPEED_ACCELERATION_PER_100_PTS = 0.2;

export const GROUND_Y = 0; // Ground floor plane definition

export interface PlayerPhysicsState {
  x: number;
  y: number; // Vertical position: GROUND_Y (0) on floor, negative values while in air
  vy: number;
  isGrounded: boolean;
  isDucking: boolean;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Calculates horizontal speed based on score.
 * Base speed 6 px/frame, +0.2 per 100 points, capped at 16 px/frame.
 */
export function calculateSpeed(score: number): number {
  if (score <= 0) return BASE_HORIZONTAL_SPEED;
  const hundredBlocks = Math.floor(score / 100);
  const calculated = BASE_HORIZONTAL_SPEED + hundredBlocks * SPEED_ACCELERATION_PER_100_PTS;
  return Math.min(MAX_HORIZONTAL_SPEED, Math.round(calculated * 100) / 100);
}

/**
 * Updates player physics for a single simulation tick.
 * Ensures player cannot drop through ground plane (Y = 0).
 */
export function updatePlayerPhysics(
  state: PlayerPhysicsState,
  score = 0,
  isJumpHeld = true,
): PlayerPhysicsState {
  const currentSpeed = calculateSpeed(score);
  const newX = state.x + currentSpeed;

  let newY = state.y;
  let newVy = state.vy;
  let isGrounded = state.isGrounded;

  if (!isGrounded) {
    // Cut vertical thrust if jump key was released early while moving upwards
    if (!isJumpHeld && newVy < JUMP_CUT_VELOCITY) {
      newVy = JUMP_CUT_VELOCITY;
    }

    // Apply gravity (accelerate falling if ducking in air)
    const activeGravity = state.isDucking ? GRAVITY * 1.5 : GRAVITY;
    newVy += activeGravity;

    // Terminal velocity clamp
    if (newVy > TERMINAL_VELOCITY) {
      newVy = TERMINAL_VELOCITY;
    }

    // Apply vertical displacement
    newY += newVy;

    // Ground plane collision check (Y = GROUND_Y = 0)
    if (newY >= GROUND_Y) {
      newY = GROUND_Y;
      newVy = 0;
      isGrounded = true;
    }
  } else {
    // If already grounded, guarantee clamped to ground floor plane
    newY = GROUND_Y;
    newVy = 0;
  }

  return {
    x: newX,
    y: newY,
    vy: newVy,
    isGrounded,
    isDucking: state.isDucking,
  };
}

/**
 * Initiates a jump if the player is currently grounded.
 */
export function initiateJump(state: PlayerPhysicsState): PlayerPhysicsState {
  if (!state.isGrounded) {
    return state;
  }
  return {
    ...state,
    vy: INITIAL_JUMP_VELOCITY,
    isGrounded: false,
    isDucking: false,
  };
}

/**
 * Cuts vertical jump velocity if jump input is released early.
 */
export function cutJump(vy: number): number {
  if (vy < JUMP_CUT_VELOCITY) {
    return JUMP_CUT_VELOCITY;
  }
  return vy;
}

/**
 * Generates an Axis-Aligned Bounding Box for player with 4px inset.
 * When ducking, player height is reduced by 40%.
 */
export function getPlayerHitbox(
  x: number,
  y: number,
  baseWidth = 60,
  baseHeight = 40,
  isDucking = false,
  inset = 4,
  isJumping = false,
): BoundingBox {
  const effectiveHeight = isDucking ? baseHeight * 0.6 : baseHeight;
  const yOffset = isDucking ? baseHeight * 0.4 : 0;

  // In mid-air, Maisy tucks paws and streamlines ears/tail: provide 4px extra horizontal margin
  const horizontalInset = isJumping ? inset + 4 : inset;
  const verticalInset = isJumping ? inset + 2 : inset;

  const width = Math.max(0, baseWidth - horizontalInset * 2);
  const height = Math.max(0, effectiveHeight - verticalInset * 2);

  return {
    x: x + horizontalInset,
    y: y + yOffset + verticalInset,
    width,
    height,
  };
}

/**
 * Generates an Axis-Aligned Bounding Box for an obstacle with inset.
 */
export function getObstacleHitbox(
  x: number,
  y: number,
  width: number,
  height: number,
  inset = 4,
): BoundingBox {
  return {
    x: x + inset,
    y: y + inset,
    width: Math.max(0, width - inset * 2),
    height: Math.max(0, height - inset * 2),
  };
}

/**
 * Tests for Axis-Aligned Bounding Box (AABB) intersection.
 */
export function checkAABBCollision(boxA: BoundingBox, boxB: BoundingBox): boolean {
  return (
    boxA.x < boxB.x + boxB.width &&
    boxA.x + boxA.width > boxB.x &&
    boxA.y < boxB.y + boxB.height &&
    boxA.y + boxA.height > boxB.y
  );
}
