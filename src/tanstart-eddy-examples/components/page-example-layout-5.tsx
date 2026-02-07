import React, { useState } from 'react';
import { type ViewState } from 'react-map-gl/maplibre';
import { NavHeadlessFloatingTrigger } from '~/base-nav-and-auth/components/layout-elements';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '~/base-user-interface/components/ui/resizable';
import { useElementDimensions } from '~/hooks/use-element-dimensions';
import { cn } from '~/lib/utils';
import { MapMaptiler } from '~/map-maptiler/components/map-maptiler';
import { ToggleOrientation } from '../../tanstart-cumberland-examples/components/toggle-orientation';
import { arrLoremIpsum } from '../../tanstart-cumberland-examples/utils/lorem-ipsum';
import { ToggleToolbarPosition } from './toggle-toolbar-position';
import { ToolbarForSplitScreen } from './toolbar-for-split-screen';

export function PageExampleLayout5() {
  const [direction, setDirection] = React.useState<'horizontal' | 'vertical'>('horizontal');
  const [position, setPosition] = React.useState<'top' | 'bottom'>('top');
  const [refMapContainer, dimensionsMapContainer] = useElementDimensions();

  const [viewState, setViewState] = useState<ViewState>({
    longitude: -84.491_326_5,
    latitude: 39.088_012_3,
    zoom: 13,
    bearing: 0,
    pitch: 0,
    padding: { top: 0, bottom: 0, right: 0, left: 0 },
  });

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <NavHeadlessFloatingTrigger />

      {position === 'top' && (
        <ToolbarForSplitScreen
          direction={direction}
          paddingLeft={true}
          position={position}
          setDirection={setDirection}
          setPosition={setPosition}
        />
      )}

      <ResizablePanelGroup orientation={direction} style={{ maxHeight: 'calc(100vh - 54px)' }}>
        <ResizablePanel defaultSize={50}>
          <div
            className={cn(
              'flex-1 select-none overflow-hidden md:select-text',
              direction === 'horizontal' ? '' : 'h-full'
            )}
            ref={refMapContainer}
            style={
              direction === 'horizontal' ? { minHeight: 'calc(100vh - 54px)', maxHeight: 'calc(100vh - 54px)' } : {}
            }
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
              'flex-1 select-none overflow-scroll p-2 md:select-text',
              direction === 'horizontal' ? '' : 'h-full'
            )}
            style={
              direction === 'horizontal' ? { minHeight: 'calc(100vh - 54px)', maxHeight: 'calc(100vh - 54px)' } : {}
            }
          >
            <ToggleOrientation direction={direction} setDirection={setDirection} />
            <ToggleToolbarPosition position={position} setPosition={setPosition} />

            {arrLoremIpsum[5]}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>

      {position === 'bottom' && (
        <ToolbarForSplitScreen
          direction={direction}
          paddingLeft={false}
          position={position}
          setDirection={setDirection}
          setPosition={setPosition}
        />
      )}
    </div>
  );
}
