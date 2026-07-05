import { useCallback, useRef } from 'react';

/** Reliable tap handler for Android WebView / APK wrappers where click alone can fail. */
export function useStableTap(action) {
  const lockRef = useRef(false);

  return useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (lockRef.current) return;
      lockRef.current = true;
      action();
      window.setTimeout(() => {
        lockRef.current = false;
      }, 450);
    },
    [action]
  );
}
