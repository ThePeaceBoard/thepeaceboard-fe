/**
 * Utility functions to help with MapLibre integration
 */

import maplibreglDev from '../../../public/lib/maplibre-gl/dist/maplibre-gl-dev';
import type { Map } from 'maplibre-gl';

// Store the transform function for fallback use
let fallbackTransformFn: Function | null = null;

/**
 * Ensures the MapLibre global is available
 * @returns Whether maplibregl is available globally
 */
export const ensureMapLibreLoaded = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // Check if maplibregl is already loaded
  if (typeof (window as any).maplibregl !== 'undefined') {
    return true;
  }
  
  // Check for direct import
  if (maplibreglDev) {
    // Make the imported maplibregl available globally
    (window as any).maplibregl = maplibreglDev;
    return true;
  }
  
  console.warn('MapLibre GL JS is not loaded');
  return false;
};

/**
 * Registers a feature properties transform function with MapLibre
 * @param transformFunction The transform function to register
 * @returns A URL to the worker script or 'fallback'
 */
export const registerFeaturePropertiesTransform = (transformCode: string): string | null => {
  if (!ensureMapLibreLoaded()) return null;
  
  try {
    // Get the maplibregl global
    const maplibregl = (window as any).maplibregl;
    
    // Check if importScriptInWorkers method exists
    if (typeof maplibregl.importScriptInWorkers !== 'function') {
      console.warn('MapLibre GL JS does not support importScriptInWorkers, using fallback approach');
      
      // Extract the transform function from the code
      try {
        // Convert the string function to a real function that we can call
        const funcBody = transformCode.replace(/self\.setFeaturePropertiesTransform\(featurePropertiesTransform\);/, '');
        const asyncFuncMatch = funcBody.match(/async\s+function\s+featurePropertiesTransform\s*\([^)]*\)\s*{([\s\S]*)}/);
        
        if (asyncFuncMatch && asyncFuncMatch[1]) {
          const fnBody = asyncFuncMatch[1];
          // Create a new function from the extracted code
          fallbackTransformFn = new Function('source', 'sourceLayer', 'tileID', 'geometryType', 'featureID', 'properties', 'fetch', `
            return (async () => {
              ${fnBody}
            })();
          `);
          
          console.log('Created fallback transform function');
        } else {
          console.error('Could not extract transform function from code');
        }
      } catch (err) {
        console.error('Error creating fallback transform function:', err);
      }
      
      return 'fallback';
    }
    
    // Create blob URL for the transform function
    const blob = new Blob([transformCode], { type: 'application/javascript' });
    const workerUrl = URL.createObjectURL(blob);
    
    // Register the worker script
    maplibregl.importScriptInWorkers(workerUrl);
    
    return workerUrl;
  } catch (error) {
    console.error('Failed to register feature properties transform:', error);
    return null;
  }
};

/**
 * Apply the fallback transform to a GeoJSON source before adding it to the map
 * @param map The MapLibre map instance
 * @param sourceId The source ID
 * @param geojson The GeoJSON data
 */
export const applyFallbackTransform = async (map: Map, sourceId: string, geojson: any): Promise<any> => {
  if (!fallbackTransformFn || !geojson || !geojson.features) {
    return geojson;
  }
  
  console.log(`Applying fallback transform to source: ${sourceId}`);
  
  try {
    // Process each feature
    for (const feature of geojson.features) {
      if (feature.properties) {
        await fallbackTransformFn(
          sourceId,
          '',
          { z: 0, x: 0, y: 0 },
          feature.geometry.type,
          feature.id || 0,
          feature.properties,
          fetch
        );
      }
    }
    
    console.log(`Processed ${geojson.features.length} features with fallback transform`);
    return geojson;
  } catch (error) {
    console.error('Error applying fallback transform:', error);
    return geojson;
  }
};

/**
 * Creates a transform function that adds peace signature percentages to country labels
 * Uses a synchronous approach for maximum compatibility
 * @param baseUrl The base URL for API requests
 * @returns The transform function code as a string
 */
