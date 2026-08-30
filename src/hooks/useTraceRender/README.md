# useTraceRender

Logs every render of a component with its full current props, whether or not
anything actually changed.

## Description

`useWhyRender` only logs when a prop's value changed. `useTraceRender` logs
on *every* render, which is useful for investigating renders that
`useWhyRender` won't flag - e.g. ones triggered by context, a forced update,
or a parent re-rendering with referentially-equal props.

## Usage

```tsx
import { useTraceRender } from '@atmelab/react-diagnostic-tools';

function MyComponent(props: { name: string; age: number }) {
  useTraceRender(props, 'MyComponent');

  return <div>{props.name}</div>;
}
```

## API

```tsx
function useTraceRender(props: Record<string, unknown>, name?: string): void;
```

- `props` - the component's props
- `name` - component name used in the console output (optional)

## Console output example

```
🔍 MyComponent rendered (2)
Props: { name: "John", age: 26 }
Changed: { age: { from: 25, to: 26 } }
```

The `Changed:` line only appears when something actually changed.
