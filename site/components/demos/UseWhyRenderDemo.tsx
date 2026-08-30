'use client';

import { useState } from 'react';
import { useWhyRender } from 'react-debug-tools';

interface InnerProps {
  name: string;
  age: number;
  isActive: boolean;
}

function Inner({ name, age, isActive }: InnerProps) {
  const info = useWhyRender({ name, age, isActive }, 'Inner');

  return (
    <div className="rdt-inner-box">
      <p>
        {name}, age {age} - {isActive ? 'Active' : 'Inactive'}
      </p>
      <div className="rdt-demo-stats">
        Render #<strong>{info.renderCount}</strong> · changed props:{' '}
        <strong>{info.changedPropsCount}</strong>
      </div>
    </div>
  );
}

export function UseWhyRenderDemo() {
  const [name, setName] = useState('Alice');
  const [age, setAge] = useState(25);
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="rdt-demo">
      <div className="rdt-demo-row">
        <button
          type="button"
          onClick={() => setName((n) => (n === 'Alice' ? 'Bob' : 'Alice'))}
        >
          Change name
        </button>
        <button type="button" onClick={() => setAge((a) => a + 1)}>
          Increase age
        </button>
        <button type="button" onClick={() => setIsActive((a) => !a)}>
          Toggle status
        </button>
      </div>

      <Inner name={name} age={age} isActive={isActive} />

      <p className="rdt-demo-note">
        Open the browser console - each click logs which props changed and
        their old/new values.
      </p>
    </div>
  );
}