export const createPeaceTransformFunction = (baseUrl: string): string => {
  return `
function featurePropertiesTransform(source, sourceLayer, tileID, geometryType, featureID, properties) {
  if (properties === null) return;
  
  // Process country centroids (points)
  if ((sourceLayer === 'centroids' || sourceLayer === 'countries') && 
      'NAME' in properties && 
      geometryType === 'Point') {
    
    // Hardcoded peace percentages for common countries
    const peaceData = {
      "United States": 25,
      "Canada": 68,
      "Mexico": 42,
      "Brazil": 51,
      "Argentina": 47,
      "United Kingdom": 55,
      "France": 62,
      "Germany": 71,
      "Spain": 58,
      "Italy": 53,
      "Russia": 22,
      "China": 31,
      "Japan": 80,
      "South Korea": 65,
      "India": 45,
      "Australia": 73,
      "New Zealand": 82,
      "South Africa": 48,
      "Egypt": 38,
      "Nigeria": 42,
      "Kenya": 51,
      "Switzerland": 84,
      "Norway": 88,
      "Sweden": 86,
      "Finland": 85,
      "Denmark": 83,
      "Netherlands": 76,
      "Belgium": 72,
      "Austria": 70,
      "Portugal": 61,
      "Greece": 52,
      "Turkey": 39,
      "Saudi Arabia": 26,
      "Israel": 43,
      "Iran": 18,
      "Pakistan": 32,
      "Thailand": 57,
      "Vietnam": 53,
      "Indonesia": 49,
      "Philippines": 52
    };
    
    // Get the country name
    const name = properties['NAME'];
    
    // Use hardcoded data if available, otherwise generate a random percentage
    if (name in peaceData) {
      const percentage = peaceData[name];
      properties['NAME'] = \`\${name}\\n\${percentage}% for Peace\`;
      properties['peacePercentage'] = percentage;
    } else {
      // Generate a random percentage between 10 and 90 for countries without data
      const randomPercentage = Math.floor(Math.random() * 80) + 10;
      properties['NAME'] = \`\${name}\\n\${randomPercentage}% for Peace\`;
      properties['peacePercentage'] = randomPercentage;
    }
  }
};

self.setFeaturePropertiesTransform(featurePropertiesTransform);
  `;
};

/**
 * Creates a transform function that closely matches the example format
 * This version is for direct inclusion in a script tag
 * @param baseUrl The base URL for API requests
 * @returns The raw transform function code
 */
export const getRawTransformCode = (baseUrl: string): string => {
  return `
function featurePropertiesTransform(source, sourceLayer, tileID, geometryType, featureID, properties) {
  if (properties === null) return;

  if (sourceLayer === 'centroids' && geometryType === 'Point') {
    // Hardcoded peace percentages for common countries
    const peaceData = {
      "United States": 25,
      "Canada": 68,
      "Mexico": 42,
      "Brazil": 51,
      "Germany": 71,
      "France": 62,
      "United Kingdom": 55,
      "Italy": 53,
      "Spain": 58,
      "Switzerland": 84,
      "Russia": 22,
      "China": 31,
      "Australia": 73,
      "Japan": 80,
      "India": 45
    };
    
    var name = properties['NAME'];
    if (name in peaceData) {
      const percentage = peaceData[name];
      name += \`\\n\${percentage}% for Peace\`;
    } else {
      // Random percentage for countries without data
      const percentage = Math.floor(Math.random() * 80) + 10;
      name += \`\\n\${percentage}% for Peace\`;
    }
    properties['NAME'] = name;
  }
};

self.setFeaturePropertiesTransform(featurePropertiesTransform);
`;
};

/**
 * Directly registers a feature properties transform function with the MapLibre instance
 * This is more reliable than the importScriptInWorkers method which might not be available
 * @param transformCode The transform function code as a string
 * @returns true if registration was successful, false otherwise
 */
export const directRegisterTransform = (transformCode: string): boolean => {
  if (!ensureMapLibreLoaded()) return false;
  
  try {
    // Create blob URL for the transform function
    const blob = new Blob([transformCode], { type: 'application/javascript' });
    const workerUrl = URL.createObjectURL(blob);
    
    // First try to access the method directly from our imported module
    if (typeof maplibreglDev.importScriptInWorkers === 'function') {
      console.log('Using maplibreglDev.importScriptInWorkers method');
      maplibreglDev.importScriptInWorkers(workerUrl);
      return true;
    }
    
    // Next try to access it from the global object if available
    const globalMaplibre = (window as any).maplibregl;
    if (globalMaplibre && typeof globalMaplibre.importScriptInWorkers === 'function') {
      console.log('Using window.maplibregl.importScriptInWorkers method');
      globalMaplibre.importScriptInWorkers(workerUrl);
      return true;
    }
    
    // Last resort: check if the method might be exposed on the Map prototype
    const mapProto = maplibreglDev.Map?.prototype;
    if (mapProto && typeof mapProto.importScriptInWorkers === 'function') {
      console.log('Using Map.prototype.importScriptInWorkers method');
      mapProto.importScriptInWorkers(workerUrl);
      return true;
    }
    
    // If we get here, all attempts have failed
    console.warn('importScriptInWorkers method not found on any MapLibre instance');
    
    // Add debug to help understand what methods are available
    console.debug('maplibreglDev methods:', Object.keys(maplibreglDev));
    console.debug('window.maplibregl methods:', globalMaplibre ? Object.keys(globalMaplibre) : 'Not available');
    
    return false;
  } catch (error) {
    console.error('Failed to directly register transform:', error);
    return false;
  }
};

