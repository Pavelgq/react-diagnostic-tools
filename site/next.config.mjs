import nextra from 'nextra';

const withNextra = nextra({
  defaultShowCopyCode: true,
});

export default withNextra({
  output: 'export',
  images: {
    unoptimized: true,
  },
  turbopack: {
    resolveAlias: {
      'next-mdx-import-source-file': './mdx-components.tsx',
    },
  },
});
