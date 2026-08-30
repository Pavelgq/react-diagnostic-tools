import type { FC } from 'react';
import { Cards } from 'nextra/components';

interface HookLink {
  name: string;
  description: string;
}

interface Category {
  title: string;
  hooks: HookLink[];
}

const categories: Category[] = [
  {
    title: 'Render debugging',
    hooks: [
      {
        name: 'useWhyRender',
        description: 'Logs which props changed and caused a re-render',
      },
      {
        name: 'useRenderCount',
        description: 'Counts every render, regardless of cause',
      },
      {
        name: 'useTraceRender',
        description: 'Logs the full props on every render, changed or not',
      },
    ],
  },
  {
    title: 'Refs',
    hooks: [
      {
        name: 'usePrevious',
        description: 'Returns the value from the previous render',
      },
      {
        name: 'useTrackedValue',
        description: 'Labels a value in DevTools and logs it on change',
      },
    ],
  },
  {
    title: 'Performance',
    hooks: [
      {
        name: 'useMemoPerformance',
        description: "Analyzes whether a useMemo is actually worth it",
      },
      {
        name: 'useExecutionTime',
        description:
          "Measures a function's execution time, with a warnIfAbove threshold",
      },
    ],
  },
  {
    title: 'State',
    hooks: [
      {
        name: 'useStateLogger',
        description: 'A drop-in useState that logs every change',
      },
    ],
  },
];

const HomePage: FC = () => {
  return (
    <>
      <section className="rdt-hero">
        <h1>React Debug Tools</h1>
        <p className="rdt-tagline">
          A small collection of React hooks for debugging renders, state, and
          performance during development.
        </p>
        <code className="rdt-install">npm install react-debug-tools</code>
        <div className="rdt-hero-actions">
          <a className="rdt-btn rdt-btn-primary" href="/hooks">
            Browse the hooks
          </a>
          <a className="rdt-btn" href="#">
            GitHub
          </a>
          <a className="rdt-btn" href="#">
            npm
          </a>
        </div>
      </section>

      <section className="rdt-section">
        <h2>8 hooks, 4 categories</h2>
        {categories.map((category) => (
          <div className="rdt-category" key={category.title}>
            <h3>{category.title}</h3>
            <Cards num={3}>
              {category.hooks.map((hook) => (
                <Cards.Card
                  key={hook.name}
                  title={hook.name}
                  href={`/hooks/${hook.name}`}
                  arrow
                >
                  <span style={{ display: 'block', padding: '0 1rem 1rem' }}>
                    {hook.description}
                  </span>
                </Cards.Card>
              ))}
            </Cards>
          </div>
        ))}
      </section>
    </>
  );
};

export default HomePage;
