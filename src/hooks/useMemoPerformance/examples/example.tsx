import { useState, useMemo, useCallback } from 'react';
import { useMemoPerformance } from '../useMemoPerformance';

/**
 * Example usage of useMemoPerformance.
 * Demonstrates performance analysis for a few different scenarios.
 */
export function MemoPerformanceExample() {
  const [count, setCount] = useState(0);
  const [items, setItems] = useState(1000);
  const [enableMemo, setEnableMemo] = useState(true);

  // A deliberately slow computation
  const expensiveCalculation = useCallback(() => {
    console.log('🔄 Running expensive computation...');
    return Array.from({ length: items }, (_, i) => i)
      .filter((num) => num % 2 === 0)
      .reduce((sum, num) => sum + num, 0);
  }, [items]);

  const performanceStats = useMemoPerformance(expensiveCalculation, [items], {
    minCalls: 5,
    performanceThreshold: 1,
    enableLogging: true,
    name: 'ExpensiveCalculation',
  });

  // The hook must be called unconditionally on every render — the enableMemo
  // toggle only affects which value we display below.
  const memoizedValue = useMemo(
    () => expensiveCalculation(),
    [expensiveCalculation]
  );
  const displayedValue = enableMemo
    ? memoizedValue
    : expensiveCalculation();

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>🔬 useMemo performance analysis</h2>

      <div style={{ marginBottom: '20px' }}>
        <label>
          <input
            type="checkbox"
            checked={enableMemo}
            onChange={(e) => setEnableMemo(e.target.checked)}
          />{' '}
          Enable useMemo
        </label>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label>
          Number of items:
          <input
            type="number"
            value={items}
            onChange={(e) => setItems(Number(e.target.value))}
            style={{ marginLeft: '10px', padding: '5px' }}
          />
        </label>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button
          type="button"
          onClick={() => setCount((c) => c + 1)}
          style={{ padding: '10px 20px', fontSize: '16px' }}
        >
          Re-render (count: {count})
        </button>
      </div>

      <div
        style={{
          backgroundColor: '#f5f5f5',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '20px',
        }}
      >
        <h3>📊 Performance stats:</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li>
            Renders: <strong>{performanceStats.renderCount}</strong>
          </li>
          <li>
            Baseline time (most recent computation):{' '}
            <strong>{performanceStats.baselineTime.toFixed(3)}ms</strong>
          </li>
          <li>
            Cache hits / misses:{' '}
            <strong>
              {performanceStats.cacheHits} / {performanceStats.cacheMisses}
            </strong>
          </li>
          <li>
            Cache efficiency:{' '}
            <strong>{performanceStats.cacheEfficiency.toFixed(1)}%</strong>
          </li>
          <li>
            Is memoization worth it:{' '}
            <strong
              style={{
                color: performanceStats.isMemoizationWorthIt ? 'green' : 'red',
              }}
            >
              {performanceStats.isMemoizationWorthIt ? '✅ Yes' : '❌ No'}
            </strong>
          </li>
        </ul>
      </div>

      <div
        style={{
          backgroundColor: '#e8f4fd',
          padding: '15px',
          borderRadius: '8px',
          border: '1px solid #bee5eb',
        }}
      >
        <h3>💡 Recommendation:</h3>
        {performanceStats.isMemoizationWorthIt ? (
          <p style={{ color: 'green', margin: 0 }}>
            ✅ <strong>useMemo is worth it!</strong> Memoization improves
            performance here.
          </p>
        ) : (
          <p style={{ color: 'red', margin: 0 }}>
            ❌ <strong>useMemo may be overkill</strong> for this computation.
          </p>
        )}

        {performanceStats.baselineTime < 0.1 && (
          <p style={{ color: 'orange', margin: '10px 0 0 0' }}>
            ⚠️ <strong>Note:</strong> useMemo may be unnecessary for
            computations this cheap.
          </p>
        )}
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3>Computation result:</h3>
        <p style={{ fontSize: '18px', fontWeight: 'bold' }}>{displayedValue}</p>
      </div>
    </div>
  );
}

/**
 * Example with a fast computation, where useMemo isn't needed.
 */
export function FastCalculationExample() {
  const [count, setCount] = useState(0);

  const fastCalculation = useCallback(() => {
    return count * 2;
  }, [count]);

  const performanceStats = useMemoPerformance(fastCalculation, [count], {
    minCalls: 3,
    enableLogging: true,
    name: 'FastCalculation',
  });

  const result = useMemo(() => fastCalculation(), [fastCalculation]);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>⚡ Fast computation</h2>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount((c) => c + 1)}>
        Increase
      </button>
      <p>Result: {result}</p>

      <div
        style={{
          backgroundColor: '#fff3cd',
          padding: '10px',
          borderRadius: '4px',
          marginTop: '10px',
        }}
      >
        <strong>Analysis:</strong>{' '}
        {performanceStats.isMemoizationWorthIt
          ? 'useMemo is worth it'
          : 'useMemo is overkill'}
      </div>
    </div>
  );
}
