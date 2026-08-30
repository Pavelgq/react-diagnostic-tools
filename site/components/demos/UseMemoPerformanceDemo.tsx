'use client';

import { useCallback, useMemo, useState } from 'react';
import { useMemoPerformance } from 'react-debug-tools';

export function UseMemoPerformanceDemo() {
  const [count, setCount] = useState(0);
  const [items, setItems] = useState(2000);

  const expensiveCalculation = useCallback(() => {
    return Array.from({ length: items }, (_, i) => i)
      .filter((n) => n % 2 === 0)
      .reduce((sum, n) => sum + n, 0);
  }, [items]);

  const stats = useMemoPerformance(expensiveCalculation, [items], {
    minCalls: 3,
    performanceThreshold: 1,
    enableLogging: true,
    name: 'ExpensiveCalculation',
  });

  const memoizedValue = useMemo(
    () => expensiveCalculation(),
    [expensiveCalculation]
  );

  return (
    <div className="rdt-demo">
      <div className="rdt-demo-row">
        <label>
          Items:
          <input
            type="number"
            value={items}
            onChange={(e) => setItems(Number(e.target.value) || 0)}
          />
        </label>
        <button type="button" onClick={() => setCount((c) => c + 1)}>
          Re-render (count: {count})
        </button>
      </div>

      <p>Result: {memoizedValue}</p>

      <div className="rdt-demo-stats">
        Calls: <strong>{stats.callCount}</strong> · baseline:{' '}
        <strong>{stats.baselineTime.toFixed(3)}ms</strong>
        <br />
        Memoization efficiency:{' '}
        <strong>{stats.memoizationEfficiency.toFixed(1)}%</strong>
        <br />
        Worth it:{' '}
        <strong>{stats.isMemoizationWorthIt ? 'Yes ✅' : 'No ❌'}</strong> -{' '}
        {stats.recommendationReason}
      </div>

      <p className="rdt-demo-note">
        Open the browser console for the full performance report. Re-render
        with the same item count to see cached calls; change the item count
        to force a fresh computation.
      </p>
    </div>
  );
}
