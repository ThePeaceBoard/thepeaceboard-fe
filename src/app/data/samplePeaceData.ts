/**
 * Sample peace data for testing the peace layer
 * Contains basic GeoJSON features with peace percentages
 */

import { Feature, FeatureCollection, Polygon } from 'geojson';
import { PeaceFeature } from '../types/map';

/**
 * Creates a simplified GeoJSON feature for a country that matches the PeaceFeature interface
 */
const createCountryFeature = (
  countryName: string, 
  peacePercentage: number,
  coordinates: [number, number][], // Simple polygon coordinates
  additionalProps: Record<string, any> = {}
): Feature<Polygon, PeaceFeature> => {
  // Create sample values based on the peace percentage
  const totalResidents = Math.round(1000000 + Math.random() * 9000000); // 1-10 million
  const peaceCount = Math.round(totalResidents * (peacePercentage / 100));
  const signatureCount = Math.round(peaceCount * 0.8); // 80% of peace count signed

  return {
    type: "Feature" as const,
    properties: {
      // Required PeaceFeature properties
      country: countryName,
      peacePercentage: peacePercentage,
      signatureCount: signatureCount,
      totalResidents: totalResidents,
      peaceCount: peaceCount,
      // Add any additional properties
      ...additionalProps
    },
    geometry: {
      type: "Polygon" as const,
      coordinates: [coordinates]
    }
  };
};

/**
 * Sample peace data with some countries
 */
const samplePeaceData: FeatureCollection<Polygon, PeaceFeature> = {
  type: "FeatureCollection" as const,
  features: [
    // Sample countries with varying peace percentages
    createCountryFeature(
      'United States',
      65.7,
      [
        [-125, 24], [-125, 49], [-66, 49], [-66, 24], [-125, 24]
      ],
      { iso: 'USA', region: 'North America', name: 'United States' }
    ),
    createCountryFeature(
      'Germany',
      82.5,
      [
        [5.8, 47.2], [5.8, 55.1], [15.0, 55.1], [15.0, 47.2], [5.8, 47.2]
      ],
      { iso: 'DEU', region: 'Europe', name: 'Germany' }
    ),
    createCountryFeature(
      'Japan',
      85.3,
      [
        [127.7, 31.0], [127.7, 45.5], [145.5, 45.5], [145.5, 31.0], [127.7, 31.0]
      ],
      { iso: 'JPN', region: 'Asia', name: 'Japan' }
    ),
    createCountryFeature(
      'Brazil',
      58.2,
      [
        [-73.9, -33.8], [-73.9, 5.3], [-34.8, 5.3], [-34.8, -33.8], [-73.9, -33.8]
      ],
      { iso: 'BRA', region: 'South America', name: 'Brazil' }
    ),
    createCountryFeature(
      'South Africa',
      47.5,
      [
        [16.4, -34.8], [16.4, -22.1], [32.9, -22.1], [32.9, -34.8], [16.4, -34.8]
      ],
      { iso: 'ZAF', region: 'Africa', name: 'South Africa' }
    ),
    createCountryFeature(
      'India',
      50.4,
      [
        [68.1, 8.0], [68.1, 35.5], [97.4, 35.5], [97.4, 8.0], [68.1, 8.0]
      ],
      { iso: 'IND', region: 'Asia', name: 'India' }
    ),
    createCountryFeature(
      'Australia',
      87.2,
      [
        [113.1, -43.6], [113.1, -10.5], [153.6, -10.5], [153.6, -43.6], [113.1, -43.6]
      ],
      { iso: 'AUS', region: 'Oceania', name: 'Australia' }
    ),
    createCountryFeature(
      'Russia',
      35.9,
      [
        [30.0, 50.0], [30.0, 70.0], [180.0, 70.0], [180.0, 50.0], [30.0, 50.0]
      ],
      { iso: 'RUS', region: 'Europe/Asia', name: 'Russia' }
    ),
    createCountryFeature(
      'Egypt',
      42.3,
      [
        [24.7, 22.0], [24.7, 31.6], [36.9, 31.6], [36.9, 22.0], [24.7, 22.0]
      ],
      { iso: 'EGY', region: 'Africa', name: 'Egypt' }
    ),
    createCountryFeature(
      'Canada',
      83.7,
      [
        [-140.0, 43.0], [-140.0, 70.0], [-52.6, 70.0], [-52.6, 43.0], [-140.0, 43.0]
      ],
      { iso: 'CAN', region: 'North America', name: 'Canada' }
    )
  ]
};

export default samplePeaceData; 