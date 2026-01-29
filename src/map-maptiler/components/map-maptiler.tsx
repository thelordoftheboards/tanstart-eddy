import { useSuspenseQuery } from '@tanstack/react-query';
import EventEmitter from 'eventemitter3';
import React, { useCallback, useState } from 'react';
import MapGl, { type MapMouseEvent, type ViewState, type ViewStateChangeEvent } from 'react-map-gl/maplibre';
import { queryOptionsGlobalClientSettings } from '~/base-nav-and-auth/client/query-options-global-client-settings';

import 'maplibre-gl/dist/maplibre-gl.css';

function MapWrapper({
  children,
  initialViewState,
  interactiveLayerIds,
  height,
  setViewState,
  width,
  mapStyle,
  onClickEventEmitter,
}: {
  children?: React.ReactNode;
  initialViewState: ViewState;
  interactiveLayerIds?: string[];
  height: number;
  setViewState?: React.Dispatch<React.SetStateAction<ViewState>>;
  width: number;
  mapStyle: string;
  onClickEventEmitter?: EventEmitter;
}) {
  const handlerOnMove = (evt: ViewStateChangeEvent) => {
    if (setViewState) {
      setViewState(evt.viewState);
    }
  };

  const handleOnClick = useCallback(
    (event: MapMouseEvent) => {
      if (onClickEventEmitter) {
        onClickEventEmitter.emit('map-click', { event }, {});
      }
    },
    [onClickEventEmitter]
  );

  return (
    <MapGl
      initialViewState={initialViewState}
      interactiveLayerIds={interactiveLayerIds}
      mapStyle={mapStyle}
      onClick={handleOnClick}
      onMove={handlerOnMove}
      style={{ width, height }}
    >
      {children}
    </MapGl>
  );
}

export function MapMaptiler({
  children,
  initialViewState,
  interactiveLayerIds,
  height,
  setViewState,
  width,
  onClickEventEmitter,
}: {
  children?: React.ReactNode;
  initialViewState: ViewState;
  interactiveLayerIds?: string[];
  height: number;
  setViewState?: React.Dispatch<React.SetStateAction<ViewState>>;
  width: number;
  onClickEventEmitter?: EventEmitter;
}) {
  const isDarkMode = typeof document === 'undefined' ? false : document.documentElement.classList.contains('dark');
  const maptilerMapStyle = isDarkMode ? 'dataviz-dark' : 'dataviz-light';

  const [initialViewStatePrevious, setInitialViewStatePrevious] = useState<ViewState>(initialViewState);
  const [key, setKey] = useState(1);
  if (initialViewStatePrevious !== initialViewState) {
    setTimeout(() => {
      setInitialViewStatePrevious(initialViewState);
      setKey(key + 1);
    });
  }

  const globalClientSettings = useSuspenseQuery(queryOptionsGlobalClientSettings()).data;
  if (!globalClientSettings?.mapMaptilerApiKeyClient) {
    return null;
  }

  return (
    <MapWrapper
      height={height}
      initialViewState={initialViewState}
      interactiveLayerIds={interactiveLayerIds}
      key={key}
      mapStyle={`https://api.maptiler.com/maps/${maptilerMapStyle}/style.json?key=${globalClientSettings.mapMaptilerApiKeyClient}`}
      onClickEventEmitter={onClickEventEmitter}
      setViewState={setViewState}
      width={width}
    >
      {children}
    </MapWrapper>
  );
}
