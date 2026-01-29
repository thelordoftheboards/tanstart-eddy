import { bbox, center, featureCollection, point } from '@turf/turf';
import { type ViewState } from 'react-map-gl/maplibre';

const padding = { top: 0, bottom: 0, right: 0, left: 0 };

export function getViewStateForEmpty(): ViewState {
  return {
    longitude: -98.58, // Approx center of continental US
    latitude: 39.83, // Approx center of continental US
    zoom: 3, // Zoom level to show entire continental US
    pitch: 0,
    bearing: 0,
    padding,
  };
}

export function getViewStateThatDisplays<
  LON extends string,
  LAT extends string,
  T extends Record<LAT, number> & Record<LON, number>,
>(_LAT: LAT, _LON: LON, arrObjectsWithLocations: T[], mapHeight: number, mapWidth: number): ViewState {
  if (arrObjectsWithLocations.length === 0) {
    return getViewStateForEmpty();
  }

  // Create turf points from facilities
  const points = arrObjectsWithLocations.map((facility) => point([facility[_LAT], facility[_LON]]));

  // Create a feature collection from points
  const aFeatureCollection = featureCollection(points);

  // Calculate bbox
  const aBbox = bbox(aFeatureCollection);

  // Calculate center from bbox
  const aCenter = center(aFeatureCollection).geometry.coordinates;

  // Calculate zoom level based on bbox
  const [minX, minY, maxX, maxY] = aBbox;
  const width = maxX - minX;
  const height = maxY - minY;

  // Simple zoom calculation (you may need to adjust this based on your needs)
  // Calculate zoom levels needed for each dimension
  // This uses the Mercator projection formula
  const zoomLat = Math.log2(mapHeight / (height * 256)) + 7;
  const zoomLon = Math.log2(mapWidth / (width * 256)) + 7;

  // Use the smaller zoom level to ensure everything fits
  const zoom = Math.max(0, Math.min(15, Math.floor(Math.min(zoomLat, zoomLon))));

  const viewState = {
    longitude: aCenter[0],
    latitude: aCenter[1],
    zoom,
    pitch: 0,
    bearing: 0,
    padding,
  };

  return viewState;
}
