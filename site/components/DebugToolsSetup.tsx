'use client';

import { configureDebugTools } from '@atme-lab/react-diagnostic-tools';

// This site is a demo of the library's own console output, so it needs
// that output even though `next build` sets NODE_ENV=production (which the
// library treats as "stay quiet" by default in real apps).
configureDebugTools({ enabled: true });

export function DebugToolsSetup() {
  return null;
}
