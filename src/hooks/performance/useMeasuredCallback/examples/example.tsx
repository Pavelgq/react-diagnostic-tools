import type React from 'react';
import { useState } from 'react';
import { useMeasuredCallback } from '../useMeasuredCallback';

const MeasuredCallbackExample: React.FC = () => {
  const [items, setItems] = useState<number[]>([]);

  const handleAdd = useMeasuredCallback(
    () => {
      let sum = 0;
      for (let i = 0; i < 1_000_000; i++) sum += i;
      setItems((prev) => [...prev, sum]);
    },
    [],
    { name: 'handleAdd', warnIfAbove: 5 }
  );

  return (
    <div style={{ padding: '20px' }}>
      <h2>useMeasuredCallback example</h2>
      <button type="button" onClick={handleAdd}>
        Add item
      </button>
      <p>Items: {items.length}</p>
    </div>
  );
};

export default MeasuredCallbackExample;
