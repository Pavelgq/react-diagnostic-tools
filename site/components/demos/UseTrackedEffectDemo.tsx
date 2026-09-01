'use client';

import { useState } from 'react';
import { useTrackedEffect } from '@atme-lab/react-diagnostic-tools';

export function UseTrackedEffectDemo() {
  const [userId, setUserId] = useState(1);
  const [query, setQuery] = useState('');
  const [runs, setRuns] = useState(0);

  useTrackedEffect(
    () => {
      setRuns((r) => r + 1);
    },
    [userId, query],
    { name: 'fetchData', depNames: ['userId', 'query'] }
  );

  return (
    <div className="rdt-demo">
      <div className="rdt-demo-stats">
        Effect ran <strong>{runs}</strong> time(s)
      </div>
      <div className="rdt-demo-row">
        <button type="button" onClick={() => setUserId((id) => id + 1)}>
          Change userId ({userId})
        </button>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Change query"
        />
      </div>
      <p className="rdt-demo-note">
        Open the browser console - each button/input change re-runs the
        effect and logs exactly which dependency (userId or query) caused
        it.
      </p>
    </div>
  );
}
