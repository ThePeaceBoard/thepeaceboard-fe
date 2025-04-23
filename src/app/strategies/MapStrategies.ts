import { Map as MapLibreImpl } from '../../../public/lib/maplibre-gl/dist/maplibre-gl-dev'; 
import type { StyleSpecification, MapOptions, Map } from 'maplibre-gl'; //ProjectionSpecification

// Use MapLibre as the type
type MapLibre = Map;

// Core interfaces for map strategies
export interface MapStrategy {
  getStyleSpec(): StyleSpecification;
  configureMap(map: MapLibre): void;
  getLabelConfig(): {
    layout: any;
    backgroundPaint: any;
    foregroundPaint: any;
  };
}

// Base implementation for map strategies
export abstract class BaseMapStrategy implements MapStrategy {
  protected baseStyle: StyleSpecification;
  
  constructor(baseStyle: StyleSpecification) {
    this.baseStyle = baseStyle;
  }
  
  abstract getStyleSpec(): StyleSpecification;
  abstract configureMap(map: MapLibre): void;
  
  static getBaseLabelConfig(): {
    layout: any;
    backgroundPaint: any;
    foregroundPaint: any;
  } {
    return {
      layout: {
        'text-field': [
          'format',
          ['get', 'name'],
          { 'font-scale': 1.4 },
          '\n',
          {},
          [
            'case',
            ['has', 'peacePercentage'],
            [
              'concat',
              ['to-string', ['round', ['get', 'peacePercentage']]],
              '% for peace'
            ],
            '0% for peace'
          ],
          { 'font-scale': 1.2 }
        ],
        'text-font': ['Arial Unicode MS Bold'],
        'text-size': 24,
        'text-anchor': 'center',
        'text-justify': 'center',
        'text-radial-offset': 0.5,
        'text-variable-anchor': ['center', 'top', 'bottom', 'left', 'right'],
        'text-allow-overlap': true,
        'text-ignore-placement': true,
        'symbol-placement': 'point',
        'symbol-sort-key': ['get', 'peacePercentage']
      },
      backgroundPaint: {
        'text-color': '#ffffff',
        'text-halo-color': '#000000',
        'text-halo-width': 4,
        'text-opacity': 1
      },
      foregroundPaint: {
        'text-color': [
          'case',
          ['has', 'peacePercentage'],
          [
            'interpolate',
            ['linear'],
            ['get', 'peacePercentage'],
            0, '#ff0000',   // Red for 0%
            25, '#ff6600',  // Orange-red for 25%
            50, '#ffcc00',  // Yellow for 50%
            75, '#99ff33',  // Light green for 75%
            100, '#00cc00'  // Dark green for 100%
          ],
          '#808080'  // Gray for no data
        ],
        'text-opacity': 1
      }
    };
  }
  
  getLabelConfig(): {
    layout: any;
    backgroundPaint: any;
    foregroundPaint: any;
  } {
    return BaseMapStrategy.getBaseLabelConfig();
  }
}

// Globe projection strategy
// export class GlobeMapStrategy implements MapStrategy {
//   private style: StyleSpecification;
//   private mapType: 'heat' | 'peace';
//   private rotationEnabled: boolean;
//   private rotationInterval: NodeJS.Timeout | null = null;
//   private rotationSpeed: number = 0.15; // Increased from 0.05 for faster rotation
//   private currentBearing: number = 0;
//   private isRotating: boolean = false;

//   constructor(style: StyleSpecification, mapType: 'heat' | 'peace', rotationEnabled: boolean = true) {
//     this.style = style;
//     this.mapType = mapType;
//     this.rotationEnabled = rotationEnabled;
//   }

//   getStyleSpec(): StyleSpecification {
//     console.log('🔍 GlobeMapStrategy.getStyleSpec: Style object:', {
//       type: (this.style as any).type,
//       version: this.style.version,
//       hasProjection: !!this.style.projection,
//       hasFog: !!(this.style as any).fog,
//       sources: Object.keys(this.style.sources || {}),
//       layers: (this.style.layers || []).map(l => ({ id: l.id, type: l.type })),
//       layerCount: this.style.layers?.length || 0
//     });
    
