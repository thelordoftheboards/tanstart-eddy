import { useSuspenseQuery } from '@tanstack/react-query';
import EventEmitter from 'eventemitter3';
import { type MapLibreEvent } from 'maplibre-gl';
import React, { useCallback, useRef, useState } from 'react';
import MapGl, {
  AttributionControl,
  type MapMouseEvent,
  type ViewState,
  type ViewStateChangeEvent,
} from 'react-map-gl/maplibre';
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
  onLoadEventEmitter,
  onClickEventEmitter,
}: {
  children?: React.ReactNode;
  initialViewState: ViewState;
  interactiveLayerIds?: string[];
  height: number;
  setViewState?: React.Dispatch<React.SetStateAction<ViewState>>;
  width: number;
  mapStyle: string;
  onLoadEventEmitter?: EventEmitter;
  onClickEventEmitter?: EventEmitter;
}) {
  const mapRef = useRef<typeof MapGl>(null);

  const handlerOnMove = (evt: ViewStateChangeEvent) => {
    if (setViewState) {
      setViewState(evt.viewState);
    }
  };

  const handleOnClick = useCallback(
    (event: MapMouseEvent) => {
      if (onClickEventEmitter) {
        const map = mapRef.current;
        onClickEventEmitter.emit('map-click', { event, map }, {});
      }
    },
    [onClickEventEmitter]
  );

  const handleOnLoad = useCallback(
    (event: MapLibreEvent) => {
      if (onLoadEventEmitter) {
        const map = mapRef.current;
        onLoadEventEmitter.emit('map-load', { event, map }, {});
      }
    },
    [onLoadEventEmitter]
  );

  return (
    <MapGl
      attributionControl={false}
      initialViewState={initialViewState}
      interactiveLayerIds={interactiveLayerIds}
      mapStyle={mapStyle}
      onClick={handleOnClick}
      onLoad={handleOnLoad}
      onMove={handlerOnMove}
      // @ts-expect-error It seems the type specified in the ref does not match
      ref={mapRef}
      style={{ width, height }}
    >
      <AttributionControl compact={true} />

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
  onLoadEventEmitter,
  onClickEventEmitter,
}: {
  children?: React.ReactNode;
  initialViewState: ViewState;
  interactiveLayerIds?: string[];
  height: number;
  setViewState?: React.Dispatch<React.SetStateAction<ViewState>>;
  width: number;
  onLoadEventEmitter?: EventEmitter;
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
      onLoadEventEmitter={onLoadEventEmitter}
      setViewState={setViewState}
      width={width}
    >
      {children}
    </MapWrapper>
  );
}
