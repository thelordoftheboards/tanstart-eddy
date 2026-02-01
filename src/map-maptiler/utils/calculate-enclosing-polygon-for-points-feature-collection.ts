import { buffer } from '@turf/buffer';
import { convex, featureCollection, lineString } from '@turf/turf';
import {
  type Feature,
  type FeatureCollection,
  type GeoJsonProperties,
  type MultiPolygon,
  type Point,
  type Polygon,
} from 'geojson';

export function calculateEnclosingPolygonForPointsFeatureCollection(
  pointsFeatureCollection: FeatureCollection<Point, GeoJsonProperties>
): FeatureCollection<Polygon | MultiPolygon, GeoJsonProperties> {
  let aPolygonBuffered: Feature<Polygon | MultiPolygon, GeoJsonProperties> | null = null;

  // Notice that the point feature collection can have multiple features on the same coordinates, and in
  // order to enable the logic to determine to display line or circle, instead of building polygon from
  // more than 2 points, the duplicates have to be eliminated
  const mapLonSetLat: Map<number, Set<number>> = new Map();
  let atLeastOneDuplicate = false;
  const isDuplicate = (lon: number, lat: number) => {
    let set = mapLonSetLat.get(lon);
    if (!set) {
      set = new Set<number>();
      mapLonSetLat.set(lon, set);
    }
    if (set.has(lat)) {
      atLeastOneDuplicate = true;
      return true; // Already there, so a duplicate
    }
    set.add(lat); // Add it now for future checks
    return false; // Indicate not duplicate
  };

  // Filter duplicates
  const featuresDeduplicated = pointsFeatureCollection.features.filter(
    (feature) => !isDuplicate(feature.geometry.coordinates[0], feature.geometry.coordinates[1])
  );

  // If there were duplicates indeed, replaces the features with deduplicated ones
  if (atLeastOneDuplicate) {
    pointsFeatureCollection.features = featuresDeduplicated;
  }

  const cntPoints = pointsFeatureCollection.features.length;
  if (cntPoints === 0) {
    // Nothing to do - no polygon
  } else if (cntPoints === 1) {
    // Buffer the point itself
    aPolygonBuffered = buffer(pointsFeatureCollection.features[0], 0.6, { units: 'miles' }) ?? null;
  } else if (cntPoints === 2) {
    // Buffer a line from the two points
    const arrPointCoordinates = pointsFeatureCollection.features.map((feature) => feature.geometry.coordinates);
    aPolygonBuffered = buffer(lineString(arrPointCoordinates), 0.2, { units: 'miles' }) ?? null;
  } else {
    const aPolygonUnbuffered: Feature<Polygon | MultiPolygon, GeoJsonProperties> | null =
      convex(pointsFeatureCollection);
    if (aPolygonUnbuffered) {
      aPolygonBuffered = buffer(aPolygonUnbuffered, 0.1, { units: 'miles' }) ?? null;
    }
  }

  const polygonFeatureCollection = featureCollection(aPolygonBuffered ? [aPolygonBuffered] : []);

  return polygonFeatureCollection;
}
