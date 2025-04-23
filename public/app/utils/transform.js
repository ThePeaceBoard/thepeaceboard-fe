/**
 * Feature properties transform for peace signatures
 * This transforms country labels to include peace percentage information
 */

async function featurePropertiesTransform(source, sourceLayer, tileID, geometryType, featureID, properties) {
  if (properties === null) return;

  // Match country labels - typically in centroids or countries layer
  if ((sourceLayer === 'centroids' || sourceLayer === 'countries' || sourceLayer === '') && 
      'NAME' in properties && 
      (geometryType === 'Point' || geometryType === 'Polygon')) {
    
    try {
      // Get the country name
      const name = properties['NAME'];
      
      // Determine base URL - try to use self.location if available
      const baseUrl = self.location ? self.location.origin : 'https://thepeaceboard.org';
      
      // Fetch country peace data
      const response = await fetch(`${baseUrl}/api/peace-data/${encodeURIComponent(name)}`);
      
      if (response.status === 200) {
        const data = await response.json();
        const percentage = Math.round(data.signedPercentage || 0);
        
        // Modify the NAME property to include peace percentage
        properties['NAME'] = `${name}\n${percentage}% for Peace`;
      }
    } catch (error) {
      console.error('Error fetching peace data:', error);
    }
  }
}

// Register the transform function
if (typeof self !== 'undefined' && typeof self.setFeaturePropertiesTransform === 'function') {
  self.setFeaturePropertiesTransform(featurePropertiesTransform);
} else {
  console.warn('setFeaturePropertiesTransform not available in this environment');
} 