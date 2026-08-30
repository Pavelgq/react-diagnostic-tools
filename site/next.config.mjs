import nextra from 'nextra';

const withNextra = nextra({
  defaultShowCopyCode: true,
});

const isGithubPages = process.env.GITHUB_PAGES === 'true';

export default withNextra({
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: isGithubPages ? '/react-diagnostic-tools' : '',
  assetPrefix: isGithubPages ? '/react-diagnostic-tools/' : '',
  turbopack: {
    resolveAlias: {
      'next-mdx-import-source-file': './mdx-components.tsx',
    },
  },
});
