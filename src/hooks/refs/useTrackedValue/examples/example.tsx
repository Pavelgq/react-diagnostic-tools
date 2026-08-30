import type React from 'react';
import { useState } from 'react';
import { useTrackedValue } from '../useTrackedValue';

const TrackedValueExample: React.FC = () => {
  const [items, setItems] = useState(['a', 'b', '']);
  const activeCount = useTrackedValue(
    items.filter((item) => item.length > 0).length,
    'activeCount'
  );

  return (
    <div style={{ padding: '20px' }}>
      <h2>useTrackedValue example</h2>
      <p>Active items: {activeCount}</p>
      <button type="button" onClick={() => setItems((prev) => [...prev, 'x'])}>
        Add item
      </button>
    </div>
  );
};

export default TrackedValueExample;
