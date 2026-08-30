import { type Logger, consoleLogger } from './logger';

export interface DebugToolsConfig {
  /**
   * Master switch for all console output from every hook in this package.
   * Defaults to `false` when a bundler-injected `process.env.NODE_ENV`
   * reads `"production"`, `true` otherwise - this is a debugging tool, so
   * it stays quiet in production builds unless you explicitly turn it on.
   */
  enabled: boolean;
  /** Logger used for all console output. Swap it for your own implementation of the `Logger` interface. */
  logger: Logger;
  /** Minimum time in milliseconds between log emissions for hot-path hooks (0 = no throttling). */
  throttleMs: number;
}

export type DebugToolsOptions = Partial<DebugToolsConfig>;

// `process.env.NODE_ENV` is written in the plain, non-optional-chained form
// bundlers (webpack, Next.js, etc.) recognize and statically replace at
// build time - most apps never see the `typeof process` branch at runtime
// at all. Guarded so it's also safe in environments with no `process`.
declare const process: { env: { NODE_ENV?: string } } | undefined;
const isProductionEnv =
  typeof process !== 'undefined' && process.env.NODE_ENV === 'production';

const defaultConfig: DebugToolsConfig = {
  enabled: !isProductionEnv,
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
