import { getDebugToolsConfig } from '../../core/config';
import { createRateLimiter } from '../../core/throttle';

export interface WithExecutionTimingOptions {
  /** Name used in the console output (default: 'withExecutionTiming') */
  name?: string;
  /** Log a warning via the configured logger when duration exceeds this many milliseconds. */
  warnIfAbove?: number;
}

/**
 * Wraps any function so that every call is timed and logged, transparently
 * passing through its arguments and return value. Works anywhere - inside a
 * component, an event handler, a plain utility module - not just during
 * render.
 *
 * If the wrapped function returns a promise, the promise is awaited and the
 * logged duration covers the full time to resolution, not just the
 * synchronous part of the call.
 *
 * The regular per-call log line respects the global `throttleMs` (see
 * `configureDebugTools`) so wrapping a hot-path function doesn't flood the
 * console. `warnIfAbove` is never throttled - it's meant to be rare.
 *
 * @param fn - the function to wrap
 * @param options - configuration options
 */
export function withExecutionTiming<Args extends unknown[], R>(
  fn: (...args: Args) => R,
  options: WithExecutionTimingOptions = {}
): (...args: Args) => R {
  const { name = 'withExecutionTiming', warnIfAbove } = options;
  const rateLimiter = createRateLimiter();

  const report = (duration: number): void => {
    const { enabled, logger, throttleMs } = getDebugToolsConfig();
    if (!enabled) {
      return;
    }

    if (rateLimiter.shouldEmit(throttleMs)) {
      logger.log(`⏱️ ${name} took ${duration.toFixed(3)}ms`);
    }

    if (warnIfAbove !== undefined && duration > warnIfAbove) {
      logger.warn(
        `⏱️ ${name} took ${duration.toFixed(3)}ms, above the ${warnIfAbove}ms threshold`
      );
    }
  };

  return (...args: Args): R => {
    const start = performance.now();
    const result = fn(...args);

    if (result instanceof Promise) {
      return result.then((value) => {
        report(performance.now() - start);
        return value;
      }) as R;
    }

    report(performance.now() - start);
    return result;
  };
}
