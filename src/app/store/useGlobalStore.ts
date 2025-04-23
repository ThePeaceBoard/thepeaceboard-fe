import { create } from 'zustand';

interface UserLocation {
  country_code: string;
  latitude: number;
  longitude: number;
  city: string;
  region: string;
  country_name: string;
}

interface InitData {
  // Add specific properties based on your actual data structure
  [key: string]: any;
}

interface GlobalStore {
  // State
  initData: InitData | null;
  activeUsers: number;
  totalPledges: number;
  heatmapData: Array<any>;
  peaceMapData: Array<any>;
  userLocation: UserLocation | null;
  countriesCount: number;
  // Actions
  setInitData: (data: InitData) => void;
  setActiveUsers: (count: number) => void;
  setTotalPledges: (count: number) => void;
  setHeatmapData: (data: Array<any>) => void;
  setPeaceMapData: (data: Array<any>) => void;
  setUserLocation: (location: UserLocation) => void;
  setCountriesCount: (count: number) => void;
}

export const useGlobalStore = create<GlobalStore>((set) => ({
  initData: null,
  countriesCount: 0,
  activeUsers: 0,
  totalPledges: 0,
  heatmapData: [],
  peaceMapData: [],
  userLocation: null,

  setInitData: (data) => set({ initData: data }),
  setActiveUsers: (count) => set({ activeUsers: count }),
  setTotalPledges: (count) => set({ totalPledges: count }),
  setHeatmapData: (data) => set({ heatmapData: data }),
  setPeaceMapData: (data) => set({ peaceMapData: data }),
  setUserLocation: (location) => set({ userLocation: location }),
  setCountriesCount: (count) => set({ countriesCount: count }),
})); 