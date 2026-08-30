import '@testing-library/jest-dom';

// Мокаем console для тестов
const originalConsole = globalThis.console;
globalThis.console = {
  ...originalConsole,
  group: jest.fn(),
  groupEnd: jest.fn(),
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};
