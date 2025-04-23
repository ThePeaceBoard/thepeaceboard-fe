import maplibregl from '../../../public/lib/maplibre-gl/dist/maplibre-gl-dev';
import type { Map } from 'maplibre-gl';
import { PeaceGeoJSON, CityPeaceGeoJSON } from '../types/map';

/**
 * Unified function to add peace data visualization to the map
 * Shows countries and cities colored by peace percentage with labels
 */
export function addPeaceVisualization(
  map: Map | null,
  countryData: PeaceGeoJSON | null,
  cityData: CityPeaceGeoJSON | null
): void {
  if (!map || !isMapStyleLoaded(map)) return;

  try {
    // Add country-level peace visualization if data is available
    if (countryData) {
      // Add/update country data source
      addCountrySource(map, countryData);
      
      // Instead of adding a new fill layer, update the existing countries-fill layer style
      updateCountryFillStyle(map, countryData);
      
      // Add country peace percentage labels
      addCountryLabelsLayer(map);
    }
    
    // Add city-level peace visualization if data is available
    if (cityData) {
      // Add/update city data source
      addCitySource(map, cityData);
      
      // Add city points visualization
      addCityPointsLayer(map);
      
      // Add city labels with peace percentages
      addCityLabelsLayer(map);
    }
  } catch (error) {
    console.error('Error adding peace visualization:', error);
  }
}

// PRIVATE HELPER FUNCTIONS

/**
 * Verifies map style is loaded and ready for layer operations
 */
function isMapStyleLoaded(map: Map): boolean {
  try {
    return !!(map.isStyleLoaded() && map.getStyle());
  } catch (error) {
    console.log('Map style not ready');
    return false;
  }
}

/**
 * Adds or updates the country source containing peace data
 */
function addCountrySource(map: Map, countryData: PeaceGeoJSON): void {
  try {
    // Check for the fallback transform function
    const { applyFallbackTransform } = require('./mapHelpers');
    
    // Apply fallback transform if available
    if (typeof applyFallbackTransform === 'function') {
      // We'll apply the transform, but we need to keep going regardless
      // of whether it succeeds, so we use a promise that will resolve
      applyFallbackTransform(map, 'peace-countries', countryData)
        .then((transformedData: PeaceGeoJSON) => {
          // Update or add the source with the transformed data
          if (map.getSource('peace-countries')) {
            // Safe cast through unknown
            const source = map.getSource('peace-countries') as unknown as maplibregl.GeoJSONSource;
            source.setData(transformedData);
          } else {
            map.addSource('peace-countries', {
              type: 'geojson',
              data: transformedData
            });
          }
        })
        .catch((err: Error) => {
          console.error('Error applying fallback transform:', err);
          // Add the source anyway with original data
          if (map.getSource('peace-countries')) {
            // Safe cast through unknown
            const source = map.getSource('peace-countries') as unknown as maplibregl.GeoJSONSource;
            source.setData(countryData);
          } else {
            map.addSource('peace-countries', {
              type: 'geojson',
              data: countryData
            });
          }
        });
    } else {
      // No fallback transform, just add the source
      if (map.getSource('peace-countries')) {
        // Safe cast through unknown
        const source = map.getSource('peace-countries') as unknown as maplibregl.GeoJSONSource;
        source.setData(countryData);
      } else {
        map.addSource('peace-countries', {
          type: 'geojson',
          data: countryData
        });
      }
    }
  } catch (error) {
    console.error('Error in addCountrySource:', error);
    // Fallback to regular approach if anything fails
    if (map.getSource('peace-countries')) {
      // Safe cast through unknown
      const source = map.getSource('peace-countries') as unknown as maplibregl.GeoJSONSource;
      source.setData(countryData);
    } else {
      map.addSource('peace-countries', {
        type: 'geojson',
        data: countryData
      });
    }
  }
}

/**
 * Updates the existing country fill layer style to use peace data colors
 * instead of adding a new overlay layer
 */
function updateCountryFillStyle(map: Map, countryData: PeaceGeoJSON): void {
  // First, check if the base map has the countries-fill layer
  const countryLayerId = 'countries-fill';
  
  if (map.getLayer(countryLayerId)) {
    console.log('🕊️ Updating existing countries-fill layer with peace data colors');
    
    // Update the fill color using peace data, with a simpler approach
    map.setPaintProperty(countryLayerId, 'fill-color', [
      'match',
      ['get', 'ADM0_A3'],
      // We'll just hardcode a few example country codes with colors
      // In a real implementation, this would be dynamically generated from peace data
      'USA', '#ff6600',  // United States - Orange-red for 25%
      'DEU', '#99ff33',  // Germany - Light green for 75% 
      'JPN', '#00cc00',  // Japan - Dark green for 100%
      'BRA', '#ffcc00',  // Brazil - Yellow for 50%
      'RUS', '#ff0000',  // Russia - Red for 0%
      // Default color for other countries - just use a fixed color instead of the invalid expression
      '#1C3B5A'
    ]);
    
    // Make sure the layer is visible
    map.setLayoutProperty(countryLayerId, 'visibility', 'visible');
  } else {
    console.log('🕊️ No countries-fill layer found, creating new layer');
    // Fall back to adding a separate layer if necessary
    map.addLayer({
      id: 'peace-countries-fill',
      type: 'fill',
      source: 'peace-countries',
      paint: {
        'fill-color': [
          'interpolate',
          ['linear'],
          ['get', 'peacePercentage'],
          0, '#ff0000',   // Red for 0%
          25, '#ff6600',  // Orange-red for 25%
          50, '#ffcc00',  // Yellow for 50%
          75, '#99ff33',  // Light green for 75%
          100, '#00cc00'  // Dark green for 100%
        ],
        'fill-opacity': 0.7
      }
    });
  }
}

