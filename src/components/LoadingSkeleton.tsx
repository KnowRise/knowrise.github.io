interface Props {
  count?: number;
  type?: 'card' | 'list' | 'text';
}

export default function LoadingSkeleton({ count = 3, type = 'card' }: Props) {
  const items = Array.from({ length: count });

  if (type === 'text') {
    return (
      <div className="space-y-3 animate-pulse">
        {items.map((_, i) => (
          <div key={i} className="h-4 rounded-full w-3/4" style={{ background: 'var(--tag-bg)' }} />
        ))}
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className="flex flex-col gap-4 animate-pulse">
        {items.map((_, i) => (
          <div
            key={i}
            className="rounded-xl border p-5 space-y-3"
            style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
          >
            <div className="h-3 rounded-full w-1/4" style={{ background: 'var(--tag-bg)' }} />
            <div className="h-4 rounded-full w-3/4" style={{ background: 'var(--tag-bg)' }} />
            <div className="h-3 rounded-full w-full" style={{ background: 'var(--tag-bg)' }} />
          </div>
        ))}
      </div>
    );
  }

  // card (default — for skills grid)
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-pulse">
      {items.map((_, i) => (
        <div
          key={i}
          className="rounded-xl border p-5 space-y-3 h-32"
          style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
        >
          <div className="h-3 rounded-full w-1/3" style={{ background: 'var(--tag-bg)' }} />
          <div className="flex gap-2">
            <div className="h-6 rounded-lg w-16" style={{ background: 'var(--tag-bg)' }} />
            <div className="h-6 rounded-lg w-20" style={{ background: 'var(--tag-bg)' }} />
            <div className="h-6 rounded-lg w-14" style={{ background: 'var(--tag-bg)' }} />
          </div>
        </div>
      ))}
    </div>
  );
}
