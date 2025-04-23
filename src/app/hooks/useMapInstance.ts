import { useEffect, useRef, useState } from 'react';
import maplibregl from '../../../public/lib/maplibre-gl/dist/maplibre-gl-dev';
import { loadCamera, storeCamera } from './useLocalStorageCamera';
import { mapStyleDifferential } from '../utils/mapStyleDifferential';

interface MapInstanceProps {
  projection: string;
  activeMap: string;
  enablePanning?: boolean;
  enableZooming?: boolean;
}

export const useMapInstance = ({
  projection,
  activeMap,
  enablePanning = false,
  enableZooming = false
}: MapInstanceProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Initialize map once on mount
  useEffect(() => {
    console.log('🏗️ Mount effect - Creating map:', {
      hasContainer: !!mapContainerRef.current,
      hasMap: !!mapRef.current,
      projection,
      activeMap
    });

    if (!mapContainerRef.current || mapRef.current) return;

    try {
      // Check container dimensions
      const { clientWidth, clientHeight } = mapContainerRef.current;
      if (clientWidth === 0 || clientHeight === 0) {
        throw new Error('Map container has zero dimensions');
      }

      // Load saved camera state
      const camera = loadCamera();
      console.log('📸 Loaded camera state:', camera);

      // Get initial style
      const style = mapStyleDifferential(
        projection as 'globe' | 'mercator',
        activeMap as 'peace' | 'heat'
      );

      // Create map with saved camera state
      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style,
        center: [camera.lng, camera.lat],
        zoom: camera.zoom,
        pitch: camera.pitch,
        bearing: camera.bearing,
        dragPan: enablePanning,
        dragRotate: projection === 'globe',
        touchZoomRotate: projection === 'globe',
        doubleClickZoom: enableZooming,
        keyboard: true,
        attributionControl: false,
        maxZoom: 20,
        minZoom: 0,
        maxPitch: projection === 'globe' ? 40 : 60,
        minPitch: 0,
        maxBounds: projection === 'globe' ? undefined : [[-180, -85], [180, 85]],
        bounds: projection === 'globe' ? undefined : [[-180, -85], [180, 85]],
        fitBoundsOptions: {
          padding: 50,
          maxZoom: 20
        }
      });

      // Handle load event
      map.once('load', () => {
        console.log('✅ Map loaded successfully');
        setIsMapLoaded(true);
        setError(null);
      });

      // Handle error event
      map.once('error', (e) => {
        console.error('❌ Map load error:', e.error);
        setError(e.error?.message || 'Map load error');
        setIsMapLoaded(false);
      });

      // Save camera state on move
      map.on('moveend', () => {
        const zoom = map.getZoom();
        const center = map.getCenter();
        const pitch = map.getPitch();
        const bearing = map.getBearing();
        storeCamera({ zoom, lat: center.lat, lng: center.lng, pitch, bearing });
      });

      mapRef.current = map;

    } catch (err: any) {
      console.error('💥 Failed to create map:', {
        error: err,
        message: err?.message,
        stack: err?.stack
      });
      setError(`Failed to create map: ${err?.message || 'Unknown error'}`);
      setIsMapLoaded(false);
    }

    // Cleanup on unmount only
    return () => {
      console.log('🧹 Unmount cleanup');
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        setIsMapLoaded(false);
        setError(null);
      }
    };
  }, []); // Empty deps - only run on mount/unmount

  // Handle style updates when projection or activeMap changes
  useEffect(() => {
    console.log('🎨 Style update effect:', {
      projection,
      activeMap,
      hasMap: !!mapRef.current,
      isMapLoaded
    });

    const map = mapRef.current;
    if (!map || !isMapLoaded) return;

    try {
      // Store current map state before style change
      const currentState = {
        zoom: map.getZoom(),
        center: map.getCenter(),
        pitch: map.getPitch(),
        bearing: map.getBearing()
      };
      console.log('📍 Current map state:', currentState);

      // Update map options based on projection
      map.setMaxPitch(projection === 'globe' ? 40 : 60);
      map.setMaxBounds(projection === 'globe' ? undefined : [[-180, -85], [180, 85]]);
      
      // Get new style
      const style = mapStyleDifferential(
        projection as 'globe' | 'mercator',
        activeMap as 'peace' | 'heat'
      );

      // Handle style load completion and restore state
      map.once('style.load', () => {
        console.log('✅ Style updated successfully, restoring state');
        
        // Calculate appropriate zoom level based on projection
        const currentZoom = currentState.zoom;
        const targetZoom = projection === 'globe' 
          ? Math.min(Math.max(currentZoom, 1), 4.5)  // Globe zoom constraints
          : Math.min(Math.max(currentZoom, 1), 20);  // Mercator zoom constraints
        
        // Smoothly transition to new state
        map.easeTo({
          center: currentState.center,
          zoom: targetZoom,
          pitch: Math.min(currentState.pitch, projection === 'globe' ? 40 : 60),
          bearing: currentState.bearing,
          duration: 1000,
          easing: (t) => t * (2 - t) // Ease out quad
        });
        
        console.log('📍 Restored map state:', {
          zoom: targetZoom,
          center: currentState.center,
          pitch: Math.min(currentState.pitch, projection === 'globe' ? 40 : 60),
          bearing: currentState.bearing
        });
      });

      // Apply new style
      map.setStyle(style);
      
    } catch (err: any) {
      console.error('❌ Error updating map style:', {
        error: err,
        message: err?.message,
        stack: err?.stack
      });
      setError(`Style update failed: ${err?.message || 'Unknown error'}`);
    }
  }, [projection, activeMap, isMapLoaded]);

  return {
    mapContainer: mapContainerRef,
    mapInstance: mapRef,
    error,
    isMapLoaded
  };
}; 