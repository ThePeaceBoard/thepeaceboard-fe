'use client';
import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import '../../../public/lib/maplibre-gl/dist/maplibre-gl.css';
import maplibreglDev from '../../../public/lib/maplibre-gl/dist/maplibre-gl-dev';
import { useMapController } from '../hooks/useMapController';
import { MercatorMapStrategy } from '../strategies/MapStrategies';
import { HeatmapLayerStrategy } from '../strategies/LayerStrategies';
import { getMapStyle } from '../utils/mapStyles';
import { 
  createPeaceTransformFunction, 
  registerFeaturePropertiesTransform, 
  directRegisterTransform, 
  patchMapLibreWorker,
  loadTransformViaScriptTag,
  loadStandaloneTransformScript,
  loadSynchronousTransform
} from '../utils/mapHelpers';
import sampleHeatData from '../data/sampleHeatData.json';
import { FeatureCollection } from 'geojson';
import { getUserLocationFromIp, areValidCoordinates, testGeolocation } from '../utils/geolocation';

// Custom CSS to hide attribution
const mapStyles = {
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    overflow: 'hidden'
  },
  attribution: `
    .maplibregl-ctrl-attrib { display: none; }
    .map-container { 
      width: 100% !important;
      max-width: 100% !important;
      box-sizing: border-box !important;
    }
    ::-webkit-scrollbar {
      display: none;
    }
    * {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  `,
  controls: {
    position: 'absolute' as const,
    top: '10px',
    right: '10px',
    zIndex: 10,
    background: 'white',
    padding: '5px',
    borderRadius: '4px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '5px'
  },
  controlGroup: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '5px'
  },
  button: {
    padding: '8px 12px',
    margin: '0',
    background: '#4285F4',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold' as const,
    fontSize: '14px',
    flex: '1'
  },
  smallButton: {
    padding: '5px 10px',
    background: '#4285F4',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold' as const,
    fontSize: '14px',
    width: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
};

