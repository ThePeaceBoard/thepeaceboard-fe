/**
 * Map Layer Exports
 * 
 * This file provides a clean export facade for map visualization functions.
 * Each function handles both country and city data in a unified approach.
 */

// Import the unified peace visualization function
import { addPeaceVisualization } from './peaceNumbersMap';

// Import the unified activity visualization function
import { addActivityVisualization } from './activityHeatMap';

// Export only the unified visualization functions
export { 
  addPeaceVisualization,
  addActivityVisualization
};

// Legacy exports for backward compatibility
export const addPeaceLayer = addPeaceVisualization;
export const addCityPeaceLayer = addPeaceVisualization;
export const addHeatLayer = addActivityVisualization;
