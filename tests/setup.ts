// tests/setup.ts
import { beforeEach } from 'vitest';

beforeEach(() => {
  // Reset localStorage between tests
  try {
    localStorage.clear();
  } catch {
    // Ignore if localStorage is mocked as disabled
  }
});
