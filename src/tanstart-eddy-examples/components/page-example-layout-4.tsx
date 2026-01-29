import React from 'react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '~/base/components/ui/resizable';
import { NavHeadlessFloatingTrigger } from '~/base-nav-and-auth/components/layout-elements';
import { useElementDimensions } from '~/hooks/use-element-dimensions';
import { cn } from '~/lib/utils';
import { MapMaptiler } from '~/map-maptiler/components/map-maptiler';
import { ToggleOrientation } from '../../tanstart-cumberland-examples/components/toggle-orientation';
import { arrLoremIpsum } from '../../tanstart-cumberland-examples/utils/lorem-ipsum';

export function PageExampleLayout4() {
  const [direction, setDirection] = React.useState<'horizontal' | 'vertical'>('horizontal');
  const [refMapContainer, dimensionsMapContainer] = useElementDimensions();

  return (
    <>
      <NavHeadlessFloatingTrigger />

      <ResizablePanelGroup orientation={direction}>
        <ResizablePanel defaultSize={50}>
          <div
            className={cn(
              'flex-1 select-none overflow-hidden bg-red-800 p-1 md:select-text',
              direction === 'horizontal' ? 'max-h-screen min-h-screen' : 'h-full'
            )}
            ref={refMapContainer}
          >
            <MapMaptiler
              height={dimensionsMapContainer.height}
              initialViewState={{
                longitude: -84.491_326_5,
                latitude: 39.088_012_3,
                zoom: 13,
                bearing: 0,
                pitch: 0,
                padding: { top: 0, bottom: 0, right: 0, left: 0 },
              }}
              width={dimensionsMapContainer.width}
            />
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
            <ToggleOrientation direction={direction} setDirection={setDirection} />

            {arrLoremIpsum[5]}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  );
}
