export { useWhyRender } from './hooks/useWhyRender';
export { useMemoPerformance } from './hooks/useMemoPerformance';
export { usePrevious } from './hooks/usePrevious';
export { useRenderCount } from './hooks/useRenderCount';
export { useTraceRender } from './hooks/useTraceRender';
export { useStateLogger } from './hooks/useStateLogger';
export { useTrackedValue } from './hooks/useTrackedValue';
export { useExecutionTime } from './hooks/useExecutionTime';

export { configureDebugTools, getDebugToolsConfig } from './core/config';
export type {
  Logger,
  DebugToolsConfig,
  DebugToolsOptions,
} from './core';
