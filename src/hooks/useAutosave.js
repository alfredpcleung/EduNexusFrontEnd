import { useEffect, useRef } from 'react';

/**
 * Custom hook for autosaving data at a given interval.
 * @param {Function} onSave - Function to call for saving.
 * @param {Array} deps - Dependencies to watch for changes.
 * @param {number} intervalMs - Interval in milliseconds.
 */
export default function useAutosave(onSave, deps = [], intervalMs = 30000) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = onSave;
  }, [onSave]);

  useEffect(() => {
    if (!onSave) return;
    const handler = () => savedCallback.current && savedCallback.current();
    const id = setInterval(handler, intervalMs);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, intervalMs]);
}
