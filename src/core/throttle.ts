/**
 * A minimal rate limiter for hot-path console logging.
 * Each instance tracks its own "last emitted" timestamp; `shouldEmit`
 * reads the throttle window fresh on every call, so it stays correct even
 * if the window is changed at runtime via `configureDebugTools`.
 */
export function createRateLimiter() {
  let lastEmittedAt = -Infinity;

  return {
    shouldEmit(throttleMs: number): boolean {
      const now = Date.now();
      if (now - lastEmittedAt < throttleMs) {
        return false;
      }
      lastEmittedAt = now;
      return true;
    },
  };
}
