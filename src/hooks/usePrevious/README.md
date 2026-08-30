# usePrevious

Returns the value from the previous render.

## Usage

```tsx
import { usePrevious } from '@atme-lab/react-diagnostic-tools';

function Counter({ count }: { count: number }) {
  const previousCount = usePrevious(count);

  return (
    <p>
      Now: {count}, before: {previousCount ?? 'n/a'}
    </p>
  );
}
```

## API

```tsx
function usePrevious<T>(value: T): T | undefined;
```

- `value` - the value to track across renders
- Returns the value from the previous render, or `undefined` on the first render

This hook does not log anything to the console - it's a plain utility for
comparing renders, meant to be composed with other hooks like `useWhyRender`.
