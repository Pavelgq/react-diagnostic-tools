import type React from 'react';
import { useState } from 'react';
import { useTrackedEffect } from '../useTrackedEffect';

const TrackedEffectExample: React.FC = () => {
  const [userId, setUserId] = useState(1);
  const [query, setQuery] = useState('');

  useTrackedEffect(
    () => {
      console.log('Fetching data for', userId, query);
    },
    [userId, query],
    { name: 'fetchData', depNames: ['userId', 'query'] }
  );

  return (
    <div style={{ padding: '20px' }}>
      <h2>useTrackedEffect example</h2>
      <button type="button" onClick={() => setUserId((id) => id + 1)}>
        Change user ({userId})
      </button>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
    </div>
  );
};

export default TrackedEffectExample;
