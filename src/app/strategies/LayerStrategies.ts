import { Map as MapLibreImpl } from '../../../public/lib/maplibre-gl/dist/maplibre-gl-dev';
import type { Map } from 'maplibre-gl';
import { MapStrategy, BaseMapStrategy } from './MapStrategies';
import { FeatureCollection } from 'geojson';

// For type safety
type MapLibre = Map;

// Core interface for layer strategies
export interface LayerStrategy {
  getId(): string;
  apply(map: MapLibre, mapStrategy?: MapStrategy): void;
  remove(map: MapLibre): void;
  isCompatibleWith(mapStrategy: MapStrategy): boolean;
}

// Heatmap layer strategy
export class HeatmapLayerStrategy implements LayerStrategy {
  id: string;
  sourceId: string;
  private data: FeatureCollection;
  private countryData: FeatureCollection | null = null; // Add country data for labels
  private pendingUpdate: boolean = false;
  private lastUpdateTime: number = 0;
  private updateDebounceTime: number = 200; // Minimum time between data updates
  private isInitialized: boolean = false;
  private styleLoadedOnce: boolean = false;
  private pendingInitialization: boolean = false;
  private isMapRotating: boolean = false;
  private updateQueue: Array<any> = [];
  private mapMovingTimeout: NodeJS.Timeout | null = null;
  private isVisible: boolean = true;
  
  constructor(
    id: string, 
    sourceId: string, 
    initialData: FeatureCollection,
    countryData: FeatureCollection | null = null
  ) {
    this.id = id;
    this.sourceId = sourceId;
    this.data = initialData;
    this.countryData = countryData;
  }
  
  setVisibility(map: MapLibre, visible: boolean): void {
    if (this.isInitialized) {
      const layerIds = [
        this.id,
        `${this.id}-point`,
        `${this.id}-country-labels`
      ];
      layerIds.forEach(layerId => {
        if (map.getLayer(layerId)) {
          map.setLayoutProperty(layerId, 'visibility', visible ? 'visible' : 'none');
        }
      });
      this.isVisible = visible;
    }
  }
  
