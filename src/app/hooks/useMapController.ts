import { useState, useCallback, useRef, useEffect } from 'react';
import { MapController } from '../controllers/MapController';
import { MapStrategy } from '../strategies/MapStrategies';
import { LayerStrategy } from '../strategies/LayerStrategies';

export function useMapController(initialStrategy: MapStrategy) {
  const [activeStrategy, setActiveStrategy] = useState<MapStrategy>(initialStrategy);
  const controllerRef = useRef<MapController | null>(null);
  
  // Initialize controller if it doesn't exist
  useEffect(() => {
    if (!controllerRef.current) {
      controllerRef.current = new MapController(initialStrategy);
    }
  }, [initialStrategy]);
  
  // Method to initialize the map with a container
  const initializeMap = useCallback((container: HTMLElement) => {
    if (controllerRef.current) {
      controllerRef.current.initialize(container);
    }
  }, []);
  
  // Method to set a new strategy
  const setStrategy = useCallback((strategy: MapStrategy) => {
    if (controllerRef.current) {
      controllerRef.current.setMapStrategy(strategy);
      setActiveStrategy(strategy);
    }
  }, []);
  
  // Method to add a layer
  const addLayer = useCallback((layer: LayerStrategy) => {
    if (controllerRef.current) {
      controllerRef.current.addLayer(layer);
    }
  }, []);
  
  // Method to remove a layer
  const removeLayer = useCallback((layerId: string) => {
    if (controllerRef.current) {
      controllerRef.current.removeLayer(layerId);
    }
  }, []);
  
  // Method to clear all layers
  const clearLayers = useCallback(() => {
    if (controllerRef.current) {
      controllerRef.current.clearLayers();
    }
  }, []);
  
  return {
    activeStrategy,
    initializeMap,
    setStrategy,
    addLayer,
    removeLayer,
    clearLayers,
    getController: () => controllerRef.current
  };
} 