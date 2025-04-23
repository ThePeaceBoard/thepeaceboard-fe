import { PeaceGeoJSON, CityPeaceGeoJSON, HeatGeoJSON } from '../types/map';

/**
 * Fetch peace data for countries and cities
 * In a real implementation, this would make API calls to your backend
 */
export const fetchPeaceData = async (): Promise<{
  countries: PeaceGeoJSON;
  cities: CityPeaceGeoJSON;
  heat: HeatGeoJSON;
}> => {
  try {
    // In a real implementation, these would be API calls
    // const countryResponse = await fetch('/api/peace-data/countries');
    // const countryData = await countryResponse.json();
    // const cityResponse = await fetch('/api/peace-data/cities');
    // const cityData = await cityResponse.json();
    // const heatResponse = await fetch('/api/peace-data/heat');
    // const heatData = await heatResponse.json();
    
    // Mock country data
    const mockCountryData: PeaceGeoJSON = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {
            country: 'United States',
            localName: 'United States of America',
            signatureCount: 150000,
            totalResidents: 330000000,
            peaceCount: 150000,
            peacePercentage: 45.5
          },
          geometry: {
            type: 'Polygon',
            coordinates: [] // Would contain actual polygon coordinates
          }
        },
        {
          type: 'Feature',
          properties: {
            country: 'Germany',
            localName: 'Deutschland',
            signatureCount: 75000,
            totalResidents: 83000000,
            peaceCount: 75000,
            peacePercentage: 90.2
          },
          geometry: {
            type: 'Polygon',
            coordinates: [] // Would contain actual polygon coordinates
          }
        },
        // More countries would be here
      ]
    };
    
    // Mock city data
    const mockCityData: CityPeaceGeoJSON = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {
            city: 'New York',
            country: 'United States',
            signatureCount: 50000,
            totalResidents: 8500000,
            peaceCount: 50000,
            peacePercentage: 58.8,
            population: 8500000
          },
          geometry: {
            type: 'Point',
            coordinates: [-74.006, 40.7128] // NYC coordinates
          }
        },
        {
          type: 'Feature',
          properties: {
            city: 'Berlin',
            localName: 'Berlin',
            country: 'Germany',
            signatureCount: 25000,
            totalResidents: 3700000,
            peaceCount: 25000,
            peacePercentage: 67.6,
            population: 3700000
          },
          geometry: {
            type: 'Point',
            coordinates: [13.405, 52.52] // Berlin coordinates
          }
        },
        {
          type: 'Feature',
          properties: {
            city: 'San Francisco',
            country: 'United States',
            signatureCount: 30000,
            totalResidents: 870000,
            peaceCount: 30000,
            peacePercentage: 34.5,
            population: 870000
          },
          geometry: {
            type: 'Point',
            coordinates: [-122.4194, 37.7749] // SF coordinates
          }
        },
        // More cities would be here
      ]
    };
    
    // Mock heat data
    const mockHeatData: HeatGeoJSON = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {
            intensity: 0.8,
            latitude: 40.7128,
            longitude: -74.006
          },
          geometry: {
            type: 'Point',
            coordinates: [-74.006, 40.7128]
          }
        },
        // More heat points would be here
      ]
    };
    
    return {
      countries: mockCountryData,
      cities: mockCityData,
      heat: mockHeatData
    };
  } catch (error) {
    console.error('Error fetching peace data:', error);
    throw new Error('Failed to fetch peace data');
  }
}; 