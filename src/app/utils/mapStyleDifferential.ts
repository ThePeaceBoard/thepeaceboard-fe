// import { MapStyle } from '../types/map';
import { getMapStyle } from './mapStyles';
import { StyleSpecification } from '../../../public/lib/maplibre-gl/dist/maplibre-gl-dev';

interface ExtendedStyleSpecification extends StyleSpecification {
  fog?: {
    color: string;
    'high-color': string;
    'horizon-blend': number;
    'space-color': string;
    'star-intensity': number;
  };
  projection?: {
    name?: string;
    type: string;
  };
}

const baseStyle: StyleSpecification = {
  version: 8,
  sources: {
    'osm': {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '',
      maxzoom: 19
    }
  },
  layers: [
    {
      id: 'osm',
      type: 'raster',
      source: 'osm',
      paint: {
        'raster-fade-duration': 0
      }
    }
  ]
};

/**
 * Gets the appropriate map style based on projection and map type
 * with additional enhancements and modifications
 */
export const mapStyleDifferential = (
  projection: 'globe' | 'mercator',
  activeMap: 'peace' | 'heat'
): ExtendedStyleSpecification => {
  // Start with the base style from mapStyles.ts
  const style = { ...getMapStyle(projection, activeMap) } as ExtendedStyleSpecification;

  // Ensure sources are properly configured
  if (!style.sources) {
    style.sources = {};
  }
  
  // Remove or clear attributions from all sources
  Object.values(style.sources).forEach(source => {
    if (source && typeof source === 'object' && 'attribution' in source) {
      (source as any).attribution = '';
    }
  });

  // Configure projection-specific settings
  if (projection === 'globe') {
    // Set projection to globe
    style.projection = {
      type: 'globe'
    };
    
    // Enhanced light settings for 3D effect
    style.light = {
      anchor: 'viewport',
      color: 'white',
      intensity: activeMap === 'heat' ? 0.7 : 0.5,
      position: [1.15, 210, 30]
    };

    // Enhanced fog for atmosphere effect
    style.fog = {
      color: activeMap === 'heat' ? 'rgb(186, 210, 235)' : 'rgb(186, 210, 235)',
      'high-color': activeMap === 'heat' ? 'rgb(36, 92, 223)' : 'rgb(36, 92, 223)',
      'horizon-blend': activeMap === 'heat' ? 0.15 : 0.1,
      'space-color': activeMap === 'heat' ? 'rgb(11, 11, 25)' : 'rgb(11, 11, 25)',
      'star-intensity': activeMap === 'heat' ? 0.9 : 0.8
    };

    // Adjust transition settings for smoother globe rotation
    style.transition = {
      duration: activeMap === 'heat' ? 1500 : 1000,
      delay: 0
    };
  } else {
    // Remove globe-specific settings for mercator projection
    delete style.projection;
    delete style.light;
    delete style.fog;
  }

  // Ensure proper render settings
  style.version = 8;
  
  return style;
}; 