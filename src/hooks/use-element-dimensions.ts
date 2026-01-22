import { useEffect, useRef, useState } from 'react';

interface Dimensions {
  width: number;
  height: number;
}

export function useElementDimensions<T extends HTMLElement = HTMLDivElement>(): [
  React.RefObject<T | null>,
  Dimensions,
] {
  const ref = useRef<T>(null);
  const [dimensions, setDimensions] = useState<Dimensions>({ width: 0, height: 0 });

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });

    resizeObserver.observe(ref.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return [ref, dimensions];
}
