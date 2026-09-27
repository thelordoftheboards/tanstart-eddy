import { type ReactNode, useEffect, useRef, useState } from 'react';

//

export function Unfold({ children }: { children: ReactNode }) {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const content = contentRef.current;
    if (!content) {
      return;
    }

    const observer = new ResizeObserver(() => {
      setHeight(content.offsetHeight);
    });
    observer.observe(content);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="unfold-height overflow-hidden" style={{ height }}>
      <div ref={contentRef}>{children}</div>
    </div>
  );
}
