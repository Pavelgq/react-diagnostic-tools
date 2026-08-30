import {
  type Dispatch,
  type SetStateAction,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { getDebugToolsConfig } from '../../../core/config';

/**
 * A drop-in replacement for `useState` that logs every state change to the
 * console: the previous value, the new value, and how many times it has
 * changed so far. Does not log on the initial render.
 *
 * @param initialValue - same as `useState`'s initial value (or initializer)
 * @param name - name used in the console output (optional)
 */
export function useStateLogger<T>(
  initialValue: T | (() => T),
  name?: string
): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState(initialValue);
  const previousState = useRef(state);
  const changeCount = useRef(0);

  useLayoutEffect(() => {
    if (previousState.current === state) {
      return;
    }

    changeCount.current += 1;

    const { enabled, logger } = getDebugToolsConfig();
    if (enabled) {
      logger.group(`📦 ${name || 'State'} changed (${changeCount.current})`);
      logger.log('From:', previousState.current);
      logger.log('To:', state);
      logger.groupEnd();
    }

    previousState.current = state;
  }, [state, name]);

  return [state, setState];
}
