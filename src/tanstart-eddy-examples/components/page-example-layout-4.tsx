import { cn } from 'cn';
import React, { useState } from 'react';
import { type ViewState } from 'react-map-gl/maplibre';
import { NavHeadlessFloatingTrigger } from '~/base-nav-and-auth/components/layout-elements';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '~/base-user-interface/components/ui/resizable';
import { useElementDimensions } from '~/hooks/use-element-dimensions';
import { MapMaptiler } from '~/map-maptiler/components/map-maptiler';
import { ToggleOrientation } from '../../tanstart-cumberland-examples/components/toggle-orientation';
import { arrLoremIpsum } from '../../tanstart-cumberland-examples/utils/lorem-ipsum';

export function PageExampleLayout4() {
  const [direction, setDirection] = React.useState<'horizontal' | 'vertical'>('horizontal');
  const [refMapContainer, dimensionsMapContainer] = useElementDimensions();

  const [viewState, setViewState] = useState<ViewState>({
    bearing: 0,
    latitude: 39.088_012_3,
    longitude: -84.491_326_5,
    padding: { bottom: 0, left: 0, right: 0, top: 0 },
    pitch: 0,
    zoom: 13,
  });

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
              setViewState={setViewState}
              viewState={viewState}
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
