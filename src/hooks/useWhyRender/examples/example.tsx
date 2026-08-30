import type React from 'react';
import { useState } from 'react';
import { useWhyRender } from '../useWhyRender';

interface ExampleComponentProps {
  name: string;
  age: number;
  isActive: boolean;
}

const ExampleComponent: React.FC<ExampleComponentProps> = ({
  name,
  age,
  isActive,
}) => {
  const debugInfo = useWhyRender({ name, age, isActive }, 'ExampleComponent');

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '10px' }}>
      <h2>{name}</h2>
      <p>Age: {age}</p>
      <p>Status: {isActive ? 'Active' : 'Inactive'}</p>
      <div style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
        <p>Renders: {debugInfo.renderCount}</p>
        <p>Changed props: {debugInfo.changedPropsCount}</p>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [name, setName] = useState('Alice');
  const [age, setAge] = useState(25);
  const [isActive, setIsActive] = useState(false);

  return (
    <div style={{ padding: '20px' }}>
      <h1>useWhyRender example</h1>

      <div style={{ marginBottom: '20px' }}>
        <button
          type="button"
          onClick={() => setName(name === 'Alice' ? 'Bob' : 'Alice')}
          style={{ margin: '5px', padding: '8px 16px' }}
        >
          Change name
        </button>
        <button
          type="button"
          onClick={() => setAge(age + 1)}
          style={{ margin: '5px', padding: '8px 16px' }}
        >
          Increase age
        </button>
        <button
          type="button"
          onClick={() => setIsActive(!isActive)}
          style={{ margin: '5px', padding: '8px 16px' }}
        >
          Toggle status
        </button>
      </div>

      <ExampleComponent name={name} age={age} isActive={isActive} />

      <p style={{ fontSize: '14px', color: '#666' }}>
        Open the developer console to see the detailed render information.
      </p>
    </div>
  );
};

export default App;
