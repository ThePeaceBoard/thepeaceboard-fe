import { NextRequest, NextResponse } from 'next/server';

// This would be replaced with actual database fetching in a production app
// For now, we'll use some sample data
const samplePeaceData: Record<string, { 
  signedCount: number, 
  population: number,
  signedPercentage: number 
}> = {
  'United States': {
    signedCount: 3450000,
    population: 331900000,
    signedPercentage: 1.04
  },
  'Germany': {
    signedCount: 2300000,
    population: 83200000,
    signedPercentage: 2.76
  },
  'France': {
    signedCount: 1800000,
    population: 67750000,
    signedPercentage: 2.66
  },
  'United Kingdom': {
    signedCount: 1500000,
    population: 67220000,
    signedPercentage: 2.23
  },
  'Switzerland': {
    signedCount: 320000,
    population: 8670000,
    signedPercentage: 3.69
  },
  'Canada': {
    signedCount: 1100000,
    population: 38250000,
    signedPercentage: 2.88
  },
  'Australia': {
    signedCount: 780000,
    population: 25690000,
    signedPercentage: 3.04
  },
  'Japan': {
    signedCount: 2200000,
    population: 125800000,
    signedPercentage: 1.75
  },
  'Brazil': {
    signedCount: 1900000,
    population: 213990000,
    signedPercentage: 0.89
  },
  'India': {
    signedCount: 5400000,
    population: 1380000000,
    signedPercentage: 0.39
  },
  'China': {
    signedCount: 4800000,
    population: 1402000000,
    signedPercentage: 0.34
  },
  'South Korea': {
    signedCount: 980000,
    population: 51780000,
    signedPercentage: 1.89
  },
  'Italy': {
    signedCount: 1300000,
    population: 60360000,
    signedPercentage: 2.15
  },
  'Spain': {
    signedCount: 1050000,
    population: 47350000,
    signedPercentage: 2.22
  }
};

// Function to generate random peace data for any country not in our sample data
function generateRandomPeaceData(countryName: string) {
  // Generate a random but believable percentage between 0.1% and 5%
  const signedPercentage = Math.random() * 4.9 + 0.1;
  
  // Estimate a population between 1 million and 100 million
  const population = Math.floor(Math.random() * 99000000) + 1000000;
  
  // Calculate the signed count based on the percentage
  const signedCount = Math.floor(population * (signedPercentage / 100));
  
  return {
    signedCount,
    population,
    signedPercentage
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: { country: string } }
) {
  // Decode the country name from the URL
  const countryName = decodeURIComponent(params.country);
  
  // Check if we have data for this country
  const countryData = samplePeaceData[countryName] || generateRandomPeaceData(countryName);
  
  // Simulate a small delay like a real API would have
  await new Promise(resolve => setTimeout(resolve, 50));
  
  // Return the data
  return NextResponse.json(countryData);
} 