  apply(map: MapLibre, mapStrategy?: MapStrategy): void {
    // Prevent duplicate initialization
    if (this.pendingInitialization) {
      console.log('🔥 HeatmapLayerStrategy.apply: Already waiting for style to load, skipping');
      return;
    }
    
    // Check if the style is loaded
    if (!map.isStyleLoaded()) {
      if (this.styleLoadedOnce) {
        console.log('🔥 HeatmapLayerStrategy.apply: Style was previously loaded but now unloaded - strategy change detected');
        this.styleLoadedOnce = false;
        this.isInitialized = false;
      }
      
      console.log('🔥 HeatmapLayerStrategy.apply: Style not loaded yet, waiting for style.load event');
      this.pendingInitialization = true;
      
      // Wait for style to load before applying
      map.once('style.load', () => {
        console.log('🔥 HeatmapLayerStrategy.apply: Style now loaded, proceeding with initialization');
        this.pendingInitialization = false;
        this.styleLoadedOnce = true;
        this.apply(map, mapStrategy);
      });
      return;
    }
    
    // Set flag to indicate style was loaded at least once
    this.styleLoadedOnce = true;
    
    // Check if already initialized with this source/layer
    if (this.isInitialized && map.getSource(this.sourceId) && map.getLayer(this.id)) {
      console.log(`🔥 HeatmapLayerStrategy.apply: Already initialized with source ${this.sourceId} and layer ${this.id}`);
      return;
    }
    
    console.log('🔥 HeatmapLayerStrategy.apply: Applying heatmap layer:', this.id, 'with', this.data.features.length, 'points');
    
    // Clean up any existing sources/layers first to prevent duplicates
    this.remove(map);
    
    try {
      // Add heat point source
      console.log('🔥 Adding heat source:', this.sourceId);
      map.addSource(this.sourceId, {
        type: 'geojson',
        data: this.data,
        buffer: 256,
        tolerance: 0.5,
        cluster: false,
        generateId: false
      });
      
      // Add country data source if available
      if (this.countryData) {
        console.log('🔥 Adding country source for labels');
        map.addSource(`${this.sourceId}-countries`, {
          type: 'geojson',
          data: this.countryData,
          generateId: true
        });
      }
      
      // Add heatmap layer
      console.log('🔥 Adding heatmap layer:', this.id);
      map.addLayer({
        id: this.id,
        type: 'heatmap',
        source: this.sourceId,
        maxzoom: 9,
        paint: {
          // Weight points based on the magnitude property value
          'heatmap-weight': [
            'interpolate',
            ['linear'],
            ['get', 'mag'],
            0, 0,
            2, 0.3,
            4, 0.6,
            6, 1
          ],
          // Control the intensity (brightness) of the heatmap
          'heatmap-intensity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0, 2,
            5, 3,
            9, 5
          ],
          // Color gradient for the heatmap density
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0, 'rgba(0,0,255,0)',
            0.1, 'royalblue',
            0.3, 'cyan',
            0.5, 'lime',
            0.7, 'yellow',
            1, 'red'
          ],
          // Radius increases with zoom level for better visualization
          'heatmap-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0, 5,
            3, 10,
            6, 15,
            9, 25
          ],
          // Gradually fade out heatmap as user zooms in
          'heatmap-opacity': 0.75 // Fixed value for better performance
        }
      });
      
      // Add point layer
      console.log('🔥 Adding point layer:', `${this.id}-point`);
      map.addLayer({
        id: `${this.id}-point`,
        type: 'circle',
        source: this.sourceId,
        minzoom: 7,
        paint: {
          // Size circles by magnitude and zoom level for better visibility
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            7, ['interpolate', ['linear'], ['get', 'mag'], 1, 1, 6, 6],
            16, ['interpolate', ['linear'], ['get', 'mag'], 1, 10, 6, 60]
          ],
          // Color circles using the same color scheme as the heatmap
          'circle-color': [
            'interpolate',
            ['linear'],
            ['get', 'mag'],
            1, 'royalblue',
            2, 'cyan',
            3, 'lime',
            4, 'yellow',
            5, 'orange',
            6, 'red'
          ],
          'circle-stroke-color': 'white',
          'circle-stroke-width': 1,
          // Fade in circles as the heatmap fades out
          'circle-opacity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            7, 0,
            8, 0.5,
            9, 1
          ]
        }
      });
      
      // Add country labels if country data is available
      if (this.countryData) {
        console.log('🔥 Adding country labels');
        
        const labelConfig = mapStrategy?.getLabelConfig() || BaseMapStrategy.getBaseLabelConfig();
        
        // Add background label layer first (for halo effect)
        map.addLayer({
          id: `${this.id}-country-labels-bg`,
          type: 'symbol',
          source: `${this.sourceId}-countries`,
          layout: {
            visibility: this.isVisible ? 'visible' : 'none',
            ...labelConfig.layout
          },
          paint: labelConfig.backgroundPaint
        });

        // Add foreground label layer
        map.addLayer({
          id: `${this.id}-country-labels`,
          type: 'symbol',
          source: `${this.sourceId}-countries`,
          layout: {
            visibility: this.isVisible ? 'visible' : 'none',
            ...labelConfig.layout
          },
          paint: labelConfig.foregroundPaint
        });
      }
      
      // Setup event handlers for map movement
      this.setupMovementHandlers(map);
      
      // Mark as initialized
      this.isInitialized = true;
    } catch (error) {
      console.error('🔥 Error applying heatmap layer:', error);
      
      // Reset initialization flag if there was an error
      this.isInitialized = false;
      
      // If error is due to style not loaded, try again when style loads
      if (!map.isStyleLoaded()) {
        this.pendingInitialization = true;
        map.once('style.load', () => {
          this.pendingInitialization = false;
          this.apply(map, mapStrategy);
        });
      }
    }
  }
  
  // Set up handlers to detect map movement and prevent flickering
  private setupMovementHandlers(map: MapLibre): void {
    // When map starts moving (rotating), mark as rotating to pause updates
    map.on('movestart', () => {
      this.isMapRotating = true;
      
      // Clear any existing timeout
      if (this.mapMovingTimeout) {
        clearTimeout(this.mapMovingTimeout);
        this.mapMovingTimeout = null;
      }
    });
    
    // When map stops moving, wait a bit before allowing updates again
    map.on('moveend', () => {
      // Set a timeout to mark rotation as stopped after a short delay
      this.mapMovingTimeout = setTimeout(() => {
        this.isMapRotating = false;
        
        // If we have queued updates, process them now
        if (this.updateQueue.length > 0) {
          console.log(`🔥 Processing ${this.updateQueue.length} queued updates after rotation stopped`);
          const features = this.updateQueue.flat();
          this.updateQueue = [];
          
          // Update the data without triggering rotation check
          this.updateDataImmediate(map, features);
        }
      }, 500); // Wait 500ms after rotation ends to update
    });
  }
  
  /**
   * Updates the heatmap data by adding new points to the existing data
   * @param map The MapLibre instance
   * @param newFeatures Array of new features to add to the existing data
   * @param maxPoints Maximum number of points to keep (oldest will be removed)
   */
  updateData(map: MapLibre, newFeatures: Array<any>, maxPoints: number = 2000): void {
    // Skip update if no features to add
    if (!newFeatures || newFeatures.length === 0) {
      return;
    }
    
    // If map is rotating, queue the update for later
    if (this.isMapRotating) {
      console.log(`🔥 Map is rotating, queueing ${newFeatures.length} points for later`);
      this.updateQueue.push(newFeatures);
      return;
    }
    
    this.updateDataImmediate(map, newFeatures, maxPoints);
  }
  
  /**
   * Update data without checking rotation status
   */
  private updateDataImmediate(map: MapLibre, newFeatures: Array<any>, maxPoints: number = 2000): void {
    console.log(`🔥 Adding ${newFeatures.length} new points to heatmap`);
    
    try {
      // Add the new features to our existing data
      this.data.features = [...this.data.features, ...newFeatures];
      
      // Limit the number of features to prevent performance issues
      if (this.data.features.length > maxPoints) {
        // Remove oldest features (those that came first in the array)
        const excess = this.data.features.length - maxPoints;
        this.data.features = this.data.features.slice(excess);
        console.log(`🔥 Removed ${excess} oldest points to maintain performance`);
      }
      
      console.log(`🔥 Heatmap now has ${this.data.features.length} total points`);
      
      // Check if initialization is complete
      if (!this.isInitialized) {
        console.log('🔥 Heatmap not initialized yet, trying to initialize');
        this.apply(map);
        return;
      }
      
      // Check if map style is loaded
      if (!map.isStyleLoaded()) {
        console.log('🔥 Map style not loaded yet, waiting for style.load event');
        map.once('style.load', () => {
          this.updateSourceData(map);
        });
        return;
      }
      
      // Debounce updates to prevent too many rapid redraws
      this.debouncedUpdateSourceData(map);
    } catch (error) {
      console.error('🔥 Error updating heatmap data:', error);
    }
  }
  
  /**
   * Debounced update to avoid too frequent data updates during rotation
   */
  private debouncedUpdateSourceData(map: MapLibre): void {
    const currentTime = Date.now();
    
    // Skip if map is currently rotating
    if (this.isMapRotating) {
      console.log('🔥 Skipping update while map is rotating');
      return;
    }
    
    // If we have a pending update or it's too soon since last update, debounce
    if (this.pendingUpdate || currentTime - this.lastUpdateTime < this.updateDebounceTime) {
      // If we don't already have a pending update, schedule one
      if (!this.pendingUpdate) {
        this.pendingUpdate = true;
        setTimeout(() => {
          // Only proceed if map is not rotating
          if (!this.isMapRotating) {
            this.updateSourceData(map);
          } else {
            console.log('🔥 Map started rotating during debounce, skipping update');
          }
          this.pendingUpdate = false;
          this.lastUpdateTime = Date.now();
        }, this.updateDebounceTime);
      }
      return;
    }
    
    // Otherwise, update immediately
    this.updateSourceData(map);
    this.lastUpdateTime = currentTime;
  }
  
  /**
   * Updates the source data in the map
   */
  private updateSourceData(map: MapLibre): void {
    // Skip if map is rotating
    if (this.isMapRotating) {
      console.log('🔥 Map is rotating, skipping source update');
      return;
    }
    
    // Get the source to update
    const source = map.getSource(this.sourceId);
    
    if (source && 'setData' in source) {
      // Source exists, update its data
      console.log(`🔥 Updating existing source: ${this.sourceId}`);
      (source as any).setData(this.data);
    } else {
      // Source doesn't exist, apply the layer from scratch
      console.log(`🔥 Source ${this.sourceId} doesn't exist, applying layer from scratch`);
      this.apply(map);
    }
  }
  
  remove(map: MapLibre): void {
    try {
      console.log('🔥 HeatmapLayerStrategy.remove: Actually removing heatmap layers and sources');
      
      // List of all layer IDs this strategy creates
      const layerIds = [
        this.id,                        // Main heatmap layer
        `${this.id}-point`,             // Point layer
        `${this.id}-country-labels`,    // Label layer
        `${this.id}-country-labels-bg`  // Label background layer
      ];
      
      // Remove all layers first
      layerIds.forEach(layerId => {
        if (map.getLayer(layerId)) {
          console.log(`🔥 Removing layer: ${layerId}`);
          map.removeLayer(layerId);
        }
      });
      
      // Then remove the sources
      const sourceIds = [
        this.sourceId,
        `${this.sourceId}-countries`
      ];
      
      sourceIds.forEach(sourceId => {
        if (map.getSource(sourceId)) {
          console.log(`🔥 Removing source: ${sourceId}`);
          map.removeSource(sourceId);
        }
      });
      
      // Reset initialization state
      this.isInitialized = false;
      
      // Clear any update queue
      this.updateQueue = [];
    } catch (error) {
      console.error('🔥 Error removing heatmap layers:', error);
    }
  }

  getId(): string {
    return this.id;
  }

  isCompatibleWith(mapStrategy: MapStrategy): boolean {
    return true; // This layer works with all map strategies
  }
}

