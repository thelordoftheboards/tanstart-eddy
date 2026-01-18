import React from 'react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '~/base/components/ui/resizable';
import { NavHeadlessFloatingTrigger } from '~/base-nav-and-auth/components/layout-elements';
import { cn } from '~/lib/utils';
import { arrLoremIpsum } from '../utils/lorem-ipsum';
import { OrientationToggle } from './orientation-toggle';

export function PageExampleLayout3() {
  const [direction, setDirection] = React.useState<'horizontal' | 'vertical'>('horizontal');

  return (
    <>
      <NavHeadlessFloatingTrigger />

      <ResizablePanelGroup orientation={direction}>
        <ResizablePanel defaultSize={50}>
          <div className={cn('flex-1 overflow-scroll p-2', direction === 'horizontal' ? 'max-h-screen' : 'h-full')}>
            {arrLoremIpsum[4]}
          </div>
        </ResizablePanel>

        <ResizableHandle orientation={direction} withHandle={true} />

        <ResizablePanel defaultSize={50}>
          <div
            className={cn(
              'max-h-screen flex-1 overflow-scroll p-2',
              direction === 'horizontal' ? 'max-h-screen' : 'h-full'
            )}
          >
            <OrientationToggle direction={direction} setDirection={setDirection} />

            {arrLoremIpsum[5]}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  );
}
