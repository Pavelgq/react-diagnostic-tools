export interface Logger {
  log: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  group: (...args: unknown[]) => void;
  groupEnd: () => void;
}

/** Default logger: a thin pass-through to the global `console`. */
export const consoleLogger: Logger = {
  log: (...args) => console.log(...args),
  warn: (...args) => console.warn(...args),
  group: (...args) => console.group(...args),
  groupEnd: () => console.groupEnd(),
};
