'use client';

import { memo, useEffect, useMemo, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

const MAP_ZOOM = 17;

interface GoogleMapViewProps {
  address: string;
}

function GoogleMapView({ address }: GoogleMapViewProps) {
  const googlemap = useRef(null);
  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
      version: 'weekly',
    });
    loader.load().then(() => {
      const geocoder = new google.maps.Geocoder();

      geocoder.geocode({ address: address }, (results, status) => {
        if (status === 'OK' && googlemap.current && results) {
          const map = new google.maps.Map(googlemap.current, {
            center: results[0].geometry.location,
            zoom: MAP_ZOOM,
          });
          const marker = new google.maps.Marker({
            map: map,
            position: results[0].geometry.location,
          });
        } else {
          console.error(
            `Geocode was not successful for the following reason: ${status}`
          );
        }
      });
    });
  }, []);
  return <div className="w-80 h-80" ref={googlemap} />;
}

export default memo(GoogleMapView);
