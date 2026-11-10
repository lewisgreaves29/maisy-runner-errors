/**
 * Maisy Player Entity
 *
 * Manages Maisy's state transitions, running animation cycles,
 * ear physics, ducking, jumping, and rendering.
 */

import {
  PlayerPhysicsState,
  updatePlayerPhysics,
  initiateJump,
  cutJump,
  getPlayerHitbox,
  BoundingBox,
  GROUND_Y,
} from './Physics';
import { drawMaisy } from '../assets/sprites/maisy';

export type MaisyState = 'RUNNING' | 'JUMPING' | 'DUCKING' | 'GAME_OVER';

export class Maisy {
  public readonly x: number = 70; // Screen X anchor
  public readonly width: number = 60;
  public readonly height: number = 40;
  public readonly groundY: number = 200; // Screen Y coordinate of ground line

  public physicsState: PlayerPhysicsState;
  public state: MaisyState = 'RUNNING';
  public isJumpHeld: boolean = false;

  private frameIndex: number = 0;
  private animTickCounter: number = 0;

  constructor(groundY = 200) {
    this.groundY = groundY;
    this.physicsState = {
      x: this.x,
      y: GROUND_Y,
      vy: 0,
      isGrounded: true,
      isDucking: false,
    };
  }

  public reset(): void {
    this.physicsState = {
      x: this.x,
      y: GROUND_Y,
      vy: 0,
      isGrounded: true,
      isDucking: false,
    };
    this.state = 'RUNNING';
    this.isJumpHeld = false;
    this.frameIndex = 0;
    this.animTickCounter = 0;
  }

  public jump(): void {
    if (this.state === 'GAME_OVER') return;
    if (this.physicsState.isGrounded) {
      this.physicsState = initiateJump(this.physicsState);
      this.state = 'JUMPING';
      this.isJumpHeld = true;
    }
  }

  public releaseJump(): void {
    this.isJumpHeld = false;
    if (!this.physicsState.isGrounded) {
      this.physicsState.vy = cutJump(this.physicsState.vy);
    }
  }

  public setDucking(ducking: boolean): void {
    if (this.state === 'GAME_OVER') return;
    this.physicsState.isDucking = ducking;
    if (this.physicsState.isGrounded) {
      this.state = ducking ? 'DUCKING' : 'RUNNING';
    }
  }

  public setGameOver(): void {
    this.state = 'GAME_OVER';
  }

  public update(score = 0): void {
    if (this.state === 'GAME_OVER') return;

    this.physicsState = updatePlayerPhysics(this.physicsState, score, this.isJumpHeld);

    // Sync state based on physics
    if (this.physicsState.isGrounded) {
      this.state = this.physicsState.isDucking ? 'DUCKING' : 'RUNNING';
    } else {
      this.state = 'JUMPING';
    }

    // Animation cycle (stride frames 0..3)
    this.animTickCounter++;
    if (this.animTickCounter >= 5) {
      this.animTickCounter = 0;
      this.frameIndex = (this.frameIndex + 1) % 4;
    }
  }

  public getScreenY(): number {
    // When grounded, bottom of Maisy is at groundY
    // y from physics is <= 0 (displacement above ground)
    return this.groundY - this.height + this.physicsState.y;
  }

  public getHitbox(): BoundingBox {
    const screenY = this.getScreenY();
    return getPlayerHitbox(
      this.x,
      screenY,
      this.width,
      this.height,
      this.physicsState.isDucking,
      4,
      !this.physicsState.isGrounded,
    );
  }

  public render(ctx: CanvasRenderingContext2D): void {
    const screenY = this.getScreenY();

    let pose: 'run0' | 'run1' | 'run2' | 'run3' | 'jump' | 'duck' | 'gameOver';

    if (this.state === 'GAME_OVER') {
      pose = 'gameOver';
    } else if (this.state === 'JUMPING') {
      pose = 'jump';
    } else if (this.state === 'DUCKING') {
      pose = 'duck';
    } else {
      pose = `run${this.frameIndex}` as 'run0' | 'run1' | 'run2' | 'run3';
    }

    drawMaisy(ctx, pose, this.x, screenY);
  }
}
