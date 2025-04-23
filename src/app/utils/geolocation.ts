/**
 * Geolocation utilities for determining user location from IP address
 */

// Define interface for geolocation response
interface IpGeolocationResponse {
  ip?: string;
  latitude?: number;
  longitude?: number;
  loc?: string; // ipinfo format: "lat,long"
  country_name?: string;
  city?: string;
  success?: boolean;
}

// Define the response type for ip-api.com
interface IpApiResponse {
  status: string;
  country: string;
  countryCode: string;
  region: string;
  regionName: string;
  city: string;
  lat: number;
  lon: number;
  timezone: string;
  isp: string;
  org: string;
  as: string;
  query: string;
}

// Fallback locations for common IP address ranges
const FALLBACK_LOCATIONS: Record<string, [number, number]> = {
  // AWS regions
  'us-east-1': [-77.0369, 38.9072],  // N. Virginia (Washington DC)
  'us-east-2': [-83.0007, 39.9623],  // Ohio (Columbus)
  'us-west-1': [-122.4194, 37.7749], // N. California (San Francisco)
  'us-west-2': [-122.3321, 47.6062], // Oregon (Seattle)
  'eu-west-1': [-6.2603, 53.3498],   // Ireland (Dublin)
  'eu-central-1': [8.6821, 50.1109], // Frankfurt
  'ap-northeast-1': [139.6917, 35.6895], // Tokyo
  
  // Google Cloud regions
  'us-central1': [-94.5786, 39.0997], // Iowa (Kansas City)
  'europe-west1': [2.3522, 48.8566],  // Belgium (Brussels/Paris)
  
  // Azure regions
  'eastus': [-78.6382, 35.7796],     // Virginia
  'westeurope': [4.9041, 52.3676],   // Netherlands (Amsterdam)
  
  // Cloudflare
  'cloudflare': [-122.3959, 37.7870], // San Francisco
  
  // Default fallback - New York City
  'default': [-74.006, 40.7128]
};

/**
 * Attempts to determine location from IP address patterns
 * Used as a fallback when API services fail
 * 
 * @param ip IP address string if available
 * @returns Location coordinates if pattern is recognized
 */
function getLocationFromIpPattern(ip?: string): [number, number] | null {
  if (!ip) return null;
  
  console.log('🌍 LOCATION: Analyzing IP pattern:', ip);
  
  // Check for AWS IP ranges (approximate patterns)
  if (ip.startsWith('54.') || ip.startsWith('52.') || ip.startsWith('35.') || ip.startsWith('18.')) {
    console.log('🌍 LOCATION: Detected AWS IP pattern');
    return FALLBACK_LOCATIONS['us-east-1']; // Most common AWS region
  }
  
  // Check for Google Cloud IPs
  if (ip.startsWith('34.') || ip.startsWith('35.') || ip.startsWith('104.')) {
    console.log('🌍 LOCATION: Detected Google Cloud IP pattern');
    return FALLBACK_LOCATIONS['us-central1'];
  }
  
  // Check for Azure IPs
  if (ip.startsWith('13.') || ip.startsWith('40.') || ip.startsWith('20.')) {
    console.log('🌍 LOCATION: Detected Azure IP pattern');
    return FALLBACK_LOCATIONS['eastus'];
  }
  
  // Check for Cloudflare IPs
  if (ip.startsWith('104.') || ip.startsWith('173.') || ip.includes('cloudflare')) {
    console.log('🌍 LOCATION: Detected Cloudflare IP pattern');
    return FALLBACK_LOCATIONS['cloudflare'];
  }
  
  return null;
}

/**
 * Fetches the user's approximate location based on their IP address
 * Uses multiple services for redundancy
 * 
 * @returns Promise with coordinates as [longitude, latitude]
 */
export async function getUserLocationFromIp(): Promise<[number, number] | null> {
  try {
    console.log('🌍 LOCATION: Fetching location from ip-api.com...');
    
    const response = await fetch('http://ip-api.com/json/', {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: IpApiResponse = await response.json();
    
    if (data.status === 'success' && data.lat && data.lon) {
      console.log('🌍 LOCATION: Successfully retrieved coordinates:', [data.lon, data.lat]);
      console.log('🌍 LOCATION: Location details:', {
        country: data.country,
        city: data.city,
        region: data.regionName,
        isp: data.isp
      });
      return [data.lon, data.lat];
    } else {
      console.error('🌍 LOCATION ERROR: Invalid response from ip-api.com:', data);
      return null;
    }
  } catch (error) {
    console.error('🌍 LOCATION ERROR: Failed to fetch location from ip-api.com:', error);
    return null;
  }
}

/**
 * Test function to verify the geolocation API is working properly
 * This function can be called from the browser console to debug geolocation
 */
export async function testGeolocation(): Promise<void> {
  console.log('🌍 LOCATION TEST: Starting geolocation test...');
  
  try {
    const coordinates = await getUserLocationFromIp();
    
    if (coordinates) {
      console.log('🌍 LOCATION TEST: Success! Coordinates:', coordinates);
    } else {
      console.error('🌍 LOCATION TEST: Failed to get coordinates');
    }
  } catch (error) {
    console.error('🌍 LOCATION TEST: Error during test:', error);
  }
}

/**
 * Checks if the coordinates are valid
 * 
 * @param coordinates The coordinates to check
 * @returns True if coordinates are valid numbers
 */
export function areValidCoordinates(coordinates: [number, number] | null): boolean {
  if (coordinates === null) {
    console.log('🌍 LOCATION VALIDATION: Coordinates are null');
    return false;
  }
  
  if (coordinates.length !== 2) {
    console.log('🌍 LOCATION VALIDATION: Coordinates array has wrong length:', coordinates.length);
    return false;
  }
  
  if (typeof coordinates[0] !== 'number' || typeof coordinates[1] !== 'number') {
    console.log('🌍 LOCATION VALIDATION: Coordinates contain non-number values:', coordinates);
    return false;
  }
  
  if (isNaN(coordinates[0]) || isNaN(coordinates[1])) {
    console.log('🌍 LOCATION VALIDATION: Coordinates contain NaN values:', coordinates);
    return false;
  }
  
  if (coordinates[0] < -180 || coordinates[0] > 180) {
    console.log('🌍 LOCATION VALIDATION: Longitude out of range:', coordinates[0]);
    return false;
  }
  
  if (coordinates[1] < -90 || coordinates[1] > 90) {
    console.log('🌍 LOCATION VALIDATION: Latitude out of range:', coordinates[1]);
    return false;
  }
  
  if (coordinates[0] === 0 && coordinates[1] === 0) {
    console.log('🌍 LOCATION VALIDATION: Coordinates are at null island (0,0), likely invalid');
    return false;
  }
  
  console.log('🌍 LOCATION VALIDATION: Coordinates passed all validation checks:', coordinates);
  return true;
} 