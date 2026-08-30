'use client';

import { useState } from 'react';
import { useTrackedValue } from '@atmelab/react-diagnostic-tools';

export function UseTrackedValueDemo() {
  const [items, setItems] = useState(['a', 'b', '']);
  const activeCount = useTrackedValue(
    items.filter((item) => item.length > 0).length,
    'activeCount'
  );

  return (
    <div className="rdt-demo">
      <p>
        Items: <code>{JSON.stringify(items)}</code>
      </p>
      <div className="rdt-demo-stats">
        Active items: <strong>{activeCount}</strong>
      </div>
      <div className="rdt-demo-row">
        <button
          type="button"
          onClick={() => setItems((prev) => [...prev, 'x'])}
        >
          Add non-empty item
        </button>
        <button type="button" onClick={() => setItems((prev) => [...prev, ''])}>
          Add empty item
        </button>
      </div>
      <p className="rdt-demo-note">
        Open the browser console and React DevTools - the value is logged on
        change and labeled next to this component in the Components panel
        (look for &quot;activeCount&quot;).
      </p>
    </div>
  );
}
