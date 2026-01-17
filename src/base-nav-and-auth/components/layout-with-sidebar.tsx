import { type ReactNode } from 'react';
import { SidebarProvider } from '~/components/ui/sidebar';
import { cn } from '~/lib/utils';
import { NavAppSidebar } from './nav-app-sidebar';

function SidebarInset({ className, ...props }: React.ComponentProps<'main'>) {
  return (
    <main
      className={cn(
        'relative flex w-full flex-1 flex-col bg-background',
        'peer-data-[state=expanded]:w-[calc(100vw-var(--sidebar-width))]',
        'peer-data-[state=collapsed]:w-[calc(100vw-var(--sidebar-width-icon))]',
        className
      )}
      data-slot="sidebar-inset"
      {...props}
    />
  );
}

export function LayoutWithSidebar({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider
      style={{
        '--sidebar-width': '16rem',
        '--sidebar-width-mobile': '16rem',
      }}
    >
      <NavAppSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
