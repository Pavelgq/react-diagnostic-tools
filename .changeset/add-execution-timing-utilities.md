---
"@atme-lab/react-diagnostic-tools": minor
---

Add `withExecutionTiming` (wraps any function so every call is timed and logged) and `useMeasuredCallback` (a drop-in `useCallback` with the same timing/logging built in). `useMemoGuard` was removed before its first real release in favor of this simpler, more general approach.
