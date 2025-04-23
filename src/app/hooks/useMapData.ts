import { useState } from 'react';
import { fetchPeaceData } from '../services/peaceDataService';
import { PeaceGeoJSON, CityPeaceGeoJSON } from '../types/map';

interface UseMapDataReturn {
  peaceData: PeaceGeoJSON | null;
  cityPeaceData: CityPeaceGeoJSON | null;
  error: string | null;
  fetchData: () => Promise<void>;
}

export const useMapData = (): UseMapDataReturn => {
  const [peaceData, setPeaceData] = useState<PeaceGeoJSON | null>(null);
  const [cityPeaceData, setCityPeaceData] = useState<CityPeaceGeoJSON | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const data = await fetchPeaceData();
      setPeaceData(data.countries);
      setCityPeaceData(data.cities);
    } catch (err: any) {
      setError(`Failed to load peace data: ${err?.message || 'Unknown error'}`);
    }
  };

  return {
    peaceData,
    cityPeaceData,
    error,
    fetchData
  };
}; 