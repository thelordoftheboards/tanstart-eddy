// From https://www.joshwcomeau.com/snippets/react-hooks/use-timeout/
// Use: https://www.shadcn.io/hooks/use-timeout

import { useEffect, useRef } from 'react';

export function useTimeout(delay: number | null, callback: () => void) {
  const timeoutRef = useRef<number | undefined>(undefined);
  const savedCallback = useRef(callback);

  console.log('useTimeout IMPLEMENTATION', delay);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay !== null) {
      const tick = () => savedCallback.current();
      timeoutRef.current = window.setTimeout(tick, delay);
    }

    return () => {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    };
  }, [delay]);

  return timeoutRef;
}
