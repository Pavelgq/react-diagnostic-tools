import { useDebugValue, useLayoutEffect, useRef } from 'react';
import { getDebugToolsConfig } from '../../../core/config';

/**
 * Labels a value for React DevTools (via `useDebugValue`) and logs to the
 * console whenever it changes. Returns `value` unchanged, so it can wrap a
 * value inline without disrupting the surrounding code.
 *
 * @param value - the value to track
 * @param name - label used in DevTools and the console output (optional)
 */
export function useTrackedValue<T>(value: T, name?: string): T {
  useDebugValue(name ? `${name}: ${String(value)}` : value);

  const previousValue = useRef(value);

  useLayoutEffect(() => {
    if (previousValue.current === value) {
      return;
    }

    const { enabled, logger } = getDebugToolsConfig();
    if (enabled) {
      logger.log(`🏷️ ${name || 'Value'} changed:`, {
        from: previousValue.current,
        to: value,
      });
    }

    previousValue.current = value;
  }, [value, name]);

  return value;
}
