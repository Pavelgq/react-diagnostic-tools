# useTrackedValue

Labels a value for React DevTools and logs to the console whenever it
changes.

## Description

`useTrackedValue` wraps React's built-in `useDebugValue` so the value shows
up next to the component in React DevTools, and additionally logs the old
and new value to the console whenever it changes. It returns the value
unchanged, so it can wrap a value inline without disrupting the surrounding
code.

## Usage

```tsx
import { useTrackedValue } from '@atmelab/react-diagnostic-tools';

function MyComponent({ items }: { items: string[] }) {
  const activeCount = useTrackedValue(
    items.filter((item) => item.length > 0).length,
    'activeCount'
  );

  return <p>Active: {activeCount}</p>;
}
```

## API

```tsx
function useTrackedValue<T>(value: T, name?: string): T;
```

- `value` - the value to track
- `name` - label used in DevTools and the console output (optional)
- Returns `value`, unchanged

## Console output example

```
🏷️ activeCount changed: { from: 2, to: 3 }
```