// Peace layer strategy
export class PeaceLayerStrategy implements LayerStrategy {
  id: string;
  sourceId: string;
  private data: FeatureCollection;
  private isInitialized: boolean = false;
  private styleLoadedOnce: boolean = false;
  private pendingInitialization: boolean = false;
  private isVisible: boolean = true;

  constructor(id: string, sourceId: string, initialData: FeatureCollection) {
    this.id = id;
    this.sourceId = sourceId;
    this.data = initialData;
  }

  setVisibility(map: MapLibre, visible: boolean): void {
    if (this.isInitialized) {
      const layerIds = [
        `${this.id}-fill`,
        `${this.id}-border`,
        `${this.id}-label`
      ];
      layerIds.forEach(layerId => {
        if (map.getLayer(layerId)) {
          map.setLayoutProperty(layerId, 'visibility', visible ? 'visible' : 'none');
        }
      });
      this.isVisible = visible;
    }
  }

  apply(map: MapLibre, mapStrategy?: MapStrategy): void {
    // Prevent duplicate initialization
    if (this.pendingInitialization) {
      console.log('🕊️ PeaceLayerStrategy.apply: Already waiting for style to load, skipping');
      return;
    }

    // Check if the style is loaded
    if (!map.isStyleLoaded()) {
      if (this.styleLoadedOnce) {
        console.log('🕊️ PeaceLayerStrategy.apply: Style was previously loaded but now unloaded - strategy change detected');
        this.styleLoadedOnce = false;
        this.isInitialized = false;
      }

      console.log('🕊️ PeaceLayerStrategy.apply: Style not loaded yet, waiting for style.load event');
      this.pendingInitialization = true;

      map.once('style.load', () => {
        console.log('🕊️ PeaceLayerStrategy.apply: Style now loaded, proceeding with initialization');
        this.pendingInitialization = false;
        this.styleLoadedOnce = true;
        this.apply(map, mapStrategy);
      });
      return;
    }

    this.styleLoadedOnce = true;

    // Check if already initialized
    if (this.isInitialized && map.getSource(this.sourceId) && map.getLayer(`${this.id}-fill`)) {
      console.log(`🕊️ PeaceLayerStrategy.apply: Already initialized with source ${this.sourceId}`);
      this.setVisibility(map, true);
      return;
    }

    try {
      // Add source if it doesn't exist
      if (!map.getSource(this.sourceId)) {
        console.log('🕊️ Adding source:', this.sourceId);
        map.addSource(this.sourceId, {
          type: 'geojson',
          data: this.data,
          generateId: true
        });
      }

      // Add fill layer for countries
      console.log('🕊️ Adding fill layer');
      map.addLayer({
        id: `${this.id}-fill`,
        type: 'fill',
        source: this.sourceId,
        layout: {
          visibility: this.isVisible ? 'visible' : 'none'
        },
        paint: {
          'fill-color': [
            'case',
            ['has', 'peacePercentage'],
            [
              'interpolate',
              ['linear'],
              ['get', 'peacePercentage'],
              0, '#ff0000',  // Red for 0%
              25, '#ff6600', // Orange-red for 25%
              50, '#ffcc00', // Yellow for 50%
              75, '#99ff33', // Light green for 75%
              100, '#00cc00' // Dark green for 100%
            ],
            '#808080' // Gray for no data
          ],
          'fill-opacity': 0.6
        }
      });

      // Add border layer
      console.log('🕊️ Adding border layer');
      map.addLayer({
        id: `${this.id}-border`,
        type: 'line',
        source: this.sourceId,
        layout: {
          visibility: this.isVisible ? 'visible' : 'none'
        },
        paint: {
          'line-color': '#000000',
          'line-width': 1,
          'line-opacity': 0.5
        }
      });

      // Add background label layer first (for halo effect)
      console.log('🕊️ Adding background labels');
      const labelConfig = mapStrategy?.getLabelConfig() || BaseMapStrategy.getBaseLabelConfig();
      
      map.addLayer({
        id: `${this.id}-label-bg`,
        type: 'symbol',
        source: this.sourceId,
        layout: {
          visibility: this.isVisible ? 'visible' : 'none',
          ...labelConfig.layout
        },
        paint: labelConfig.backgroundPaint
      });

      // Add foreground label layer
      console.log('🕊️ Adding foreground labels');
      map.addLayer({
        id: `${this.id}-label`,
        type: 'symbol',
        source: this.sourceId,
        layout: {
          visibility: this.isVisible ? 'visible' : 'none',
          ...labelConfig.layout
        },
        paint: labelConfig.foregroundPaint
      });

      this.isInitialized = true;
      console.log('🕊️ Peace layer initialization complete');

    } catch (error) {
      console.error('🕊️ Error applying peace layer:', error);
      this.isInitialized = false;

      if (!map.isStyleLoaded()) {
        this.pendingInitialization = true;
        map.once('style.load', () => {
          this.pendingInitialization = false;
          this.apply(map, mapStrategy);
        });
      }
    }
  }

