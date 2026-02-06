import { GripVerticalIcon } from 'lucide-react';
import React from 'react';
import { Group, Panel, Separator } from 'react-resizable-panels';
import { cn } from '~/lib/utils';

function ResizablePanelGroup({ className, ...props }: React.ComponentProps<typeof Group>) {
  return (
    <Group
      className={cn('flex h-full w-full data-[panel-group-direction=vertical]:flex-col', className)}
      data-slot="resizable-panel-group"
      {...props}
    />
  );
}

function ResizablePanel({ ...props }: React.ComponentProps<typeof Panel>) {
  return <Panel data-slot="resizable-panel" {...props} />;
}

function ResizableHandle({
  withHandle,
  className,
  orientation,
  ...props
}: React.ComponentProps<typeof Separator> & {
  withHandle?: boolean;
  orientation: 'horizontal' | 'vertical';
}) {
  return (
    <Separator
      className={cn(
        orientation === 'horizontal'
          ? 'relative mx-3 flex w-px items-center justify-center bg-border'
          : 'relative my-3 flex h-px flex-column items-center justify-center bg-border',
        className
      )}
      data-slot="resizable-handle"
      {...props}
    >
      {withHandle && (
        <div className={cn('z-10 flex h-4 w-4 items-center justify-center rounded-xs border')}>
          <GripVerticalIcon className={cn('size-4', orientation === 'vertical' ? 'rotate-90' : '')} />
        </div>
      )}
    </Separator>
  );
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
