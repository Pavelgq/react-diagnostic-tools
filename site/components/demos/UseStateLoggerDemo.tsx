'use client';

import { useStateLogger } from 'react-debug-tools';

export function UseStateLoggerDemo() {
  const [count, setCount] = useStateLogger(0, 'count');

  return (
    <div className="rdt-demo">
      <div className="rdt-demo-row">
        <button type="button" onClick={() => setCount((c) => c + 1)}>
          Count: {count}
        </button>
        <button type="button" onClick={() => setCount(0)}>
          Reset
        </button>
      </div>
      <p className="rdt-demo-note">
        Open the browser console - every change (but not the initial render)
        logs the previous value, the new value, and how many times it has
        changed.
      </p>
    </div>
  );
}
