async function featurePropertiesTransform(source, sourceLayer, tileID, geometryType, featureID, properties) {
    if (properties === null) return;

    // We'll transform properties for country centroids
    if (sourceLayer === 'centroids' && geometryType === 'Point') {
        try {
            // Get the country name
            const countryName = properties['NAME'];
            if (!countryName) return;

            // Call our peace API endpoint
            const response = await fetch(`/api/peace/${encodeURIComponent(countryName)}`);
            
            if (response.status === 200) {
                const peaceData = await response.json();
                const peacePercentage = peaceData.percentage;
                
                // Store the peace percentage for color interpolation
                properties['peacePercentage'] = peacePercentage;
                
                // Update the label text to show only the percentage
                properties['NAME'] = `${peacePercentage}%`;

                // Store additional data for tooltips if needed
                properties['totalPopulation'] = peaceData.totalPopulation;
                properties['voteAmount'] = peaceData.voteAmount;
            } else {
                // Default to 0% if no data available
                properties['peacePercentage'] = 0;
                properties['NAME'] = '0%';
                properties['totalPopulation'] = 0;
                properties['voteAmount'] = 0;
            }
        } catch (error) {
            console.error('Error fetching peace data:', error);
            // Set default values on error
            properties['peacePercentage'] = 0;
            properties['NAME'] = '0%';
            properties['totalPopulation'] = 0;
            properties['voteAmount'] = 0;
        }
    }
}

self.setFeaturePropertiesTransform(featurePropertiesTransform); 