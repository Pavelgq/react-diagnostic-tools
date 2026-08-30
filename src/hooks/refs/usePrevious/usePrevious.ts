import { useEffect, useRef } from 'react';

/**
 * Returns the value from the previous render. `undefined` on the first
 * render, since there is no previous value yet.
 *
 * @param value - the value to track across renders
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
}
