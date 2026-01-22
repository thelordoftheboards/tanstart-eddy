/** biome-ignore-all lint/suspicious/noArrayIndexKey: The breadcrumbs are not expected to dynamically change */

import { IconLayoutSidebar } from '@tabler/icons-react';
import { Fragment, type ReactNode } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '~/components/ui/breadcrumb';
import { Button } from '~/components/ui/button';
import { Separator } from '~/components/ui/separator';
import { SidebarTrigger, useSidebar } from '~/components/ui/sidebar';
import { cn } from '~/lib/utils';

export function NavHeaderBreadcrumbs({ arrBreadcrumbs }: { arrBreadcrumbs: Array<{ title: string; url?: string }> }) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />

        <Separator className="mr-2 data-[orientation=vertical]:h-4" orientation="vertical" />

        <Breadcrumb>
          <BreadcrumbList>
            {arrBreadcrumbs.map((breadcrumb, ix) => (
              <Fragment key={ix}>
                <BreadcrumbItem className="hidden md:block">
                  {breadcrumb.url ? (
                    <BreadcrumbLink href={breadcrumb.url}>{breadcrumb.title}</BreadcrumbLink>
                  ) : (
                    <BreadcrumbLink>{breadcrumb.title}</BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {arrBreadcrumbs.length - 1 > ix && <BreadcrumbSeparator className="hidden md:block" />}
              </Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
}

function SidebarTriggerDefaultVariant({ className, onClick, ...props }: React.ComponentProps<typeof Button>) {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      className={cn(className)}
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      size="icon-sm"
      variant="default"
      {...props}
    >
      <IconLayoutSidebar />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
}

export function NavHeadlessFloatingTrigger() {
  return <SidebarTriggerDefaultVariant className="absolute top-2.5 left-2.5 z-10" />;
}

export function InsetContainerWithFloatingTriggerAndTitle({
  title,
  subTitle,
  titleExtraElements,
  children,
}: {
  title: string;
  subTitle?: string;
  titleExtraElements?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="container mx-auto flex max-h-dvh min-h-dvh max-w-8xl flex-col space-y-2 overflow-hidden py-2 md:space-y-4 lg:space-y-6">
      <NavHeadlessFloatingTrigger />

      <div className="flex gap-2 pl-13">
        {subTitle && (
          <div>
            <h1 className="font-bold text-2xl tracking-tight">{title}</h1>
            <p className="text-muted-foreground">{subTitle}</p>
          </div>
        )}
        {!subTitle && (
          <div>
            <h1 className="mt-2 font-bold text-2xl tracking-tight">{title}</h1>
          </div>
        )}

        {titleExtraElements}
      </div>

      <Separator />

      {children}
    </div>
  );
}
