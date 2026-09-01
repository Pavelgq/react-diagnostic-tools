import { type EffectCallback, useEffect, useRef } from 'react';
import { getDebugToolsConfig } from '../../../core/config';
import { diffProps } from '../../../core/diffProps';

export interface UseTrackedEffectOptions {
  /** Name used in the console output (default: 'useTrackedEffect') */
  name?: string;
  /**
   * Labels for each dependency, matched positionally to `deps`. Falls back
   * to `dep[0]`, `dep[1]`, ... for any dependency without a label.
   */
  depNames?: string[];
}

function toRecord(
  deps: React.DependencyList,
  depNames: string[] | undefined
): Record<string, unknown> {
  const record: Record<string, unknown> = {};
  deps.forEach((dep, i) => {
    record[depNames?.[i] ?? `dep[${i}]`] = dep;
  });
  return record;
}

/**
 * Wraps `useEffect` and reports which dependency changed and caused it to
 * re-run - the same idea as `useWhyRender`, applied to effects instead of
 * renders. Only logs when React actually calls the effect (i.e. relies on
 * React's own dependency comparison, not a separate one), so the report
 * always matches the real reason the effect ran.
 *
 * `useEffect` never runs during server rendering, so unlike
 * `useMemoPerformance`/`useExecutionTime` this hook needs no SSR-safety
 * handling.
 *
 * @param effect - the effect callback, forwarded to the underlying `useEffect`
 * @param deps - the dependency list, forwarded to the underlying `useEffect`
 * @param options - configuration options
 */
export function useTrackedEffect(
  effect: EffectCallback,
  deps: React.DependencyList,
  options: UseTrackedEffectOptions = {}
): void {
  const { name = 'useTrackedEffect', depNames } = options;
  const previousDeps = useRef<Record<string, unknown> | undefined>(undefined);
  const isFirstRun = useRef(true);

  useEffect(() => {
    const currentDeps = toRecord(deps, depNames);

    const { enabled, logger } = getDebugToolsConfig();
    if (enabled) {
      if (isFirstRun.current) {
        logger.group(`🎯 ${name} - effect ran (initial)`);
        logger.log('Dependencies:', currentDeps);
        logger.groupEnd();
      } else {
        const changed = diffProps(previousDeps.current, currentDeps);
        logger.group(`🎯 ${name} - effect re-ran`);
        logger.log('Changed dependencies:', changed);
        logger.log('All dependencies:', currentDeps);
        logger.groupEnd();
      }
    }

    isFirstRun.current = false;
    previousDeps.current = currentDeps;

    return effect();
    // biome-ignore lint/correctness/useExhaustiveDependencies: deps is the caller-supplied dependency list this hook wraps useEffect around, not a fixed literal.
  }, deps);
}