/**
 * Attempts to directly patch the MapLibre worker to support feature properties transform
 * This is a more direct approach when importScriptInWorkers is not available
 * @param map The MapLibre map instance
 * @param transformCode The transform function code as a string
 * @returns true if patching was successful, false otherwise
 */
export const patchMapLibreWorker = (map: Map, transformCode: string): boolean => {
  try {
    console.log('Attempting to directly patch MapLibre worker');
    
    // Access internal properties (this is risky but sometimes necessary)
    const mapAny = map as any;
    
    // Try to find the worker pool or individual workers
    let workerPool = null;
    
    // Check common internal property names where worker might be stored
    if (mapAny._workerPool) {
      console.log('Found _workerPool property');
      workerPool = mapAny._workerPool;
    } else if (mapAny.style && mapAny.style.dispatcher && mapAny.style.dispatcher._workerPool) {
      console.log('Found style.dispatcher._workerPool property');
      workerPool = mapAny.style.dispatcher._workerPool;
    } else if (mapAny.painter && mapAny.painter._workerPool) {
      console.log('Found painter._workerPool property');
      workerPool = mapAny.painter._workerPool;
    }
    
    if (!workerPool) {
      console.warn('Could not find worker pool in map instance');
      return false;
    }
    
    // Analyze the worker pool to understand how to access the workers
    console.log('Worker pool properties:', Object.keys(workerPool));
    
    // Check if there are individual workers we can access
    let workers = null;
    if (Array.isArray(workerPool.workers)) {
      console.log('Found workers array with', workerPool.workers.length, 'workers');
      workers = workerPool.workers;
    } else if (workerPool._workers && Array.isArray(workerPool._workers)) {
      console.log('Found _workers array with', workerPool._workers.length, 'workers');
      workers = workerPool._workers;
    }
    
    if (!workers || workers.length === 0) {
      console.warn('No workers found in worker pool');
      return false;
    }
    
    // Convert our transform function to a simpler format for direct injection
    const simplifiedTransform = transformCode
      .replace('async function featurePropertiesTransform', 'self.featurePropertiesTransform = async function')
      .replace('self.setFeaturePropertiesTransform(featurePropertiesTransform);', '');
    
    // Try to execute our code in each worker
    const injectCode = `
      try {
        ${simplifiedTransform}
        
        // Register the transform function with whatever interface is available
        if (typeof self.setFeaturePropertiesTransform === 'function') {
          self.setFeaturePropertiesTransform(self.featurePropertiesTransform);
          self.postMessage({ type: 'debug', message: 'Successfully registered transform function' });
        } else {
          // If setFeaturePropertiesTransform doesn't exist, we'll create it
          self.setFeaturePropertiesTransform = function(fn) {
            self._transformFn = fn;
            self.postMessage({ type: 'debug', message: 'Created custom transform registration' });
          };
          self.setFeaturePropertiesTransform(self.featurePropertiesTransform);
          
          // Check if we need to monkey patch the actual worker message handler
          // to intercept tile loading and apply our transform
          if (self.workerMessageHandler && !self._isPatched) {
            const originalOnMessage = self.workerMessageHandler;
            self.workerMessageHandler = function(e) {
              // Apply our transform if needed before passing to the original handler
              if (e.data && e.data.type === 'source data' && e.data.params && e.data.params.source) {
                // We could inject our transform here if needed
              }
              return originalOnMessage(e);
            };
            self._isPatched = true;
            self.postMessage({ type: 'debug', message: 'Patched worker message handler' });
          }
        }
      } catch (error) {
        self.postMessage({ type: 'error', message: 'Error injecting transform: ' + error.message });
      }
    `;
    
    // Attempt to inject our code into each worker
    for (let i = 0; i < workers.length; i++) {
      const worker = workers[i];
      
      if (worker.postMessage) {
        try {
          // Try to execute code directly in the worker
          if (worker.evalInWorker) {
            console.log(`Using evalInWorker on worker ${i}`);
            worker.evalInWorker(injectCode);
          } else {
            // Fallback to postMessage with a special command
            console.log(`Posting eval command to worker ${i}`);
            worker.postMessage({
              type: 'eval',
              snippet: injectCode
            });
          }
        } catch (err) {
          console.warn(`Failed to inject code into worker ${i}:`, err);
        }
      }
    }
    
    console.log('Attempted to patch', workers.length, 'workers');
    return true;
  } catch (error) {
    console.error('Error trying to patch MapLibre worker:', error);
    return false;
  }
};

/**
 * Tries to load the transform script via a script tag
 * This approach works with some builds of MapLibre that look for script tags with a specific data attribute
 * @param baseUrl The base URL for API requests
 * @returns Promise resolving to true if successful, false otherwise
 */
