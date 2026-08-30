import { useLayoutEffect, useRef } from 'react';
import { getDebugToolsConfig } from '../../core/config';
import { diffProps } from '../../core/diffProps';

/**
 * Logs every render of a component with its full current props, whether or
 * not anything actually changed. Useful for investigating renders that
 * `useWhyRender` won't flag - e.g. ones triggered by context, a forced
 * update, or a parent re-rendering with referentially-equal props.
 *
 * @param props - the component's props
 * @param name - component name used in the console output (optional)
 */
export function useTraceRender(
  props: Record<string, unknown>,
  name?: string
): void {
  const previousProps = useRef<Record<string, unknown> | undefined>(undefined);
  const renderCount = useRef(1);

  useLayoutEffect(() => {
    const { enabled, logger } = getDebugToolsConfig();

    if (enabled) {
      const changedProps = diffProps(previousProps.current, props);

      logger.group(`🔍 ${name || 'Component'} rendered (${renderCount.current})`);
      logger.log('Props:', props);
      if (Object.keys(changedProps).length > 0) {
        logger.log('Changed:', changedProps);
      }
      logger.groupEnd();
    }

    previousProps.current = props;
    renderCount.current += 1;
  });
}
