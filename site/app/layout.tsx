import type { Metadata } from 'next';
import type { FC, ReactNode } from 'react';
import { Footer, Layout, Navbar } from 'nextra-theme-docs';
import { Head } from 'nextra/components';
import { getPageMap } from 'nextra/page-map';
import 'nextra-theme-docs/style.css';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'React Debug Tools',
    template: '%s | React Debug Tools',
  },
  description:
    'A small collection of React hooks for debugging renders, state, and performance during development.',
};

const navbar = (
  <Navbar
    logo={
      <span>
        <b>React Debug Tools</b>{' '}
        <span style={{ opacity: 0.6 }}>hooks for debugging React apps</span>
      </span>
    }
    projectLink="#"
  />
);

const footer = (
  <Footer>
    <span>
      MIT {new Date().getFullYear()} © React Debug Tools.
    </span>
  </Footer>
);

const RootLayout: FC<{ children: ReactNode }> = async ({ children }) => {
  const pageMap = await getPageMap();
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head faviconGlyph="🐞" />
      <body>
        <Layout
          navbar={navbar}
          footer={footer}
          pageMap={pageMap}
          sidebar={{ defaultMenuCollapseLevel: 1 }}
        >
          {children}
        </Layout>
      </body>
    </html>
  );
};

export default RootLayout;
