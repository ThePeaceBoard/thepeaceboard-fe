import { Map as MapLibre } from '../../../public/lib/maplibre-gl/dist/maplibre-gl-dev';
import { PeaceGeoJSON, CityPeaceGeoJSON } from '../types/map';
import { 
  addPeaceVisualization,
  addActivityVisualization 
} from '../utils/mapLayers';

interface UseMapLayersProps {
  mapInstance: MapLibre | null;
  peaceData: PeaceGeoJSON | null;
  cityPeaceData: CityPeaceGeoJSON | null;
  activeMap: string;
}

interface UseMapLayersReturn {
  addLayers: () => void;
  clearLayers: () => void;
}

export const useMapLayers = ({
  mapInstance,
  peaceData,
  cityPeaceData,
  activeMap
}: UseMapLayersProps): UseMapLayersReturn => {
  const addLayers = () => {
    if (!mapInstance || !mapInstance.isStyleLoaded()) {
      console.log('Map not ready for adding layers');
      return;
    }

    try {
      // First ensure thorough cleanup
      clearLayers();

      // Wait a brief moment to ensure cleanup is complete
      setTimeout(() => {
        try {
          if (activeMap === 'peace') {
            console.log('🕊️ Adding peace visualization layers');
            addPeaceVisualization(mapInstance, peaceData, cityPeaceData);
          } else if (activeMap === 'heat') {
            console.log('🔥 Adding activity visualization layers');
            addActivityVisualization(mapInstance, peaceData, cityPeaceData);
          }
        } catch (err: any) {
          console.error('Error adding map layers after cleanup:', err);
        }
      }, 50);
    } catch (err: any) {
      console.error('Error in addLayers:', err);
    }
  };

  const clearLayers = () => {
    if (!mapInstance) return;

    try {
      console.log('🧹 Clearing all map layers');
      
      // Comprehensive list of all possible layer IDs
      const layerIds = [
        // Peace map layers
        'country-fill', 'country-labels', 'city-points', 'city-labels',
        'country-heat', 'city-heat', 'city-heat-points',
        'country-fill-extrusion', 'country-borders',
        'heat-points', 'heat-labels',
        // Background layers
        'country-labels-bg', 'city-labels-bg',
        // Heat map variations
        'country-heat-labels', 'city-heat-labels',
        'country-heat-labels-bg', 'city-heat-labels-bg',
        // Custom heat map layer
        'earthquakes-heat',
        // Any dynamically generated layers
        'earthquakes-heat-points',
        'earthquakes-labels'
      ];

      // Remove all layers first
      layerIds.forEach(id => {
        if (mapInstance.getLayer(id)) {
          try {
            console.log(`🧹 Removing layer: ${id}`);
            mapInstance.removeLayer(id);
          } catch (e) {
            console.warn(`Failed to remove layer ${id}:`, e);
          }
        }
      });

      // Comprehensive list of all possible source IDs
      const sourceIds = [
        'peace-countries', 'peace-cities',
        'peace-heat-countries', 'peace-heat-cities',
        'activity-heat', 'city-activity-heat',
        'country-data', 'city-data',
        'heat-data', 'peace-data',
        // Custom heat map source
        'earthquakes'
      ];

      // Then remove all sources
      sourceIds.forEach(id => {
        if (mapInstance.getSource(id)) {
          try {
            console.log(`🧹 Removing source: ${id}`);
            mapInstance.removeSource(id);
          } catch (e) {
            console.warn(`Failed to remove source ${id}:`, e);
          }
        }
      });

      // Force a style refresh if needed
      if (!mapInstance.isStyleLoaded()) {
        mapInstance.once('style.load', () => {
          console.log('Style reloaded after cleanup');
        });
      }
    } catch (err: any) {
      console.error('Error in clearLayers:', err);
    }
  };

  return {
    addLayers,
    clearLayers
  };
}; 