# useWhyRender

A hook for debugging React re-renders. Reports which props changed and
triggered the re-render.

## Usage

```tsx
import React from 'react';
import { useWhyRender } from 'react-debug-tools';

interface MyComponentProps {
  name: string;
  age: number;
  isActive: boolean;
}

const MyComponent: React.FC<MyComponentProps> = ({ name, age, isActive }) => {
  useWhyRender({ name, age, isActive }, 'MyComponent');

  return (
    <div>
      <h1>{name}</h1>
      <p>Age: {age}</p>
      <p>Status: {isActive ? 'Active' : 'Inactive'}</p>
    </div>
  );
};
```

## API

```tsx
function useWhyRender(props: Record<string, any>, name?: string): WhyRenderInfo;
```

**Parameters:**

- `props` - the component's props
- `name` - component name used in the console output (optional)

**Returns:**

```tsx
interface WhyRenderInfo {
  changedProps: Record<string, { from: any; to: any }>;
  changedPropsCount: number;
  renderCount: number;
}
```

- `changedProps` - the props that changed and their old/new values
- `changedPropsCount` - how many props changed
- `renderCount` - how many times the component has rendered

## Console output example

```
🔄 MyComponent rendered (2)
Changed props: {
  age: { from: 25, to: 26 },
  isActive: { from: false, to: true }
}
All props: { name: "John", age: 26, isActive: true }
```
