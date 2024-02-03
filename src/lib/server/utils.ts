import { uuidv7 } from 'uuidv7';
import { Location } from '../types';

const radiusOfEarthInMiles = 3958.8;

export function generateUUID() {
  return uuidv7();
}

export function calculateDistance(pointA: Location, pointB: Location) {
  // Convert latitude and longitude from degrees to radians
  const [lat1, lon1] = Object.values(pointA);
  const [lat2, lon2] = Object.values(pointB);
  const lat1Rad = lat1 * (Math.PI / 180);
  const lon1Rad = lon1 * (Math.PI / 180);
  const lat2Rad = lat2 * (Math.PI / 180);
  const lon2Rad = lon2 * (Math.PI / 180);

  // Haversine formula
  const dLat = lat2Rad - lat1Rad;
  const dLon = lon2Rad - lon1Rad;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceInMiles = radiusOfEarthInMiles * c;

  return distanceInMiles;
}

export function containsKeyword(str: string, keyword: string) {
  return str.toLowerCase().includes(keyword.toLowerCase());
}
