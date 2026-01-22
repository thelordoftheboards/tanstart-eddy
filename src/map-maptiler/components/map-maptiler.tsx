import { useSuspenseQuery } from '@tanstack/react-query';
import React from 'react';
import MapGl, {
  type LngLatBoundsLike,
  type PaddingOptions,
  type PointLike,
  type ViewState,
} from 'react-map-gl/maplibre';
import { queryOptionsGlobalClientSettings } from '~/base/client/query-options-global-client-settings';

import 'maplibre-gl/dist/maplibre-gl.css';

export function MapMaptiler({
  initialViewState,
  style,
}: {
  initialViewState?:
    | (Partial<ViewState> & {
        bounds?: LngLatBoundsLike;
        fitBoundsOptions?: {
          offset?: PointLike;
          minZoom?: number;
          maxZoom?: number;
          padding?: number | PaddingOptions;
        };
      })
    | undefined;

  style?: React.CSSProperties | undefined;
}) {
  const globalClientSettings = useSuspenseQuery(queryOptionsGlobalClientSettings()).data;

  console.log('MapMaptiler globalClientSettings', globalClientSettings);

  if (!globalClientSettings?.mapMaptilerApiKeyClient) {
    return null;
  }

  return (
    <MapGl
      initialViewState={initialViewState}
      mapStyle={`https://api.maptiler.com/maps/streets/style.json?key=${globalClientSettings.mapMaptilerApiKeyClient}`}
      style={style}
    />
  );
}
