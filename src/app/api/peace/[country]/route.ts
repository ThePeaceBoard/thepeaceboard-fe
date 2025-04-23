import { NextResponse } from 'next/server';

// Dummy data for testing
const DUMMY_PEACE_DATA = {
  "United States": { totalPopulation: 331002651, voteAmount: 198601590 },
  "China": { totalPopulation: 1439323776, voteAmount: 575729510 },
  "India": { totalPopulation: 1380004385, voteAmount: 828002631 },
  "Russia": { totalPopulation: 145912025, voteAmount: 43773607 },
  "Brazil": { totalPopulation: 212559417, voteAmount: 148791592 },
  "Japan": { totalPopulation: 126476461, voteAmount: 113828815 },
  "Germany": { totalPopulation: 83783942, voteAmount: 71216351 },
  "United Kingdom": { totalPopulation: 67886011, voteAmount: 47520208 },
  "France": { totalPopulation: 65273511, voteAmount: 45691458 },
  "Italy": { totalPopulation: 60461826, voteAmount: 36277096 },
  // Add more countries as needed
};

// Helper function to calculate peace percentage
function calculatePeacePercentage(totalPopulation: number, voteAmount: number): number {
  return Math.min(100, Math.round((voteAmount / totalPopulation) * 100));
}

export async function GET(
  request: Request,
  { params }: { params: { country: string } }
) {
  try {
    const countryName = decodeURIComponent(params.country);
    
    // Find the country data (case-insensitive search)
    const countryData = Object.entries(DUMMY_PEACE_DATA).find(([name]) => 
      name.toLowerCase() === countryName.toLowerCase()
    );

    if (countryData) {
      const [name, data] = countryData;
      const percentage = calculatePeacePercentage(data.totalPopulation, data.voteAmount);
      
      return NextResponse.json({
        country: name,
        totalPopulation: data.totalPopulation,
        voteAmount: data.voteAmount,
        percentage
      });
    }

    // If country not found, return 0%
    return NextResponse.json({
      country: countryName,
      totalPopulation: 0,
      voteAmount: 0,
      percentage: 0
    });

  } catch (error) {
    console.error('Error processing peace data:', error);
    return NextResponse.json(
      { error: 'Failed to process peace data' },
      { status: 500 }
    );
  }
} 