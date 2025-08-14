'use client';
import React, { useRef, useEffect } from 'react';
import '../../../public/lib/maplibre-gl.css';
import maplibregl from '../../../public/lib/maplibre-gl-dev';
import { getUserLocationFromIp, areValidCoordinates } from '../utils/geolocation';
import { PeaceDataService } from '@/app/services/PeaceDataService';
import { DynamicStylesheetGenerator } from '../services/DynamicStylesheetGenerator';
import baseStyle from '../styles/map/meractorPeaceStyle.json';

const mapStyles = `
  .maplibregl-ctrl-attrib { display: none; }
  .map-container { width: 100% !important; height: 100% !important; overflow: hidden; }
  ::-webkit-scrollbar { display: none; }
  * { -ms-overflow-style: none; scrollbar-width: none; }
`;

export const LayeredMap: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const angleRef = useRef(0);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const initMap = async () => {
      // Guard: wait a microtask to ensure ref is attached (prevents hydration race)
      await Promise.resolve();
      if (!mapContainerRef.current) return;

      maplibregl.importScriptInWorkers(`${window.location.origin}/peace-transform.js`);

      try {
        const peaceData = await PeaceDataService.fetchPeaceData();
        const style = await DynamicStylesheetGenerator.generateStyle(
          baseStyle as any,
          peaceData
        );

        const containerEl = mapContainerRef.current as unknown as HTMLElement;
        if (!containerEl) return;
        const map = new maplibregl.Map({
          container: containerEl,
          style: style as any,
          center: [-5, 40],
          zoom: 2.5,
          pitch: 40,
          bearing: 0,
          attributionControl: false,
          interactive: false
        });

        mapRef.current = map;

        map.on('load', () => {
          const features = map.querySourceFeatures('maplibre', {
            sourceLayer: 'countries'
          });
        
          const mapping: Record<string, string> = {};
        
          for (const feature of features) {
            const props = feature.properties;
            if (props?.ADM0_A3 && props?.NAME) {
              mapping[props.ADM0_A3] = props.NAME;
            }
          }
        
          animate();
        });
      } catch (err) {
        console.error('Failed to initialize map:', err);
      }
    };

    const animate = () => {
      const animateFrame = () => {
        const angle = angleRef.current;
        const radius = 2;

        // Strong horizontal drift (e.g., 0.1 per frame) + circular motion
        const horizontalDriftSpeed = 0.9; // try 0.05–0.2 for desired effect
        const verticalDriftSpeed = 0.01;

        const lng = -5 + radius * Math.cos(angle) + horizontalDriftSpeed * angle;
        const lat = 40 + radius * Math.sin(angle) * 0.5 + verticalDriftSpeed * angle;

        if (mapRef.current) {
          mapRef.current.jumpTo({
            center: [lng, lat],
            zoom: 3,
            pitch: 0,
            bearing: angle * 10,
          });
        }

        angleRef.current += 0.004;
        animationRef.current = requestAnimationFrame(animateFrame);
      };

      animationRef.current = requestAnimationFrame(animateFrame);
    };

    initMap();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (mapRef.current) mapRef.current.remove();
    };
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: mapStyles }} />
      <div
        ref={mapContainerRef}
        className="map-container"
        style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}
      />
    </>
  );
};

export default LayeredMap;
