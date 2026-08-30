import type { Metadata } from 'next';
import type { FC, ReactNode } from 'react';
import { Footer, Layout, Navbar } from 'nextra-theme-docs';
import { getPageMap } from 'nextra/page-map';
import { DebugToolsSetup } from '../components/DebugToolsSetup';
import { Logo } from '../components/Logo';
import 'nextra-theme-docs/style.css';
import './globals.css';

const REPO_URL = 'https://github.com/Pavelgq/react-diagnostic-tools';

export const metadata: Metadata = {
  title: {
    default: 'React Diagnostic Tools',
    template: '%s | React Diagnostic Tools',
  },
  description:
    'A small collection of React hooks for debugging renders, state, and performance during development.',
};

const navbar = (
  <Navbar
    logo={
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
        <Logo size={22} />
        <b>React Diagnostic Tools</b>{' '}
        <span style={{ opacity: 0.6 }}>hooks and utils for debugging, performance, and state</span>
      </span>
    }
    projectLink={REPO_URL}
  />
);

const footer = (
  <Footer>
    <span>
      MIT {new Date().getFullYear()} © React Diagnostic Tools.
    </span>
  </Footer>
);

const RootLayout: FC<{ children: ReactNode }> = async ({ children }) => {
  const pageMap = await getPageMap();
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body>
        <DebugToolsSetup />
        <Layout
          navbar={navbar}
          footer={footer}
          pageMap={pageMap}
          docsRepositoryBase={`${REPO_URL}/tree/main/site`}
          sidebar={{ defaultMenuCollapseLevel: 1 }}
        >
          {children}
        </Layout>
      </body>
    </html>
  );
};

export default RootLayout;