  updateCountryPeace(map: MapLibre, countryName: string, peacePercentage: number): void {
    if (!this.isInitialized || !map.getSource(this.sourceId)) return;

    try {
      // Find the country feature and update its peace percentage
      const features = this.data.features.map(feature => {
        if (feature.properties?.name === countryName) {
          return {
            ...feature,
            properties: {
              ...feature.properties,
              peacePercentage: peacePercentage
            }
          };
        }
        return feature;
      });

      this.data = {
        ...this.data,
        features
      };

      // Update the source data
      const source = map.getSource(this.sourceId);
      if (source && 'setData' in source) {
        (source as any).setData(this.data);
      }
    } catch (error) {
      console.error('🕊️ Error updating country peace data:', error);
    }
  }

  remove(map: MapLibre): void {
    try {
      console.log('🕊️ PeaceLayerStrategy.remove: Actually removing peace layers and sources');
      
      // List of all layer IDs this strategy creates
      const layerIds = [
        `${this.id}-fill`,         // Fill layer
        `${this.id}-border`,       // Border layer 
        `${this.id}-label`,        // Label layer
        `${this.id}-label-bg`      // Label background layer
      ];
      
      // Remove all layers first
      layerIds.forEach(layerId => {
        if (map.getLayer(layerId)) {
          console.log(`🕊️ Removing layer: ${layerId}`);
          map.removeLayer(layerId);
        }
      });
      
      // Then remove the source
      if (map.getSource(this.sourceId)) {
        console.log(`🕊️ Removing source: ${this.sourceId}`);
        map.removeSource(this.sourceId);
      }
      
      // Reset initialization state
      this.isInitialized = false;
    } catch (error) {
      console.error('🕊️ Error removing peace layers:', error);
    }
  }

  getId(): string {
    return this.id;
  }

  isCompatibleWith(mapStrategy: MapStrategy): boolean {
    return true; // This layer works with all map strategies
  }
}