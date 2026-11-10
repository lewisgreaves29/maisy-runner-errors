import { describe, it, expect } from 'vitest';
import {
  calculateSpeed,
  updatePlayerPhysics,
  initiateJump,
  cutJump,
  PlayerPhysicsState,
  GRAVITY,
  INITIAL_JUMP_VELOCITY,
  TERMINAL_VELOCITY,
  JUMP_CUT_VELOCITY,
  GROUND_Y,
  BASE_HORIZONTAL_SPEED,
  MAX_HORIZONTAL_SPEED,
} from '../../src/game/Physics';

describe('Physics Engine', () => {
  describe('Speed Acceleration Curve', () => {
    it('returns base speed for zero or negative score', () => {
      expect(calculateSpeed(0)).toBe(BASE_HORIZONTAL_SPEED);
      expect(calculateSpeed(-50)).toBe(BASE_HORIZONTAL_SPEED);
    });

    it('accelerates by +0.2 px/frame per 100 points scored', () => {
      expect(calculateSpeed(100)).toBe(6.2);
      expect(calculateSpeed(250)).toBe(6.4);
      expect(calculateSpeed(500)).toBe(7.0);
      expect(calculateSpeed(1000)).toBe(8.0);
    });

    it('caps maximum horizontal speed at 16 px/frame', () => {
      expect(calculateSpeed(6000)).toBe(MAX_HORIZONTAL_SPEED);
      expect(calculateSpeed(100000)).toBe(MAX_HORIZONTAL_SPEED);
    });
  });

  describe('30-Tick Jump Trajectory & Ground Plane Clamping', () => {
    it('calculates precise (X, Y) coordinate curves over 30 sequential ticks ensuring gravity cannot drop Maisy through ground floor plane (Y = 0)', () => {
      let state: PlayerPhysicsState = {
        x: 0,
        y: GROUND_Y,
        vy: 0,
        isGrounded: true,
        isDucking: false,
      };

      // Initiate jump
      state = initiateJump(state);
      expect(state.vy).toBe(INITIAL_JUMP_VELOCITY);
      expect(state.isGrounded).toBe(false);

      const trajectory: Array<{ tick: number; x: number; y: number; vy: number; isGrounded: boolean }> = [];

      for (let tick = 1; tick <= 30; tick++) {
        state = updatePlayerPhysics(state, 0, true);
        trajectory.push({
          tick,
          x: state.x,
          y: state.y,
          vy: state.vy,
          isGrounded: state.isGrounded,
        });

        // INVARIANT: Maisy cannot drop through the ground floor plane (Y <= 0)
        expect(state.y).toBeLessThanOrEqual(GROUND_Y);
      }

      // At tick 1, Maisy has moved up (negative y)
      expect(trajectory[0].y).toBeLessThan(0);

      // Verify Maisy eventually lands by tick 25-30 and is clamped exactly at GROUND_Y (0)
      const finalState = trajectory[29]; // Tick 30
      expect(finalState.y).toBe(GROUND_Y);
      expect(finalState.vy).toBe(0);
      expect(finalState.isGrounded).toBe(true);

      // Verify horizontal displacement progressed by BASE_HORIZONTAL_SPEED * 30
      expect(finalState.x).toBe(BASE_HORIZONTAL_SPEED * 30);
    });

    it('stays grounded and clamped at Y = 0 if updatePlayerPhysics is called while grounded', () => {
      const groundedState: PlayerPhysicsState = {
        x: 10,
        y: 0,
        vy: 0,
        isGrounded: true,
        isDucking: false,
      };

      const next = updatePlayerPhysics(groundedState, 0, true);
      expect(next.y).toBe(0);
      expect(next.vy).toBe(0);
      expect(next.isGrounded).toBe(true);
      expect(next.x).toBe(10 + BASE_HORIZONTAL_SPEED);
    });
  });

  describe('Terminal Falling Velocity Clamp', () => {
    it('clamps downward vertical velocity to TERMINAL_VELOCITY (16 px/frame)', () => {
      let fallingState: PlayerPhysicsState = {
        x: 0,
        y: -1000, // High in the air
        vy: 12,
        isGrounded: false,
        isDucking: false,
      };

      // Advance multiple ticks without hitting the ground
      for (let i = 0; i < 10; i++) {
        fallingState = updatePlayerPhysics(fallingState, 0, true);
      }

      expect(fallingState.vy).toBe(TERMINAL_VELOCITY);
      expect(fallingState.vy).toBeLessThanOrEqual(TERMINAL_VELOCITY);
    });
  });

  describe('Variable Jump Duration', () => {
    it('cuts vertical thrust upon key release if rising faster than JUMP_CUT_VELOCITY', () => {
      let state: PlayerPhysicsState = {
        x: 0,
        y: GROUND_Y,
        vy: 0,
        isGrounded: true,
        isDucking: false,
      };

      state = initiateJump(state); // vy = -14
      expect(state.vy).toBe(-14);

      // Release jump key on next tick
      state = updatePlayerPhysics(state, 0, false);
      expect(state.vy).toBe(JUMP_CUT_VELOCITY + GRAVITY);
    });

    it('cutJump clamps velocity to JUMP_CUT_VELOCITY only when moving faster upward', () => {
      expect(cutJump(-12)).toBe(JUMP_CUT_VELOCITY);
      expect(cutJump(-2)).toBe(-2);
      expect(cutJump(4)).toBe(4);
    });

    it('does not re-jump if initiateJump is called while already in the air', () => {
      const inAirState: PlayerPhysicsState = {
        x: 0,
        y: -10,
        vy: -5,
        isGrounded: false,
        isDucking: false,
      };

      const result = initiateJump(inAirState);
      expect(result).toEqual(inAirState);
    });
  });

  describe('Ducking Physics in Air', () => {
    it('applies accelerated falling gravity when ducking in air', () => {
      const normalInAir: PlayerPhysicsState = {
        x: 0,
        y: -50,
        vy: 0,
        isGrounded: false,
        isDucking: false,
      };

      const duckingInAir: PlayerPhysicsState = {
        ...normalInAir,
        isDucking: true,
      };

      const nextNormal = updatePlayerPhysics(normalInAir, 0, true);
      const nextDucking = updatePlayerPhysics(duckingInAir, 0, true);

      expect(nextDucking.vy).toBeGreaterThan(nextNormal.vy);
    });
  });
});
