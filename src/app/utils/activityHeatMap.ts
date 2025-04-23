import maplibregl, { Map } from '../../../public/lib/maplibre-gl/dist/maplibre-gl-dev';
import { PeaceGeoJSON, CityPeaceGeoJSON } from '../types/map';

/**
 * Unified function to add activity heat map visualization to the map
 * Visualizes density of peace data for both countries and cities
 */
export function addActivityVisualization(
  map: Map | null, 
  countryData: PeaceGeoJSON | null,
  cityData: CityPeaceGeoJSON | null
): void {
  if (!map || !isMapReady(map)) return;

  try {
    // Add country-level heat map if data is available
    if (countryData) {
      addCountryHeatLayer(map, countryData);
    }
    
    // Add city-level heat map if data is available
    if (cityData) {
      addCityHeatLayer(map, cityData);
    }
  } catch (error) {
    console.error('Error adding activity visualization:', error);
  }
}

// PRIVATE HELPER FUNCTIONS

/**
 * Checks if map is ready for source and layer operations
 */
function isMapReady(map: Map): boolean {
  try {
    return !!(map.isStyleLoaded() && map.getStyle());
  } catch (error) {
    console.log('Map not ready for adding heat map layers');
    return false;
  }
}

/**
 * Adds a heat map layer for country-level peace activity
 */
function addCountryHeatLayer(map: Map, countryData: PeaceGeoJSON): void {
  // Add/update country data source for heat map
  const sourceId = 'peace-heat-countries';
  
  if (map.getSource(sourceId)) {
    (map.getSource(sourceId) as maplibregl.GeoJSONSource).setData(countryData);
  } else {
    map.addSource(sourceId, {
      type: 'geojson',
      data: countryData
    });
  }
  
  // Add heat map layer if it doesn't exist
  const layerId = 'country-heat';
  if (!map.getLayer(layerId)) {
    map.addLayer({
      id: layerId,
      type: 'heatmap',
      source: sourceId,
      paint: {
        // Weight heat map by peace count
        'heatmap-weight': [
          'interpolate',
          ['linear'],
          ['get', 'peaceCount'],
          0, 0,
          1, 0.1,
          10, 0.5,
          100, 1
        ],
        // Adjust intensity based on zoom level
        'heatmap-intensity': [
          'interpolate',
          ['linear'],
          ['zoom'],
          0, 0.2,
          4, 1
        ],
        // Color gradient from blue (cold) to red (hot)
        'heatmap-color': [
          'interpolate',
          ['linear'],
          ['heatmap-density'],
          0, 'rgba(0, 0, 255, 0)',
          0.2, 'rgba(65, 105, 225, 0.5)',
          0.4, 'rgba(0, 255, 255, 0.7)',
          0.6, 'rgba(0, 255, 0, 0.7)',
          0.8, 'rgba(255, 255, 0, 0.8)',
          1, 'rgba(255, 0, 0, 0.9)'
        ],
        // Adjust radius based on zoom
        'heatmap-radius': [
          'interpolate',
          ['linear'],
          ['zoom'],
          0, 4,
          4, 20,
          8, 40
        ],
        // Fade out at higher zoom levels
        'heatmap-opacity': [
          'interpolate',
          ['linear'],
          ['zoom'],
          4, 1,
          9, 0.1
        ]
      }
    });
  }
}

/**
 * Adds a heat map layer for city-level peace activity
 */
function addCityHeatLayer(map: Map, cityData: CityPeaceGeoJSON): void {
  // Add/update city data source for heat map
  const sourceId = 'peace-heat-cities';
  
  if (map.getSource(sourceId)) {
    (map.getSource(sourceId) as maplibregl.GeoJSONSource).setData(cityData);
  } else {
    map.addSource(sourceId, {
      type: 'geojson',
      data: cityData
    });
  }
  
  // Add city-level heat map if it doesn't exist
  const heatLayerId = 'city-heat';
  if (!map.getLayer(heatLayerId)) {
    map.addLayer({
      id: heatLayerId,
      type: 'heatmap',
      source: sourceId,
      minzoom: 4,
      paint: {
        // Weight heat map by peace count
        'heatmap-weight': [
          'interpolate',
          ['linear'],
          ['get', 'peaceCount'],
          0, 0,
          1, 0.2,
          10, 0.5,
          100, 1
        ],
        // Higher intensity for city data
        'heatmap-intensity': [
          'interpolate',
          ['linear'],
          ['zoom'],
          4, 0.5,
          8, 1,
          12, 1.5
        ],
        // Vibrant color gradient 
        'heatmap-color': [
          'interpolate',
          ['linear'],
          ['heatmap-density'],
          0, 'rgba(33, 102, 172, 0)',
          0.2, 'rgba(103, 169, 207, 0.5)',
          0.4, 'rgba(209, 229, 240, 0.6)',
          0.6, 'rgba(253, 219, 199, 0.7)',
          0.8, 'rgba(239, 138, 98, 0.8)',
          1, 'rgba(178, 24, 43, 0.9)'
        ],
        // Larger radius at city level
        'heatmap-radius': [
          'interpolate',
          ['linear'],
          ['zoom'],
          4, 5,
          8, 15,
          12, 25
        ],
        // Fade out at very high zoom levels in favor of point markers
        'heatmap-opacity': [
          'interpolate',
          ['linear'],
          ['zoom'],
          8, 1,
          14, 0
        ]
      }
    });
  }
  
  // Add additional point layer for precise city locations at high zoom
  const pointLayerId = 'city-heat-points';
  if (!map.getLayer(pointLayerId)) {
    map.addLayer({
      id: pointLayerId,
      type: 'circle',
      source: sourceId,
      minzoom: 1,
      paint: {
        // Size circles based on peace count
        'circle-radius': [
          'interpolate',
          ['linear'],
          ['zoom'],
          10, ['interpolate', ['linear'], ['get', 'peaceCount'], 0, 2, 50, 5, 100, 8],
          15, ['interpolate', ['linear'], ['get', 'peaceCount'], 0, 5, 50, 10, 100, 15]
        ],
        // Color circles based on peace percentage
        'circle-color': [
          'interpolate',
          ['linear'],
          ['get', 'peacePercentage'],
          0, '#d73027',
          25, '#fc8d59',
          50, '#fee090',
          75, '#91bfdb',
          100, '#4575b4'
        ],
        // Fade in as heat map fades out
        'circle-opacity': [
          'interpolate',
          ['linear'],
          ['zoom'],
          10, 0.3,
          14, 0.8
        ],
        'circle-stroke-width': 1,
        'circle-stroke-color': '#ffffff'
      }
    });
  }
} 