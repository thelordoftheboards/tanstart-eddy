import { useSuspenseQuery } from '@tanstack/react-query';
import EventEmitter from 'eventemitter3';
import { type MapLibreEvent } from 'maplibre-gl';
import React, { useCallback, useRef } from 'react';
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
  viewState,
  interactiveLayerIds,
  height,
  setViewState,
  width,
  mapStyle,
  onLoadEventEmitter,
  onClickEventEmitter,
}: {
  children?: React.ReactNode;
  viewState: ViewState;
  interactiveLayerIds?: string[];
  height: number;
  setViewState: React.Dispatch<React.SetStateAction<ViewState>>;
  width: number;
  mapStyle: string;
  onLoadEventEmitter?: EventEmitter;
  onClickEventEmitter?: EventEmitter;
}) {
  const mapRef = useRef<typeof MapGl>(null);

  const handlerOnMove = useCallback(
    (evt: ViewStateChangeEvent) => {
      setViewState(evt.viewState);
    },
    [setViewState]
  );

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
      {...viewState}
      attributionControl={false}
      height={height}
      interactiveLayerIds={interactiveLayerIds}
      mapStyle={mapStyle}
      onClick={handleOnClick}
      onLoad={handleOnLoad}
      onMove={handlerOnMove}
      // @ts-expect-error It seems the type specified in the ref does not match
      ref={mapRef}
      width={width}
    >
      <AttributionControl compact={true} />

      {children}
    </MapGl>
  );
}

export function MapMaptiler({
  children,
  viewState,
  interactiveLayerIds,
  height,
  setViewState,
  width,
  onLoadEventEmitter,
  onClickEventEmitter,
}: {
  children?: React.ReactNode;
  viewState: ViewState;
  interactiveLayerIds?: string[];
  height: number;
  setViewState: React.Dispatch<React.SetStateAction<ViewState>>;
  width: number;
  onLoadEventEmitter?: EventEmitter;
  onClickEventEmitter?: EventEmitter;
}) {
  const isDarkMode = typeof document === 'undefined' ? false : document.documentElement.classList.contains('dark');
  const maptilerMapStyle = isDarkMode ? 'dataviz-dark' : 'dataviz-light';

  const globalClientSettings = useSuspenseQuery(queryOptionsGlobalClientSettings()).data;
  if (!globalClientSettings?.mapMaptilerApiKeyClient) {
    return null;
  }

  return (
    <MapWrapper
      height={height}
      interactiveLayerIds={interactiveLayerIds}
      mapStyle={`https://api.maptiler.com/maps/${maptilerMapStyle}/style.json?key=${globalClientSettings.mapMaptilerApiKeyClient}`}
      onClickEventEmitter={onClickEventEmitter}
      onLoadEventEmitter={onLoadEventEmitter}
      setViewState={setViewState}
      viewState={viewState}
      width={width}
    >
      {children}
    </MapWrapper>
  );
}
