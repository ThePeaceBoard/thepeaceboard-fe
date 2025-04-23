async function featurePropertiesTransform(source, sourceLayer, tileID, geometryType, featureID, properties) {
    if (properties === null) return;

    // We'll transform properties for country centroids
    if (sourceLayer === 'centroids' && geometryType === 'Point') {
        try {
            // TODO: Replace with actual peace data API endpoint
            const response = await fetch(`/api/peace/${properties['NAME']}`);
            
            var name = properties['NAME'];
            if (response.status === 200) {
                const peaceData = await response.json();
                const peacePercentage = Math.round(peaceData.percentage);
                name += `\n${peacePercentage}%`;
                
                // Store the peace percentage for color interpolation
                properties['peacePercentage'] = peacePercentage;
            } else {
                // Default to 0% if no data available
                name += '\n0%';
                properties['peacePercentage'] = 0;
            }
            properties['NAME'] = name;
        } catch (error) {
            console.error('Error fetching peace data:', error);
            // Set default values on error
            properties['NAME'] = `${properties['NAME']}\n0%`;
            properties['peacePercentage'] = 0;
        }
    }
}

self.setFeaturePropertiesTransform(featurePropertiesTransform); 