import { cn } from 'cn';
import { Loader2 } from 'lucide-react';

interface OverlayLoaderProps {
  backdrop?: 'light' | 'dark' | 'blur';
  className?: string;
  isLoading: boolean;
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function OverlayLoader({
  backdrop = 'light',
  className,
  isLoading,
  message = 'Loading...',
  size = 'md',
}: OverlayLoaderProps) {
  if (!isLoading) {
    return null;
  }

  const spinnerSizes = {
    lg: 'h-12 w-12',
    md: 'h-8 w-8',
    sm: 'h-6 w-6',
  };

  const backdrops = {
    blur: 'bg-white/90',
    dark: 'bg-black/50',
    light: 'bg-white/80',
  };

  return (
    <div className={cn('fixed inset-0 z-50 flex items-center justify-center', backdrops[backdrop], className)}>
      <div className="flex flex-col items-center gap-3">
        <Loader2 className={cn('animate-spin text-primary', spinnerSizes[size])} />
        {!!message && <p className="font-medium text-muted-foreground text-sm">{message}</p>}
      </div>
    </div>
  );
}

// Component-specific overlay loader
interface ComponentOverlayLoaderProps {
  className?: string;
  isLoading: boolean;
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function ComponentOverlayLoader({
  className,
  isLoading,
  message = 'Loading...',
  size = 'md',
}: ComponentOverlayLoaderProps) {
  if (!isLoading) {
    return null;
  }

  const spinnerSizes = {
    lg: 'h-8 w-8',
    md: 'h-6 w-6',
    sm: 'h-5 w-5',
  };

  return (
    <div className={cn('absolute inset-0 z-10 flex items-center justify-center', 'bg-background/90', className)}>
      <div className="flex flex-col items-center gap-2">
        <Loader2 className={cn('animate-spin text-primary', spinnerSizes[size])} />
        {!!message && <p className="font-medium text-muted-foreground text-xs">{message}</p>}
      </div>
    </div>
  );
}

// Inline loader for smaller spaces
interface InlineLoaderProps {
  className?: string;
  isLoading: boolean;
  message?: string;
  size?: 'sm' | 'md';
}

export function InlineLoader({ className, isLoading, message = 'Loading...', size = 'sm' }: InlineLoaderProps) {
  if (!isLoading) {
    return null;
  }

  const spinnerSizes = {
    md: 'h-5 w-5',
    sm: 'h-4 w-4',
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Loader2 className={cn('animate-spin text-muted-foreground', spinnerSizes[size])} />
      {!!message && <span className="text-muted-foreground text-sm">{message}</span>}
    </div>
  );
}
