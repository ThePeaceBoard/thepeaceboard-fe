import { StyleSpecification } from '../../../public/lib/maplibre-gl/dist/maplibre-gl-dev';
import mercatorHeatStyle from '../styles/map/mercatorHeatStyle.json';
import mercatorPeaceStyle from '../styles/map/meractorPeaceStyle.json';
import globeHeatStyle from '../styles/map/globeHeatStyle.json';
import globePeaceStyle from '../styles/map/globePeaceStyle.json';

// Export styles with type casting to StyleSpecification
export const heatBaseStyle: StyleSpecification = mercatorHeatStyle as StyleSpecification;
export const peaceBaseStyle: StyleSpecification = mercatorPeaceStyle as StyleSpecification;
export const globeHeatMapStyle: StyleSpecification = globeHeatStyle as StyleSpecification;
export const globePeaceMapStyle: StyleSpecification = globePeaceStyle as StyleSpecification;

// Export style collections by projection for easier access
export const mercatorStyles = {
  heat: heatBaseStyle,
  peace: peaceBaseStyle
};

export const globeStyles = {
  heat: globeHeatMapStyle,
  peace: globePeaceMapStyle
};

// Helper function to get the appropriate style based on projection and map type
export function getMapStyle(projection: 'globe' | 'mercator', mapType: 'heat' | 'peace'): StyleSpecification {
  if (projection === 'globe') {
    return mapType === 'heat' ? globeHeatMapStyle : globePeaceMapStyle;
  } else {
    return mapType === 'heat' ? heatBaseStyle : peaceBaseStyle;
  }
} 