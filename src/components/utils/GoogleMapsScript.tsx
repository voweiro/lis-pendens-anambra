'use client';

import { useEffect } from 'react';
import Script from 'next/script';

export default function GoogleMapsScript() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  
  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=Function.prototype`}
        strategy="afterInteractive"
        onError={(e) => {
          console.error('Google Maps script failed to load', e);
        }}
      />
    </>
  );
}
