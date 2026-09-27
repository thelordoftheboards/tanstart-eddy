const DOT_COUNT = 5;
const DOT_CYCLE_DURATION_MS = 1500;
const DOT_STAGGER_MS = 150;

const DOT_STAGGERS = Array.from({ length: DOT_COUNT }, (_, index) => index * DOT_STAGGER_MS);

export function DialogIsFetchingContentNotice() {
  return (
    <div className="flex min-h-[30dvh] items-center justify-center">
      <style>{`
        @keyframes fetching-dot-snake {
          0%,
          100% {
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .fetching-dot {
            animation: none;
            opacity: 1;
          }
        }
      `}</style>
      <span>
        Fetching{' '}
        {DOT_STAGGERS.map((staggerMs) => (
          <span
            aria-hidden="true"
            className="fetching-dot"
            key={staggerMs}
            style={{
              animation: `fetching-dot-snake ${DOT_CYCLE_DURATION_MS}ms ease-in-out infinite`,
              animationDelay: `${staggerMs}ms`,
            }}
          >
            .
          </span>
        ))}
      </span>
    </div>
  );
}
