import { useRef, useEffect } from 'react';
import { Map as MapLibre } from '../../../public/lib/maplibre-gl/dist/maplibre-gl-dev';

/**
 * Custom hook to handle map rotation animation.
 * You must call setMapInstance once the map is ready.
 */

export function useMapRotation() {
  console.log('🔄 useMapRotation hook initialized');
  const rotationRef = useRef<number | null>(null);
  const mapRef = useRef<typeof MapLibre | null>(null);

  const setMapInstance = (map: typeof MapLibre) => {
    console.log('🎯 Setting map instance in rotation hook:', {
      hasMap: !!map,
      currentMap: !!mapRef.current,
      currentRotation: !!rotationRef.current
    });
    mapRef.current = map;
    console.log('📍 Map instance set, current state:', {
      hasMap: !!mapRef.current,
      mapCenter: map.getCenter(),
      mapZoom: map.getZoom(),
      mapPitch: map.getPitch(),
      mapBearing: map.getBearing()
    });
  };

  const startRotation = () => {
    console.log('🔄 Starting rotation, current state:', {
      hasMap: !!mapRef.current,
      hasRotation: !!rotationRef.current,
      mapCenter: mapRef.current?.getCenter(),
      mapPitch: mapRef.current?.getPitch(),
      mapBearing: mapRef.current?.getBearing()
    });

    const map = mapRef.current;
    if (!map) {
      console.log('❌ No map instance available for rotation');
      return;
    }

    let currentLng = map.getCenter().lng;
    let lastTime: number | null = null;
    let elapsedTime = 0;
    console.log('📍 Initial rotation state:', { 
      currentLng,
      currentCenter: map.getCenter(),
      currentPitch: map.getPitch(),
      currentBearing: map.getBearing()
    });

    const rotate = (timestamp: number) => {
      if (!lastTime) {
        console.log('⏱️ First rotation frame:', { timestamp });
        lastTime = timestamp;
      }
      const timeDiff = timestamp - lastTime;
      elapsedTime += timeDiff;

      const horizontalSpeed = 0.001 * timeDiff;
      currentLng = (currentLng + horizontalSpeed) % 360;

      const verticalCyclePeriod = 1800000;
      const verticalPosition = 75 * Math.sin((2 * Math.PI * elapsedTime) / verticalCyclePeriod);
      const currentLat = Math.max(-75, Math.min(75, verticalPosition));

      // console.log('🔄 Rotation frame:', {
      //   timestamp,
      //   timeDiff,
      //   currentLng,
      //   currentLat,
      //   elapsedTime
      // });

      map.easeTo({
        center: [currentLng, currentLat],
        duration: 0,
        easing: (t) => t
      });

      lastTime = timestamp;
      rotationRef.current = requestAnimationFrame(rotate);
    };

    if (rotationRef.current) {
      console.log('⚠️ Stopping existing rotation before starting new one');
      stopRotation();
    }
    console.log('▶️ Starting rotation animation frame');
    rotationRef.current = requestAnimationFrame(rotate);
  };

  const stopRotation = () => {
    console.log('⏹️ Stopping rotation, current state:', {
      hasMap: !!mapRef.current,
      hasRotation: !!rotationRef.current,
      mapCenter: mapRef.current?.getCenter(),
      mapPitch: mapRef.current?.getPitch(),
      mapBearing: mapRef.current?.getBearing()
    });

    if (rotationRef.current) {
      console.log('🛑 Cancelling animation frame:', rotationRef.current);
      cancelAnimationFrame(rotationRef.current);
      rotationRef.current = null;
    } else {
      console.log('ℹ️ No rotation animation frame to cancel');
    }
  };

  useEffect(() => {
    console.log('🔄 Rotation hook mounted');
    return () => {
      console.log('🧹 Cleaning up rotation hook');
      stopRotation();
    };
  }, []);

  return { setMapInstance, startRotation, stopRotation };
}
