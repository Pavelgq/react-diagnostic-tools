import { useLayoutEffect, useRef } from 'react';
import { getDebugToolsConfig } from '../../core/config';
import { diffProps, type PropChange } from '../../core/diffProps';

interface WhyRenderInfo {
  changedProps: Record<string, PropChange>;
  changedPropsCount: number;
  renderCount: number;
}

/**
 * Debug hook for React component re-renders.
 * Reports which props changed and triggered the re-render.
 *
 * @param props - the component's props
 * @param name - component name used in the console output (optional)
 * @returns information about what caused the render
 */
export function useWhyRender(props: Record<string, any>, name?: string): WhyRenderInfo {
  const previousProps = useRef<Record<string, any> | undefined>(undefined);
  const renderCount = useRef(1);

  // Computed synchronously so the returned value is correct on the very render that changed.
  const currentChangedProps = diffProps(previousProps.current, props);

  useLayoutEffect(() => {
    renderCount.current += 1;

    const { enabled, logger } = getDebugToolsConfig();
    if (enabled && Object.keys(currentChangedProps).length > 0) {
      logger.group(`🔄 ${name || 'Component'} rendered (${renderCount.current})`);
      logger.log('Changed props:', currentChangedProps);
      logger.log('All props:', props);
      logger.groupEnd();
    }

    previousProps.current = props;
  });

  return {
    changedProps: currentChangedProps,
    changedPropsCount: Object.keys(currentChangedProps).length,
    renderCount: renderCount.current,
  };
}
