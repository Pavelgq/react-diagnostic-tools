import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * True once the component has hydrated on the client; false during SSR and
 * the client's first render. Use this to gate any value that can't be
 * computed identically on the server and the client (e.g. a wall-clock
 * timing measurement) - rendering it only after hydration avoids a
 * server/client mismatch, since `useSyncExternalStore` forces a re-render
 * right after hydration when the two snapshots disagree.
 */
export function useIsHydrated(): boolean {
  return useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
}