//     // Create a deep copy of the style
//     const styleCopy = JSON.parse(JSON.stringify(this.style));
    
//     // Ensure version is set
//     if (!styleCopy.version) {
//       styleCopy.version = 8;
//     }
    
//     // Add fog settings if not present
//     styleCopy.fog = {
//       'horizon-blend': 0.02,
//       'star-intensity': 0.8,
//       'color': '#183046',
//       'high-color': '#000080',
//       'space-color': '#000000'
//     };
    
//     return styleCopy;
//   }
  
//   getLabelConfig(): {
//     layout: any;
//     backgroundPaint: any;
//     foregroundPaint: any;
//   } {
//     const baseConfig = BaseMapStrategy.getBaseLabelConfig();
//     return {
//       ...baseConfig,
//       layout: {
//         ...baseConfig.layout,
//         'text-size': 28, // Larger text for globe view
//         'text-radial-offset': 0.8 // Larger offset for better visibility on globe
//       },
//       backgroundPaint: {
//         ...baseConfig.backgroundPaint,
//         'text-halo-width': 5 // Wider halo for better contrast on globe
//       }
//     };
//   }
  
//   configureMap(map: MapLibre): void {
//     console.log('🔍 GlobeMapStrategy.configureMap: Configuring map with rotation:', this.rotationEnabled);
    
//     const styleSpec = this.getStyleSpec();
    
//     // Ensure glyphs URL is set
//     if (!styleSpec.glyphs) {
//       styleSpec.glyphs = "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf";
//     }
    
//     // Set projection in the style spec directly
//     styleSpec.projection = { name: 'globe', type: 'globe' } as ProjectionSpecification;
    
//     console.log('🔍 Globe initial style:', {
//       styleKeys: Object.keys(styleSpec),
//       projection: styleSpec.projection,
//       glyphs: styleSpec.glyphs,
//       fog: (styleSpec as any).fog
//     });
    
//     // Wait for the map to be ready before setting style
//     if (!map.isStyleLoaded()) {
//       map.once('style.load', () => {
//         this.applyMapStyle(map, styleSpec);
//       });
//     } else {
//       this.applyMapStyle(map, styleSpec);
//     }
//   }
  
//   private applyMapStyle(map: MapLibre, styleSpec: StyleSpecification): void {
//     // Set the style first
//     map.setStyle(styleSpec);
    
//     // Then configure additional settings after style loads
//     map.once('style.load', () => {
//       // Log style after loading
//       console.log('🔍 Globe style.load event fired, current style:', {
//         styleKeys: Object.keys(map.getStyle()),
//         layerIds: map.getStyle().layers?.map(l => l.id) || []
//       });
      
//       // Smoothly transition to new settings
//       map.easeTo({
//         pitch: 55,
//         duration: 2000,
//         essential: true
//       });
      
//       //@ts-ignore - setFog exists in MapLibre but TypeScript doesn't recognize it
//       map.setFog({
//         'horizon-blend': 0.02,
//         'star-intensity': 0.8,
//         'color': '#183046',      // Deeper blue color
//         'high-color': '#000080', // Navy blue for high altitude
//         'space-color': '#000000'
//       });
      
//       // Log final style after all configuration
//       console.log('🔍 Globe final style:', {
//         styleKeys: Object.keys(map.getStyle()),
//         layerIds: map.getStyle().layers?.map(l => l.id) || [],
//         // projectionType: map.getProjection()?.type
//       });
//     });
//   }
  
//   startRotation(map: MapLibre): void {
//     if (this.rotationInterval) {
//       clearInterval(this.rotationInterval);
//       this.rotationInterval = null;
//     }
    
//     // Start with a smooth initial rotation
//     map.easeTo({
//       bearing: 0,
//       duration: 1000,
//       essential: true
//     });
    
