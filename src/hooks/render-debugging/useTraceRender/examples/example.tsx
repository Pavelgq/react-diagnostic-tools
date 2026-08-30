import type React from 'react';
import { useState } from 'react';
import { useTraceRender } from '../useTraceRender';

interface InnerProps {
  count: number;
}

const Inner: React.FC<InnerProps> = ({ count }) => {
  useTraceRender({ count }, 'Inner');
  return <p>Count: {count}</p>;
};

const TraceRenderExample: React.FC = () => {
  const [count, setCount] = useState(0);
  const [tick, setTick] = useState(0);

  return (
    <div style={{ padding: '20px' }}>
      <h2>useTraceRender example</h2>
      <Inner count={count} />
      <button type="button" onClick={() => setCount((c) => c + 1)}>
        Change count (logs "Changed")
      </button>
      <button type="button" onClick={() => setTick((t) => t + 1)}>
        Re-render parent only (tick: {tick}) - still logs, no "Changed"
      </button>
    </div>
  );
};

export default TraceRenderExample;
