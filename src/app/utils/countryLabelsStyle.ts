import { Map, StyleSpecification, LayerSpecification, ExpressionInputType, Expression } from '../../../public/lib/maplibre-gl/dist/maplibre-gl-dev';
import samplePeaceData from '../data/samplePeaceData';

/**
 * Adds percentage labels to countries by directly modifying the map style
 * This approach works consistently across different map types
 */
export function addCountryPercentageLabels(map: Map | null): void {
  if (!map || !map.isStyleLoaded()) {
    console.warn('Map not ready for adding country percentage labels');
    return;
  }

  try {
    // Get current style
    const style = map.getStyle();
    
    // Create a lookup of peace percentages by country name
    const peaceLookup: Record<string, number> = {};
    samplePeaceData.features.forEach(feature => {
      if (feature.properties && feature.properties.iso) {
        peaceLookup[feature.properties.iso] = feature.properties.peacePercentage || 0;
      }
    });
    
    // Find the countries layer or source
    const countryLayerIds = style.layers
      .filter(layer => 
        layer.id.includes('country') || 
        layer.id.includes('countries') || 
        layer.id.includes('admin')
      )
      .map(layer => layer.id);
    
    if (countryLayerIds.length === 0) {
      console.warn('No country layers found in map style');
      return;
    }
    
    // Log the available country layers
    console.log('Found country layers:', countryLayerIds);
    
    // Create a new symbol layer for the percentages
    const percentageLayerId = 'peace-percentage-labels';
    
    // Remove existing layer if it exists
    if (map.getLayer(percentageLayerId)) {
      map.removeLayer(percentageLayerId);
    }
    
    // Find appropriate source for countries
    const countryLayer = style.layers.find(layer => 
      countryLayerIds.includes(layer.id)
    ) as LayerSpecification & { source?: string };
    
    const countrySource = countryLayer?.source;
    
    if (!countrySource) {
      console.warn('Could not find source for country layers');
      return;
    }
    
    // Find source layer if applicable
    const countryLayerWithSourceLayer = style.layers.find(layer => 
      countryLayerIds.includes(layer.id) 
    ) as LayerSpecification & { 'source-layer'?: string };
    
    const sourceLayer = countryLayerWithSourceLayer?.['source-layer'];
    
    console.log(`Using source: ${countrySource}, source-layer: ${sourceLayer || 'N/A'}`);
    
    // Create matched array for expressions
    const matchIsoEntries: (string | number)[] = [];
    Object.entries(peaceLookup).forEach(([iso, value]) => {
      matchIsoEntries.push(iso, value);
    });
    
    // Add the percentage label layer
    map.addLayer({
      id: percentageLayerId,
      type: 'symbol',
      source: countrySource,
      'source-layer': sourceLayer,
      layout: {
        'text-field': [
          'concat',
          ['number-format', 
            ['coalesce', 
              ['get', 'peacePercentage'], 
              ['match', ['get', 'iso_a3'], ...matchIsoEntries, 0]
            ],
            { 'min-fraction-digits': 0, 'max-fraction-digits': 0 }
          ],
          '%'
        ],
        'text-size': 16,
        'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
        'text-allow-overlap': true,
        'text-ignore-placement': true,
        'symbol-placement': 'point',
        'text-variable-anchor': ['center'],
        'visibility': 'visible'
      } as any,
      paint: {
        'text-color': [
          'interpolate',
          ['linear'],
          ['coalesce', 
            ['get', 'peacePercentage'], 
            ['match', ['get', 'iso_a3'], ...matchIsoEntries, 0]
          ],
          0, '#FF5252',
          25, '#FF9800',
          50, '#FFC107',
          75, '#8BC34A',
          100, '#2E7D32'
        ],
        'text-halo-width': 1.5,
        'text-halo-color': 'rgba(0, 0, 0, 0.75)'
      } as any
    });
    
    console.log('Added peace percentage labels layer');
  } catch (error) {
    console.error('Error adding country percentage labels:', error);
  }
}

/**
 * Removes percentage labels from the map
 */
export function removeCountryPercentageLabels(map: Map | null): void {
  if (!map) return;
  
  try {
    // Remove the layer if it exists
    if (map.getLayer('peace-percentage-labels')) {
      map.removeLayer('peace-percentage-labels');
      console.log('Removed peace percentage labels layer');
    }
  } catch (error) {
    console.error('Error removing country percentage labels:', error);
  }
}

/**
 * Toggles the visibility of percentage labels
 */
export function toggleCountryPercentageLabels(map: Map | null, visible: boolean): void {
  if (!map) return;
  
  try {
    const percentageLayerId = 'peace-percentage-labels';
    
    // Check if layer exists
    if (map.getLayer(percentageLayerId)) {
      // Update visibility
      map.setLayoutProperty(
        percentageLayerId,
        'visibility',
        visible ? 'visible' : 'none'
      );
      console.log(`Peace percentage labels ${visible ? 'shown' : 'hidden'}`);
    } else if (visible) {
      // Add the layer if it doesn't exist and should be visible
      addCountryPercentageLabels(map);
    }
  } catch (error) {
    console.error('Error toggling country percentage labels:', error);
  }
} 