//     let lastTime = 0;
//     const minTimeBetweenFrames = 100; // Minimum 100ms between frames (10 fps max)
//     let animationFrameId: number;
    
//     // Use requestAnimationFrame for smoother rotation with adaptive frame rate
//     const rotateGlobe = (currentTime: number) => {
//       // Throttle to reduce redraw frequency - helps reduce flickering
//       if (currentTime - lastTime >= minTimeBetweenFrames) {
//         const currentRotation = map.getBearing();
        
//         // Use bearingTo instead of easeTo to avoid constant camera animations
//         // This causes less redraws of the heatmap layer
//         map.setBearing(currentRotation + this.rotationSpeed);
        
//         lastTime = currentTime;
//       }
      
//       // Continue the animation loop
//       animationFrameId = requestAnimationFrame(rotateGlobe);
//     };
    
//     // Wait for initial rotation to complete before starting continuous rotation
//     setTimeout(() => {
//       // Start the animation loop
//       animationFrameId = requestAnimationFrame(rotateGlobe);
      
//       // Store the ID in rotationInterval for cleanup (even though it's not an interval)
//       this.rotationInterval = {
//         unref: () => {}, 
//         ref: () => {},
//         refresh: () => {},
//         hasRef: () => false,
//         [Symbol.toPrimitive]: () => animationFrameId
//       } as any;
//     }, 1000);
//   }
  
//   stopRotation(): void {
//     if (this.rotationInterval) {
//       // Cancel the animation frame if it's using requestAnimationFrame
//       if (typeof (this.rotationInterval as any)[Symbol.toPrimitive] === 'function') {
//         cancelAnimationFrame((this.rotationInterval as any)[Symbol.toPrimitive]());
//       } else {
//         // Fallback to clearInterval for backwards compatibility
//         clearInterval(this.rotationInterval);
//       }
//       this.rotationInterval = null;
//     }
//   }
  
//   cleanup(): void {
//     this.stopRotation();
//   }
// }

// Mercator projection strategy
export class MercatorMapStrategy extends BaseMapStrategy {
  private style: StyleSpecification;
  private readonly originalStyle: StyleSpecification;

  constructor(style: StyleSpecification) {
    super(style);
    this.originalStyle = JSON.parse(JSON.stringify(style));
    this.style = JSON.parse(JSON.stringify(style));
  }

  getStyleSpec(): StyleSpecification {
    const style = JSON.parse(JSON.stringify(this.style));
    
    // Explicitly set mercator projection
    style.projection = { type: 'mercator' };
    
    // Remove 3D properties
    delete (style as any).fog;
    delete (style as any).light;
    delete (style as any).sky;
    
    return style;
  }
  
  getLabelConfig(): {
    layout: any;
    backgroundPaint: any;
    foregroundPaint: any;
  } {
    const baseConfig = BaseMapStrategy.getBaseLabelConfig();
    return {
      ...baseConfig,
      layout: {
        ...baseConfig.layout,
        'text-size': 20, // Slightly smaller text for 2D view
        'text-radial-offset': 0.3 // Smaller offset for 2D view
      }
    };
  }
  
  configureMap(map: MapLibre): void {
    console.log('🔍 MercatorMapStrategy.configureMap: Configuring map');
    
    // Set style with explicit projection
    const styleSpec = this.getStyleSpec();
    map.setStyle(styleSpec);
    
    map.once('style.load', () => {
      console.log('🔍 Mercator style loaded');
      
      // Reset view to standard 2D map
      map.easeTo({
        pitch: 0,
        bearing: 0,
        duration: 2000,
        essential: true
      });
      
      // // Ensure projection is set (though it should be from style)
      // map.setProjection({ type: 'mercator' } as ProjectionSpecification);
    });
  }
  
  cleanup(): void {
    console.log('🔍 MercatorMapStrategy.cleanup: Resetting style to original');
    // Reset style to original
    this.style = JSON.parse(JSON.stringify(this.originalStyle));
  }
} 