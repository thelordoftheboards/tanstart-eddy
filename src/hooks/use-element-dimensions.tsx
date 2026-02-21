import { useEffect, useRef, useState } from 'react';

interface Dimensions {
  height: number;
  width: number;
}

export function useElementDimensions<T extends HTMLElement = HTMLDivElement>(): [
  React.RefObject<T | null>,
  Dimensions,
] {
  const ref = useRef<T>(null);
  const [dimensions, setDimensions] = useState<Dimensions>({ height: 0, width: 0 });

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setDimensions({
          height: entry.contentRect.height,
          width: entry.contentRect.width,
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
