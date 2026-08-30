'use client';

import { useEffect, useState, type ReactNode } from 'react';

/**
 * Renders `children` only after mounting on the client. Demos that measure
 * real wall-clock time (`performance.now()`) compute different numbers
 * during the static build than during the browser's own first render, which
 * React's hydration check flags as a mismatch - this sidesteps that by
 * rendering an identical `fallback` on both the server and the client's
 * first pass, then swapping in the real, client-only content afterwards.
 */
export function ClientOnly({
  children,
  fallback = null,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return <>{mounted ? children : fallback}</>;
}
