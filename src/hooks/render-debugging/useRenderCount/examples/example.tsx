import type React from 'react';
import { useState } from 'react';
import { useRenderCount } from '../useRenderCount';

const RenderCountExample: React.FC = () => {
  const [count, setCount] = useState(0);
  const renderCount = useRenderCount('RenderCountExample');

  return (
    <div style={{ padding: '20px' }}>
      <h2>useRenderCount example</h2>
      <p>Rendered {renderCount} times</p>
      <button type="button" onClick={() => setCount((c) => c + 1)}>
        Force a re-render (count: {count})
      </button>
    </div>
  );
};

export default RenderCountExample;
