import { type Logger, consoleLogger } from './logger';

export interface DebugToolsConfig {
  /** Master switch for all console output from every hook in this package. */
  enabled: boolean;
  /** Logger used for all console output. Swap it for your own implementation of the `Logger` interface. */
  logger: Logger;
  /** Minimum time in milliseconds between log emissions for hot-path hooks (0 = no throttling). */
  throttleMs: number;
}

export type DebugToolsOptions = Partial<DebugToolsConfig>;

const defaultConfig: DebugToolsConfig = {
  enabled: true,
  logger: consoleLogger,
  throttleMs: 0,
};

let currentConfig: DebugToolsConfig = { ...defaultConfig };

/**
 * Configures every hook in this package at once - the logger, whether
 * console output is enabled at all, and the throttle window for hot-path
 * hooks. Call this once, e.g. at your app's entry point, instead of passing
 * the same options to every hook call.
 */
export function configureDebugTools(options: DebugToolsOptions): void {
  currentConfig = { ...currentConfig, ...options };
}

export function getDebugToolsConfig(): DebugToolsConfig {
  return currentConfig;
}

/** Restores the default configuration. Mainly useful between tests. */
export function resetDebugToolsConfig(): void {
  currentConfig = { ...defaultConfig };
}