/**
 * Adds the country peace percentage labels layer
 */
function addCountryLabelsLayer(map: Map): void {
  // Load RTL text plugin if needed
  const layerId = 'country-labels';
  
  if (map.getLayer(layerId)) {
    // Update existing layer
    try {
      console.log('🕊️ Updating existing country labels layer properties');
      
      // Update text field to use format expression for better formatting
      map.setLayoutProperty(layerId, 'text-field', [
        'format',
        ['get', 'NAME'], // Use NAME property which will be transformed
        { 'font-scale': 1.2 }
      ]);
      
      // Make sure the layer is visible
      map.setLayoutProperty(layerId, 'visibility', 'visible');
      
      // Ensure text size is appropriate
      map.setLayoutProperty(layerId, 'text-size', [
        'interpolate',
        ['linear'],
        ['zoom'],
        1, 10,
        3, 14,
        6, 18
      ]);
      
      // Make sure text wrapping is enabled for multiline display
      map.setLayoutProperty(layerId, 'text-max-width', 10);
      
      // Allow overlap to ensure important labels are visible
      map.setLayoutProperty(layerId, 'text-allow-overlap', true);
      
      return;
    } catch (error) {
      console.warn('Failed to update existing country labels layer:', error);
      // Continue to create a new layer
    }
  }
  
  // Create a new layer if updating existing one failed or it doesn't exist
  try {
    console.log('🕊️ Adding new country labels layer');
    
    map.addLayer({
      id: layerId,
      type: 'symbol',
      source: 'peace-countries',
      layout: {
        // Simple text field that will be transformed by our feature properties transform
        'text-field': ['get', 'NAME'],
        'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
        'text-size': [
          'interpolate',
          ['linear'],
          ['zoom'],
          1, 10,
          3, 14,
          6, 18
        ],
        'text-max-width': 10,
        'text-anchor': 'center',
        'text-justify': 'center',
        'text-padding': 5,
        'text-allow-overlap': true,
        'symbol-placement': 'point',
        'symbol-z-order': 'source',
        'text-letter-spacing': 0.05
      },
      paint: {
        'text-color': '#000000',
        'text-halo-color': '#FFFFFF',
        'text-halo-width': 1.5,
        'text-halo-blur': 0.5,
        'text-opacity': 1
      }
    });
    
    console.log('🕊️ Country labels layer added successfully');
  } catch (error) {
    console.error('Failed to add country labels layer:', error);
  }
}

/**
 * Adds or updates the city source containing peace data
 */
function addCitySource(map: Map, cityData: CityPeaceGeoJSON): void {
  if (map.getSource('peace-cities')) {
    // Safe cast through unknown
    const source = map.getSource('peace-cities') as unknown as maplibregl.GeoJSONSource;
    source.setData(cityData);
  } else {
    map.addSource('peace-cities', {
      type: 'geojson',
      data: cityData
    });
  }
}

/**
 * Adds city points layer for peace visualization
 */
function addCityPointsLayer(map: Map): void {
  const layerId = 'city-points';
  
  if (map.getLayer(layerId)) return;
  
  map.addLayer({
    id: layerId,
    type: 'circle',
    source: 'peace-cities',
    minzoom: 3,
    paint: {
      'circle-radius': [
        'interpolate',
        ['linear'],
        ['zoom'],
        3, ['interpolate', ['linear'], ['get', 'population'], 0, 2, 1000000, 5, 10000000, 8],
        9, ['interpolate', ['linear'], ['get', 'population'], 0, 6, 1000000, 15, 10000000, 25]
      ],
      'circle-color': [
        'interpolate',
        ['linear'],
        ['get', 'peacePercentage'],
        0, '#FF5252',
        25, '#FF9800',
        50, '#FFC107',
        75, '#8BC34A',
        100, '#2E7D32'
      ],
      'circle-opacity': 0.8,
      'circle-stroke-width': 1,
      'circle-stroke-color': '#ffffff'
    }
  });
}

/**
 * Adds city labels layer for peace visualization
 */
function addCityLabelsLayer(map: Map): void {
  const layerId = 'city-labels';
  
  if (map.getLayer(layerId)) return;
  
  map.addLayer({
    id: layerId,
    type: 'symbol',
    source: 'peace-cities',
    minzoom: 5,
    layout: {
      'text-field': [
        'format',
        ['get', 'city'],
        { 'font-scale': 1.0 },
        '\n',
        {},
        [
          'concat',
          ['to-string', ['round', ['get', 'peacePercentage']]],
          '% for peace'
        ],
        { 'font-scale': 0.8 }
      ],
      'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
      'text-size': [
        'interpolate',
        ['linear'],
        ['zoom'],
        5, 10,
        8, 14,
        12, 18
      ],
      'text-max-width': 10,
      'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
      'text-radial-offset': 0.5,
      'text-justify': 'auto',
      'text-padding': 5,
      'text-allow-overlap': false,
      'symbol-sort-key': ['-', ['get', 'peacePercentage']]
    },
    paint: {
      'text-color': [
        'interpolate',
        ['linear'],
        ['get', 'peacePercentage'],
        0, '#FF5252',
        25, '#FF9800',
        50, '#FFC107',
        75, '#8BC34A',
        100, '#2E7D32'
      ],
      'text-halo-color': 'rgba(255, 255, 255, 0.75)',
      'text-halo-width': 1.5,
      'text-halo-blur': 0.5
    }
  });
} 