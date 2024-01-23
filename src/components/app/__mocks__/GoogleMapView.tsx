'use client';

export interface GoogleMapViewProps {
  address: string;
}

export default function GoogleMapView({ address }: GoogleMapViewProps) {
  return <div data-testid="google-map-view">mock</div>;
}
