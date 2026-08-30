import type { FC } from 'react';
import Link from 'next/link';
import { Cards } from 'nextra/components';
import { InstallCommand } from '../components/InstallCommand';

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
        <h1>React Diagnostic Tools</h1>
        <p className="rdt-tagline">
          A small collection of React hooks for debugging renders, state, and
          performance during development.
        </p>
        <InstallCommand command="npm install @atmelab/react-diagnostic-tools" />
        <div className="rdt-hero-actions">
          <Link className="rdt-btn rdt-btn-primary" href="/hooks">
            Browse the hooks
          </Link>
          <a
            className="rdt-btn"
            href="https://github.com/Pavelgq/react-diagnostic-tools"
          >
            GitHub
          </a>
          <a
            className="rdt-btn"
            href="https://www.npmjs.com/package/@atmelab/react-diagnostic-tools"
          >
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
                  <span style={{ display: 'block', padding: '1rem 1rem 0.25rem' }}>
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