export interface LayeredMapProps {
  activeMap?: 'heat' | 'peace';
  center?: [number, number];
  zoom?: number;
  showControls?: boolean;
  enablePan?: boolean;
  enableZoom?: boolean;
  trackUserLocation?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const LayeredMap: React.FC<LayeredMapProps> = ({
  activeMap = 'heat',
  center,
  zoom,
  showControls = true,
  enablePan = true,
  enableZoom = true,
  trackUserLocation = false,
  className = '',
  style = {},
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const userLocationRef = useRef<[number, number] | null>(null);
  const savedCenter = useRef<[number, number] | null>(null);
  const mapInitializedRef = useRef<boolean>(false);
  const heatmapInitializedRef = useRef<boolean>(false);
  const peacemapInitializedRef = useRef<boolean>(false);
  const [currentActiveMap, setCurrentActiveMap] = useState<'heat' | 'peace'>(activeMap);
  const [isLoadingLocation, setIsLoadingLocation] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [currentCoords, setCurrentCoords] = useState<[number, number] | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const [isProgrammaticZoom, setIsProgrammaticZoom] = useState(false);
  const [isSavingPosition, setIsSavingPosition] = useState(false);
  const [isMapStyleLoaded, setIsMapStyleLoaded] = useState<boolean>(false);
  
  // Create the strategy objects using useMemo to prevent unnecessary recreations
  const strategies = useMemo(() => ({
    heat: new MercatorMapStrategy(getMapStyle('mercator', 'heat')),
    peace: new MercatorMapStrategy(getMapStyle('mercator', 'peace'))
  }), []);
  
  // Initialize with the appropriate strategy
  const initialStrategy = useMemo(() => 
    strategies[activeMap],
    [activeMap, strategies]
  );
  
  // Use the map controller hook
  const {
    initializeMap,
    setStrategy, 
    addLayer, 
    clearLayers,
    getController
  } = useMapController(initialStrategy);
  
  // Function to fetch user location - extracted to be called from multiple places
  const fetchUserLocation = useCallback(async () => {
    try {
      setIsLoadingLocation(true);
      setLocationError(null);
      setDebugInfo(null);
      console.log('🌍 LOCATION: Fetching user location from IP...');
      
      const coordinates = await getUserLocationFromIp();
      console.log('🌍 LOCATION: Received coordinates:', coordinates);
      
      // Show debug info
      setDebugInfo(`Raw coords: ${JSON.stringify(coordinates)}`);
      
      if (areValidCoordinates(coordinates)) {
        console.log('🌍 LOCATION: Coordinates are valid:', coordinates);
        userLocationRef.current = coordinates;
        setCurrentCoords(coordinates);
        return coordinates;
      } else {
        const errorMsg = `Invalid coordinates received: ${JSON.stringify(coordinates)}`;
        console.error('🌍 LOCATION ERROR:', errorMsg);
        setLocationError(errorMsg);
        return null;
      }
    } catch (error) {
      console.error('🌍 LOCATION ERROR:', error);
      setLocationError(`Geolocation failed: ${error instanceof Error ? error.message : String(error)}`);
      return null;
    } finally {
      setIsLoadingLocation(false);
    }
  }, []);
  
  // Function to center map on coordinates
  const centerMapOnCoordinates = useCallback((coordinates: [number, number]): Promise<boolean> => {
    return new Promise((resolve) => {
      const controller = getController();
      const map = controller?.getMap();
      
      if (map && areValidCoordinates(coordinates)) {
        console.log(`🌍 LOCATION: Centering map on [${coordinates[0].toFixed(4)}, ${coordinates[1].toFixed(4)}]`);
        
        try {
          map.flyTo({
            center: coordinates,
            zoom: 5,
            duration: 2000,
            pitch: 0,
            essential: true
          });
          
          // Wait for the movement to finish
          map.once('moveend', () => {
            setCurrentCoords(coordinates);
            setDebugInfo(`Map centered on [${coordinates[0].toFixed(4)}, ${coordinates[1].toFixed(4)}]`);
            resolve(true);
          });
        } catch (error) {
          console.error('🌍 LOCATION ERROR: Error centering map:', error);
          setLocationError(`Map centering failed: ${error instanceof Error ? error.message : String(error)}`);
          resolve(false);
        }
      } else {
        console.error('🌍 LOCATION ERROR: Invalid coordinates or map not available:', coordinates);
        setLocationError('Cannot center map: Invalid coordinates or map not ready');
        resolve(false);
      }
    });
  }, [getController, setDebugInfo, setLocationError]);
  
  // Load saved center from localStorage - only once on mount
  useEffect(() => {
    try {
      const zoom = parseFloat(localStorage.getItem('zoom') || '');
      const lat = parseFloat(localStorage.getItem('lat') || '');
      const lng = parseFloat(localStorage.getItem('lng') || '');
      
      // Check if coordinates are valid (not 0,0)
      if (isFinite(zoom) && isFinite(lat) && isFinite(lng)) {
        if (lng === 0 && lat === 0) {
          // Clear invalid coordinates from localStorage
          console.log('🌍 LOCATION: Found null island coordinates [0,0] in localStorage, clearing them');
          localStorage.removeItem('lat');
          localStorage.removeItem('lng');
          localStorage.removeItem('zoom');
          savedCenter.current = null;
        } else {
          savedCenter.current = [lng, lat];
          console.log('🌍 LOCATION: Loaded saved position:', [lng, lat]);
        }
      }
    } catch (error) {
      console.error('Error loading saved position:', error);
    }
  }, []);
  
  // New function to create and register the feature properties transform
  const setupFeaturePropertiesTransform = useCallback(async () => {
    const controller = getController();
    const mapInstance = controller?.getMap();
    
    if (!mapInstance) {
      console.log('Map instance not available for feature properties transform');
      return;
    }
    
    // Ensure the map is fully loaded before registering the transform
    if (!mapInstance.isStyleLoaded()) {
      console.log('Map style not loaded yet, waiting for style.load event');
      mapInstance.once('style.load', () => {
        setTimeout(() => registerTransform(mapInstance), 500); // Small delay to ensure map is fully initialized
      });
    } else {
      // Map is already loaded, register immediately with a small delay
      setTimeout(() => registerTransform(mapInstance), 200);
    }
    
    async function registerTransform(mapInstance: any) {
      try {
        console.log('Setting up feature properties transform for peace signatures');
        
        // Try the synchronous transform first - this is the most reliable method
        console.log('Using synchronous transform approach (confirmed working)');
        const syncResult = await loadSynchronousTransform();
        
        if (syncResult) {
          console.log('Synchronous transform loaded successfully');
          return;
        }
        
        // If synchronous transform fails, try the other methods as fallbacks
        console.log('Synchronous transform failed, trying alternatives...');
        
        // Get the current origin for absolute URLs
        const baseUrl = window.location.origin;
        
        // Create the transform function
        const transformCode = createPeaceTransformFunction(baseUrl);
        
        // Try each method in sequence, stopping when one succeeds
        
        // 1. Try direct registration method 
        console.log('Trying direct registration method...');
        const directResult = directRegisterTransform(transformCode);
        
        if (directResult) {
          console.log('Feature properties transform registered successfully via direct method');
          return;
        }
        
        // 2. Try loading via script tag, which works with some MapLibre builds
        console.log('Trying script tag approach...');
        const scriptResult = await loadTransformViaScriptTag(baseUrl);
        
        if (scriptResult) {
          console.log('Feature properties transform potentially loaded via script tag');
          return;
        }
        
        // 3. Try patching the worker directly
        console.log('Trying worker patching approach...');
        const patchResult = patchMapLibreWorker(mapInstance, transformCode);
        
        if (patchResult) {
          console.log('Worker patching attempted, monitor console for results');
          return;
        }
        
        // 4. Try fallback approach as last resort
        console.log('Trying fallback registration approach...');
        const fallbackResult = registerFeaturePropertiesTransform(transformCode);
        
        if (fallbackResult) {
          console.log('Feature properties transform registered with fallback approach');
          return;
        }
        
        // If we got here, all methods failed
        console.error('All attempts to register feature properties transform failed');
        
      } catch (error) {
        console.error('Error setting up feature properties transform:', error);
      }
    }
    
    // Helper function to find a property anywhere in an object
    function findPropertyPath(obj: any, propToFind: string, path: string = '', maxDepth: number = 3, results: string[] = []): string[] {
      if (!obj || typeof obj !== 'object' || maxDepth <= 0) return results;
      
      for (const prop in obj) {
        try {
          if (prop === propToFind) {
            results.push(path ? `${path}.${prop}` : prop);
          }
          
          if (typeof obj[prop] === 'object' && obj[prop] !== null) {
            findPropertyPath(obj[prop], propToFind, path ? `${path}.${prop}` : prop, maxDepth - 1, results);
          }
        } catch (e) {
          // Skip properties that can't be accessed
        }
      }
      
      return results;
    }
  }, [getController]);
  
  // Initialize map when container is ready - only once
  useEffect(() => {
    if (mapContainer.current && !mapInitializedRef.current) {
      try {
        initializeMap(mapContainer.current);
        mapInitializedRef.current = true;
        
        // Setup feature properties transform after map initialization
        setupFeaturePropertiesTransform();
        
        const controller = getController();
        const map = controller?.getMap();
        
        if (map) {
          // Listen for style.load event to track when the map style is fully loaded
          map.once('load', () => {
            console.log('🔥 Map style fully loaded');
            setIsMapStyleLoaded(true);
            setDebugInfo('Map loaded. Initializing location...');
            
            // Fetch location from IP API
            console.log('🌍 LOCATION: Fetching location from IP API...');
            fetchUserLocation().then(coordinates => {
              if (coordinates) {
                setIsProgrammaticZoom(true);
                map.flyTo({
                  center: coordinates,
                  zoom: 4.5,
                  duration: 2000,
                  essential: true
                });

                map.once('moveend', () => {
                  setIsProgrammaticZoom(false);
                });
              }
            });
          });
          
          // Remove the automatic zoom adjustment on moveend
          map.on('moveend', () => {
            const center = map.getCenter();
            setCurrentCoords([center.lng, center.lat]);
          });
        } else {
          setLocationError('Failed to initialize map controller');
        }
      } catch (error) {
        console.error('Error initializing map:', error);
        setLocationError(`Map initialization failed: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }, [initializeMap, getController, center, zoom, fetchUserLocation, centerMapOnCoordinates, setDebugInfo, setLocationError, isProgrammaticZoom, isSavingPosition, setupFeaturePropertiesTransform]);
  
  // Create a more realistic heatmap data generator with proper magnitude values
  const generateInitialHeatmapData = (): FeatureCollection => {
    // Define major world regions as centers for heat clusters
    const MAJOR_REGIONS = [
      { name: 'North America', lat: 40, lng: -100, magnitude: 5.5, count: 100 },
      { name: 'South America', lat: -20, lng: -60, magnitude: 4.8, count: 80 },
      { name: 'Europe', lat: 50, lng: 10, magnitude: 5.8, count: 120 },
      { name: 'Africa', lat: 0, lng: 20, magnitude: 4.6, count: 90 },
      { name: 'Middle East', lat: 25, lng: 45, magnitude: 5.2, count: 100 },
      { name: 'South Asia', lat: 20, lng: 80, magnitude: 6.0, count: 140 },
      { name: 'East Asia', lat: 35, lng: 115, magnitude: 5.7, count: 120 },
      { name: 'Southeast Asia', lat: 10, lng: 105, magnitude: 5.3, count: 110 },
      { name: 'Australia', lat: -25, lng: 135, magnitude: 4.5, count: 80 },
    ];
    
    // Function to generate random number in range
    const randomInRange = (min: number, max: number): number => {
      return Math.random() * (max - min) + min;
    };
    
    // Create features array
    const features: Array<any> = [];
    
    // Generate clusters around major regions
    MAJOR_REGIONS.forEach(region => {
      for (let i = 0; i < region.count; i++) {
        // Random offset from region center
        const latOffset = randomInRange(-8, 8);
        const lngOffset = randomInRange(-8, 8);
        
        // Distance-based magnitude falloff with some randomness
        const distance = Math.sqrt(latOffset * latOffset + lngOffset * lngOffset);
        const magnitudeFalloff = Math.max(0, 1 - (distance / 20));
        const magnitudeVariation = randomInRange(-0.5, 0.5);
        const magnitude = Math.max(1, Math.min(6, region.magnitude * magnitudeFalloff + magnitudeVariation));
        
        // Create the feature with proper GeoJSON format and required 'mag' property
        features.push({
          type: 'Feature',
          properties: {
            mag: magnitude,
            place: region.name,
            time: Date.now() - Math.floor(randomInRange(0, 86400000 * 7)),
            title: `${region.name} Event ${i + 1}`,
            id: `${region.name.toLowerCase().replace(/\s+/g, '-')}-${i}` // Stable ID
          },
          geometry: {
            type: 'Point',
            coordinates: [
              region.lng + lngOffset,
              region.lat + latOffset
            ]
          }
        });
      }
    });
    
    // Add some random global points
    for (let i = 0; i < 200; i++) {
      const lat = randomInRange(-80, 80);
      const lng = randomInRange(-180, 180);
      const magnitude = randomInRange(2.5, 4.0); // Higher magnitude for better visibility
      
      features.push({
        type: 'Feature',
        properties: {
          mag: magnitude,
          place: 'Random Location',
          time: Date.now() - Math.floor(randomInRange(0, 86400000 * 7)),
          title: `Random Event ${i + 1}`,
          id: `random-${i}` // Stable ID
        },
        geometry: {
          type: 'Point',
          coordinates: [lng, lat]
        }
      });
    }
    
    // Return properly formatted FeatureCollection
    return {
      type: 'FeatureCollection',
      features: features
    };
  };

  // Keep a reference to the initial data
  const initialHeatmapData = useMemo(() => generateInitialHeatmapData(), []);

  // Function to generate additional points to add to existing data
  const generateAdditionalHeatPoints = (count: number = 20): Array<any> => {
    // Function to generate random number in range
    const randomInRange = (min: number, max: number): number => {
      return Math.random() * (max - min) + min;
    };
    
    // Define hotspots with higher probabilities - use the same locations consistently
    const hotspots = [
      { lat: 40, lng: -100, weight: 20, name: "North America" }, // North America
      { lat: 50, lng: 10, weight: 25, name: "Europe" },   // Europe
      { lat: 20, lng: 80, weight: 30, name: "South Asia" },   // South Asia
      { lat: 35, lng: 115, weight: 25, name: "East Asia" },  // East Asia
    ];
    
    const totalWeight = hotspots.reduce((sum, spot) => sum + spot.weight, 0);
    const features: Array<any> = [];
    
    // Set a seed for this batch of points to ensure points in the same batch
    // are related to each other (near one another)
    const batchTimestamp = Date.now();
    const batchSeed = Math.floor(Math.random() * 1000000);
    
    for (let i = 0; i < count; i++) {
      let lat, lng, place;
      
      // 90% chance to add to a hotspot, 10% chance for random location
      if (Math.random() < 0.9) {
        // Select a hotspot based on weights
        const random = Math.random() * totalWeight;
        let weightSum = 0;
        let selectedSpot = hotspots[0];
        
        for (const spot of hotspots) {
          weightSum += spot.weight;
          if (random <= weightSum) {
            selectedSpot = spot;
            break;
          }
        }
        
        // Smaller spread to keep points more clustered
        const spread = 5; 
        lat = selectedSpot.lat + randomInRange(-spread, spread);
        lng = selectedSpot.lng + randomInRange(-spread, spread);
        place = selectedSpot.name;
      } else {
        // Generate a completely random global point
        lat = randomInRange(-80, 80);
        lng = randomInRange(-180, 180);
        place = "Random Location";
      }
      
      // Ensure valid coordinates
      lat = Math.max(-85, Math.min(85, lat));
      lng = ((lng + 180) % 360) - 180;
      
      // Generate a magnitude between 3.5 and 6.0 for better visibility
      // Higher probability of lower magnitudes (more realistic)
      let magnitude;
      const magRoll = Math.random();
      if (magRoll < 0.7) {
        // 70% chance for lower magnitude (3.5-4.5)
        magnitude = randomInRange(3.5, 4.5);
      } else if (magRoll < 0.9) {
        // 20% chance for medium magnitude (4.5-5.5)
        magnitude = randomInRange(4.5, 5.5);
      } else {
        // 10% chance for high magnitude (5.5-6.5)
        magnitude = randomInRange(5.5, 6.5);
      }
      
      features.push({
        type: 'Feature',
        properties: {
          mag: magnitude,
          place: place,
          time: batchTimestamp,
          title: `Live Event ${batchTimestamp}`,
          id: `live-${batchTimestamp}-${batchSeed}-${i}` // Consistent batch ID pattern
        },
        geometry: {
          type: 'Point',
          coordinates: [lng, lat]
        }
      });
    }
    
    return features;
  };

  // Use the initial data for the heatmap layer
  const heatmapLayer = useMemo(() => 
    new HeatmapLayerStrategy(
      'earthquakes-heat',
      'earthquakes',
      initialHeatmapData
    ),
    [initialHeatmapData]
  );
  
  // Only add heatmap layer once when the map style is loaded and activeMap is 'heat'
  useEffect(() => {
    // Skip if map style not loaded or heatmap already initialized
    if (!isMapStyleLoaded || heatmapInitializedRef.current || activeMap !== 'heat') return;
    
    console.log('🔥 Initializing heatmap layer (ONE TIME ONLY)');
    heatmapInitializedRef.current = true;
    
    clearLayers();
    addLayer(heatmapLayer);
    
    // Get the map instance
    const controller = getController();
    const mapInstance = controller?.getMap();
    
    // Force refresh data after adding layer - just once
    if (mapInstance) {
      console.log('🔥 Adding initial heatmap data points');
      
      // Short delay to ensure layer is added
      setTimeout(() => {
        try {
          // Add just a few points initially for better performance
          const newPoints = generateAdditionalHeatPoints(10);
          heatmapLayer.updateData(mapInstance, newPoints);
          
          // Update debug info if enabled
          if (debugInfo !== null) {
            try {
              const source = mapInstance.getSource('earthquakes');
              const totalPoints = source ? 
                (source as any)._data?.features.length || 0 : 
                'unknown';
                
              setDebugInfo(
                `Heatmap initialized with ${totalPoints} points`
              );
            } catch (error) {
              console.error('Error getting source data:', error);
              setDebugInfo(
                `Heatmap initialized`
              );
            }
          }
        } catch (error) {
          console.error('Error initializing heatmap data:', error);
        }
      }, 500);
    }
  }, [isMapStyleLoaded, activeMap, addLayer, clearLayers, heatmapLayer, getController, debugInfo, setDebugInfo]);

  // Add a more robust heat map reset function
  const resetAndInitializeHeatmap = useCallback((force = false) => {
    console.log('🔥 Explicitly resetting and reinitializing heat map');
    const controller = getController();
    const mapInstance = controller?.getMap();
    
    if (!mapInstance) {
      console.log('🔥 Map instance not available, cannot reset heatmap');
      return;
    }
    
    // Reset state
    heatmapInitializedRef.current = false;
    
    // Clear existing layers directly using both approaches for redundancy
    try {
      // First clear through controller
      clearLayers();
      
      // Then manually remove any potential heat layers directly
      const heatLayerIds = [
        'earthquakes-heat', 
        'earthquakes-heat-point', 
        'earthquakes-heat-country-labels',
        'earthquakes-heat-country-labels-bg'
      ];
      
      heatLayerIds.forEach(id => {
        if (mapInstance.getLayer(id)) {
          mapInstance.removeLayer(id);
        }
      });
      
      if (mapInstance.getSource('earthquakes')) {
        mapInstance.removeSource('earthquakes');
      }
      
      console.log('🔥 Cleared all heat map layers');
    } catch (err) {
      console.error('🔥 Error clearing heat map layers:', err);
    }
    
    // Wait to ensure everything is cleared
    setTimeout(() => {
      // Then initialize the heat map layer with a clean slate
      try {
        if (mapInstance.isStyleLoaded()) {
          console.log('🔥 Adding heat map layer after reset');
          
          // Re-create the layer with fresh data to be safe
          const freshHeatmapLayer = new HeatmapLayerStrategy(
            'earthquakes-heat',
            'earthquakes',
            initialHeatmapData
          );
          
          // Apply the layer
          addLayer(freshHeatmapLayer);
          
          // Add some initial points
          console.log('🔥 Adding initial points after reset');
          setTimeout(() => {
            try {
              const newPoints = generateAdditionalHeatPoints(10);
              freshHeatmapLayer.updateData(mapInstance, newPoints);
              heatmapInitializedRef.current = true;
            } catch (err) {
              console.error('🔥 Error adding points after reset:', err);
            }
          }, 100);
        } else {
          console.log('🔥 Map style not loaded, cannot add heat layer');
        }
      } catch (err) {
        console.error('🔥 Error reinitializing heat map:', err);
      }
    }, 100);
  }, [getController, clearLayers, addLayer, initialHeatmapData]);

  // Add a similar reset and initialize function for peace map
  const resetAndInitializePeaceMap = useCallback(() => {
    console.log('🕊️ Explicitly resetting and reinitializing peace map');
    const controller = getController();
    const mapInstance = controller?.getMap();
    
    if (!mapInstance) {
      console.log('🕊️ Map instance not available, cannot reset peace map');
      return;
    }
    
    // Reset state
    peacemapInitializedRef.current = false;
    
    // Use the synchronous transform approach which is known to work
    // This is loaded before initializing peace map layers
    loadSynchronousTransform().then(success => {
      if (success) {
        console.log('🕊️ Synchronous transform loaded successfully');
      } else {
        console.warn('🕊️ Synchronous transform failed, attempting fallback');
        // As a fallback, try the original setup
        setupFeaturePropertiesTransform();
      }
      
      // Continue with peace map initialization regardless of transform result
      initializePeaceLayers();
    });
    
    function initializePeaceLayers() {
      // Since we're coloring countries at the raster level, we need to make sure
      // we're properly applying style changes to the base map style
      try {
        // First clear through controller to remove any overlays 
        clearLayers();
        
        // Also manually remove any potential peace layers directly for extra safety
        const peaceLayerIds = [
          'country-fill', 'country-border', 'country-label', 'country-label-bg',
          'country-labels', 'peace-countries-fill', 'peace-countries-border', 'peace-countries-label',
          'city-points', 'city-labels'
        ];
        
        peaceLayerIds.forEach(id => {
          if (mapInstance.getLayer(id)) {
            console.log(`🕊️ Removing layer: ${id}`);
            mapInstance.removeLayer(id);
          }
        });
        
        // Remove any potential peace sources
        const peaceSourceIds = [
          'peace-countries', 'peace-cities'
        ];
        
        peaceSourceIds.forEach(id => {
          if (mapInstance.getSource(id)) {
            console.log(`🕊️ Removing source: ${id}`);
            mapInstance.removeSource(id);
          }
        });
        
        console.log('🕊️ Cleared all peace map layers');
        
        // Here's the key change - we need to make sure the countries-fill layer is visible
        // so our peace coloring will show up
        if (mapInstance.getLayer('countries-fill')) {
          mapInstance.setLayoutProperty('countries-fill', 'visibility', 'visible');
          console.log('🕊️ Ensured countries-fill layer is visible');
        }
      } catch (err) {
        console.error('🕊️ Error clearing peace map layers:', err);
      }
      
      // Wait to ensure everything is cleared before adding peace layers
      setTimeout(() => {
        try {
          if (mapInstance && mapInstance.isStyleLoaded()) {
            console.log('🕊️ Adding peace visualization layers');
            // Use the imported function from useMapLayers to add peace layers
            import('../utils/peaceNumbersMap').then(module => {
              const { addPeaceVisualization } = module;
              
              try {
                // Use sample data if no real data is available
                import('../data/samplePeaceData').then((sampleData) => {
                  const countryData = sampleData.default || {};
                  
                  // Add the peace visualization
                  addPeaceVisualization(mapInstance, countryData as any, null);
                  
                  // Mark peace map as initialized
                  peacemapInitializedRef.current = true;
                }).catch(err => {
                  console.error('🕊️ Error loading sample peace data:', err);
                });
              } catch (err) {
                console.error('🕊️ Error initializing peace visualization:', err);
              }
            }).catch(err => {
              console.error('🕊️ Error importing peace visualization module:', err);
            });
          } else {
            console.warn('🕊️ Map style not loaded, cannot add peace layers');
          }
        } catch (err) {
          console.error('🕊️ Error in peace initialization:', err);
        }
      }, 300);
    }
  }, [getController, clearLayers, setupFeaturePropertiesTransform]);

  // Handle map type changes
  useEffect(() => {
    // Only update if something actually changed
    if (activeMap !== currentActiveMap) {
      console.log('🌍 Map type changing:', { from: currentActiveMap, to: activeMap });
      
      // Get map state before changes
      const controller = getController();
      const mapInstance = controller?.getMap();
      
      // Update state
      setCurrentActiveMap(activeMap);
      
      // Set the new strategy
      const newStrategy = strategies[activeMap];
      setStrategy(newStrategy);
      
      // Reset layers when switching map types
      if (activeMap === 'heat') {
        resetAndInitializeHeatmap();
      } else if (activeMap === 'peace') {
        resetAndInitializePeaceMap();
      }
    }
  }, [activeMap, currentActiveMap, setStrategy, strategies, getController, resetAndInitializeHeatmap, resetAndInitializePeaceMap]);

  // Add effect to calculate and set scrollbar width
  useEffect(() => {
    const calculateScrollbarWidth = () => {
      const outer = document.createElement('div');
      outer.style.visibility = 'hidden';
      outer.style.overflow = 'scroll';
      document.body.appendChild(outer);

      const inner = document.createElement('div');
      outer.appendChild(inner);

      const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
      document.body.removeChild(outer);

      document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
    };

    calculateScrollbarWidth();
    window.addEventListener('resize', calculateScrollbarWidth);
    return () => window.removeEventListener('resize', calculateScrollbarWidth);
  }, []);

  // Set up periodic refresh of heatmap data - ONLY if heatmap is initialized
  useEffect(() => {
    // Skip if heatmap not initialized
    if (!heatmapInitializedRef.current || activeMap !== 'heat') return;
    
    // Get the map instance from the controller
    const controller = getController();
    const mapInstance = controller?.getMap();
    
    // Skip if no map is available
    if (!mapInstance) return;
    
    console.log('🔥 Setting up periodic heatmap data refresh');
    
    // Keep track of accumulated points between updates
    let bufferedPoints: Array<any> = [];
    
    // Function to collect points for buffered update
    const collectPoints = () => {
      // Generate a smaller number of points but more frequently
      const newPoints = generateAdditionalHeatPoints(5); // Generate just 5 points
      bufferedPoints = [...bufferedPoints, ...newPoints];
      
      // Log the buffering
      console.log(`🔥 Buffered ${newPoints.length} new points (total buffered: ${bufferedPoints.length})`);
    };
    
    // Function to perform the actual update less frequently
    const performBufferedUpdate = () => {
      // Skip if no points are buffered
      if (bufferedPoints.length === 0) return;
      
      // Update the heatmap with all buffered points
      heatmapLayer.updateData(mapInstance, bufferedPoints);
      
      // Update debug info if enabled
      if (debugInfo !== null) {
        // Get the controller and extract the source data 
        try {
          const source = mapInstance.getSource('earthquakes');
          const totalPoints = source ? 
            (source as any)._data?.features.length || 0 : 
            'unknown';
            
          setDebugInfo(
            `Heatmap updated: added ${bufferedPoints.length} new points, total ${totalPoints}`
          );
        } catch (error) {
          console.error('Error getting source data:', error);
          setDebugInfo(
            `Heatmap updated: added ${bufferedPoints.length} new points`
          );
        }
      }
      
      // Clear the buffer after update
      bufferedPoints = [];
    };
    
    // Set up interval for point collection (every 10 seconds)
    const collectionInterval = setInterval(collectPoints, 10000);
    
    // Set up interval for actual updates (every 30 seconds)
    const updateInterval = setInterval(performBufferedUpdate, 30000);
    
    // Clean up intervals on unmount
    return () => {
      clearInterval(collectionInterval);
      clearInterval(updateInterval);
    };
  }, [heatmapInitializedRef.current, activeMap, getController, heatmapLayer, debugInfo, setDebugInfo]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: mapStyles.attribution }} />
      <div 
        ref={mapContainer} 
        className={`map-container h-dvh w-full overflow-hidden ${className}`}
        style={{ 
          ...style,
          margin: 0,
          padding: 0,
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box',
          borderRadius: '0'
        }} 
      />
    </>
  );
};

export default LayeredMap;