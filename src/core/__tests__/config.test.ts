import {
  configureDebugTools,
  getDebugToolsConfig,
  resetDebugToolsConfig,
} from '../config';
import { consoleLogger } from '../logger';

describe('debug tools config', () => {
  afterEach(() => {
    resetDebugToolsConfig();
  });

  it('defaults to the console logger, enabled, with no throttling', () => {
    expect(getDebugToolsConfig()).toEqual({
      enabled: true,
      logger: consoleLogger,
      throttleMs: 0,
    });
  });

  it('merges partial overrides into the current config', () => {
    configureDebugTools({ enabled: false });

    expect(getDebugToolsConfig()).toMatchObject({
      enabled: false,
      logger: consoleLogger,
      throttleMs: 0,
    });
  });

  it('accepts a custom logger implementation', () => {
    const customLogger = {
      log: jest.fn(),
      warn: jest.fn(),
      group: jest.fn(),
      groupEnd: jest.fn(),
    };

    configureDebugTools({ logger: customLogger });

    expect(getDebugToolsConfig().logger).toBe(customLogger);
  });

  it('restores the defaults on reset', () => {
    configureDebugTools({ enabled: false, throttleMs: 500 });
    resetDebugToolsConfig();

    expect(getDebugToolsConfig()).toEqual({
      enabled: true,
      logger: consoleLogger,
      throttleMs: 0,
    });
  });

  it('defaults to disabled when NODE_ENV is "production"', () => {
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    jest.isolateModules(() => {
      const prodConfig = require('../config');
      expect(prodConfig.getDebugToolsConfig().enabled).toBe(false);
    });

    process.env.NODE_ENV = originalNodeEnv;
  });
});