export const loadTransformViaScriptTag = (baseUrl: string): Promise<boolean> => {
  return new Promise((resolve) => {
    try {
      console.log('Attempting to load transform via script tag');
      
      // Create a script element
      const script = document.createElement('script');
      script.type = 'text/javascript';
      
      // Add special attributes that some MapLibre builds look for
      script.setAttribute('data-maplibre-transform', 'true');
      script.setAttribute('data-maplibre-worker', 'true');
      
      // Use the raw transform code format that exactly matches the example
      const transformCode = getRawTransformCode(baseUrl);
      
      // Set the content of the script
      script.textContent = transformCode;
      
      // Add an ID so we can reference it later if needed
      const scriptId = 'maplibre-transform-' + Date.now();
      script.id = scriptId;
      
      // Add load and error handlers
      script.onload = () => {
        console.log('Transform script loaded successfully');
        resolve(true);
      };
      
      script.onerror = () => {
        console.warn('Failed to load transform script');
        resolve(false);
      };
      
      // Add the script to the document
      document.head.appendChild(script);
      
      // Also set a timeout to resolve in case the events don't fire
      setTimeout(() => {
        if (document.getElementById(scriptId)) {
          console.log('Transform script added to DOM but load event not fired');
          resolve(true);
        } else {
          resolve(false);
        }
      }, 1000);
    } catch (error) {
      console.error('Error loading transform via script tag:', error);
      resolve(false);
    }
  });
};

/**
 * Load the standalone transform script file
 * This is a different approach that loads the pre-built transform.js file
 * @returns Promise resolving to true if successful, false otherwise
 */
export const loadStandaloneTransformScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    try {
      console.log('Loading standalone transform script');
      
      // Create a script element
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = '/app/utils/transform.js'; // Path to our transform script
      
      // Add special attributes
      script.setAttribute('data-maplibre-transform', 'true');
      
      // Add load and error handlers
      script.onload = () => {
        console.log('Standalone transform script loaded successfully');
        resolve(true);
      };
      
      script.onerror = (e) => {
        console.warn('Failed to load standalone transform script:', e);
        resolve(false);
      };
      
      // Add the script to the document
      document.head.appendChild(script);
      
      // Set a timeout as fallback
      setTimeout(() => {
        console.log('Transform script load timeout reached');
        resolve(false);
      }, 3000);
    } catch (error) {
      console.error('Error loading standalone transform script:', error);
      resolve(false);
    }
  });
};

/**
 * A simplified function to load the synchronous transform function.
 * This uses the approach that was confirmed to work in the weather example.
 * @returns Promise that resolves to true if successful
 */
export const loadSynchronousTransform = (): Promise<boolean> => {
  return new Promise((resolve) => {
    try {
      // Ensure MapLibre is loaded
      if (!ensureMapLibreLoaded()) {
        console.error('MapLibre not loaded, cannot setup transform');
        resolve(false);
        return;
      }
      
      // Get the maplibregl global
      const maplibregl = (window as any).maplibregl;
      
      if (typeof maplibregl.importScriptInWorkers !== 'function') {
        console.error('importScriptInWorkers method not available');
        resolve(false);
        return;
      }
      
      // Create the transform script - using the simplified synchronous version
      const transformScript = `
        function featurePropertiesTransform(source, sourceLayer, tileID, geometryType, featureID, properties) {
          if (properties === null) return;

          if (sourceLayer === 'centroids' && geometryType === 'Point') {
            // Hardcoded peace percentages for common countries
            const peaceData = {
              "United States": 25,
              "Canada": 68,
              "Mexico": 42,
              "Brazil": 51,
              "Germany": 71,
              "France": 62,
              "United Kingdom": 55,
              "Italy": 53,
              "Spain": 58,
              "Switzerland": 84,
              "Russia": 22,
              "China": 31,
              "Australia": 73,
              "Japan": 80,
              "India": 45
            };
            
            // Get the country name
            const name = properties['NAME'];
            
            // Add peace percentage
            if (name in peaceData) {
              const percentage = peaceData[name];
              properties['NAME'] = \`\${name}\\n\${percentage}% for Peace\`;
            } else {
              // Random percentage for countries without data
              const percentage = Math.floor(Math.random() * 80) + 10;
              properties['NAME'] = \`\${name}\\n\${percentage}% for Peace\`;
            }
          }
        };

        self.setFeaturePropertiesTransform(featurePropertiesTransform);
      `;
      
      // Create blob URL
      const blob = new Blob([transformScript], { type: 'application/javascript' });
      const url = URL.createObjectURL(blob);
      
      // Import the script in workers
      console.log('Importing synchronous transform script to workers');
      maplibregl.importScriptInWorkers(url);
      
      console.log('Synchronous transform script loaded successfully');
      resolve(true);
    } catch (error) {
      console.error('Failed to load synchronous transform:', error);
      resolve(false);
    }
  });
}; 