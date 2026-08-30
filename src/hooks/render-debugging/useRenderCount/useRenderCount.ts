import { useLayoutEffect, useRef } from 'react';
import { getDebugToolsConfig } from '../../../core/config';

/**
 * Returns how many times this component has rendered, for any reason
 * (state, props, context, a parent re-rendering, ...). Unlike
 * `useWhyRender`, this counts every render, not just the ones where
 * something actually changed.
 *
 * @param name - component name used in the console output (optional)
 */
export function useRenderCount(name?: string): number {
  const renderCount = useRef(1);

  useLayoutEffect(() => {
    renderCount.current += 1;

    const { enabled, logger } = getDebugToolsConfig();
    if (enabled) {
      logger.log(`🔁 ${name || 'Component'} render count: ${renderCount.current}`);
    }
  });

  return renderCount.current;
}
