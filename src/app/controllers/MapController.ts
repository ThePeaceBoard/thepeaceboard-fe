import * as maplibregl from '../../../public/lib/maplibre-gl/dist/maplibre-gl-dev';
import type { MapOptions } from 'maplibre-gl';
import { MapStrategy } from '../strategies/MapStrategies';
import { LayerStrategy } from '../strategies/LayerStrategies';

export class MapController {
  private map: maplibregl.Map | null = null;
  private mapStrategy: MapStrategy;
  private activeLayers: { [key: string]: LayerStrategy } = {};
  private isStyleLoaded = false;
  
  constructor(mapStrategy: MapStrategy) {
    this.mapStrategy = mapStrategy;
  }
  
  initialize(container: HTMLElement, options: Partial<MapOptions> = {}): void {
    if (this.map) {
      console.warn('Map is already initialized');
      return;
    }
    
    // Merge default options with provided options
    const mapOptions: MapOptions = {
      container,
      style: this.mapStrategy.getStyleSpec(),
      ...options
    };
    
    this.map = new maplibregl.Map(mapOptions);
    
    // Wait for initial style load before applying strategy configuration
    this.map.once('style.load', () => {
      this.isStyleLoaded = true;
      
      if (this.map) {
        // Apply map-specific configuration from the strategy
        this.mapStrategy.configureMap(this.map);
        
        // Apply all active layers
        this.reapplyAllLayers();
      }
    });
    
    // Handle style updates
    this.map.on('style.load', () => {
      this.isStyleLoaded = true;
      this.reapplyAllLayers();
    });
  }
  
  getMap(): maplibregl.Map | null {
    return this.map;
  }
  
  setMapStrategy(strategy: MapStrategy): void {
    this.mapStrategy = strategy;
    
    if (this.map) {
      // Capture current camera position
      const center = this.map.getCenter();
      const zoom = this.map.getZoom();
      const pitch = this.map.getPitch();
      const bearing = this.map.getBearing();
      
      // Update style
      this.isStyleLoaded = false;
      const newStyle = strategy.getStyleSpec();
      
      this.map.once('style.load', () => {
        if (!this.map) return;
        
        this.isStyleLoaded = true;
        strategy.configureMap(this.map);
        
        // Restore view
        this.map.setCenter(center);
        this.map.setZoom(zoom);
        this.map.setPitch(pitch);
        this.map.setBearing(bearing);
        
        // Apply layers
        this.applyLayers();
      });
      
      this.map.setStyle(newStyle);
    }
  }
  
  addLayer(layer: LayerStrategy): void {
    if (!layer.isCompatibleWith(this.mapStrategy)) {
      console.warn(`Layer ${layer.getId()} is not compatible with current map strategy`);
      return;
    }
    
    this.activeLayers[layer.getId()] = layer;
    
    if (this.map && this.isStyleLoaded) {
      layer.apply(this.map, this.mapStrategy);
    }
  }
  
  removeLayer(layerId: string): void {
    const layer = this.activeLayers[layerId];
    if (layer && this.map) {
      layer.remove(this.map);
    }
    delete this.activeLayers[layerId];
  }
  
  clearLayers(): void {
    if (this.map) {
      for (const layerId in this.activeLayers) {
        this.activeLayers[layerId].remove(this.map);
      }
    }
    this.activeLayers = {};
  }
  
  private applyLayers(): void {
    if (!this.map) return;
    
    // Apply all active layers
    for (const layerId in this.activeLayers) {
      const layer = this.activeLayers[layerId];
      if (layer.isCompatibleWith(this.mapStrategy)) {
        layer.apply(this.map, this.mapStrategy);
      }
    }
  }
  
  private reapplyAllLayers(): void {
    if (!this.map) return;
    
    // Apply all active layers
    for (const layerId in this.activeLayers) {
      const layer = this.activeLayers[layerId];
      if (layer.isCompatibleWith(this.mapStrategy)) {
        layer.apply(this.map, this.mapStrategy);
      }
    }
  }
} 