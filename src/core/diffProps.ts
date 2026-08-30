export interface PropChange {
  from: unknown;
  to: unknown;
}

/**
 * Returns the keys that differ (by `!==`) between `previous` and `current`,
 * along with their old/new values. Returns an empty object when there is no
 * previous snapshot yet (e.g. on the first render).
 */
export function diffProps(
  previous: Record<string, unknown> | undefined,
  current: Record<string, unknown>
): Record<string, PropChange> {
  const changed: Record<string, PropChange> = {};

  if (!previous) {
    return changed;
  }

  const allKeys = Object.keys({ ...previous, ...current });

  for (const key of allKeys) {
    if (previous[key] !== current[key]) {
      changed[key] = { from: previous[key], to: current[key] };
    }
  }

  return changed;
}
