import type { StyleSpecification } from 'maplibre-gl';

// Component Props
export interface LayeredMapProps {
  activeMap: 'peace' | 'heat';
  projection: 'globe' | 'mercator';
  enablePan?: boolean;
  enableZoom?: boolean;
  className?: string;
  style?: React.CSSProperties;
  center?: [number, number];
  zoom?: number;
  showControls?: boolean;
  trackUserLocation?: boolean;
}

// Data Feature Interfaces
export interface PeaceFeature {
  country: string;
  localName?: string;
  signatureCount: number;
  totalResidents: number;
  peaceCount: number;
  peacePercentage: number;
}

export interface CityPeaceFeature {
  city: string;
  localName?: string;
  country: string;
  signatureCount: number;
  totalResidents: number;
  peaceCount: number;
  peacePercentage: number;
  population?: number;
}

export interface HeatFeature {
  intensity: number;
  latitude: number;
  longitude: number;
}

// GeoJSON Type Extensions
export interface PeaceGeoJSON extends GeoJSON.FeatureCollection {
  features: Array<GeoJSON.Feature<GeoJSON.Geometry, PeaceFeature>>;
}

export interface CityPeaceGeoJSON extends GeoJSON.FeatureCollection {
  features: Array<GeoJSON.Feature<GeoJSON.Point, CityPeaceFeature>>;
}

export interface HeatGeoJSON extends GeoJSON.FeatureCollection {
  features: Array<GeoJSON.Feature<GeoJSON.Point, HeatFeature>>;
}

// Map Style Types
export type MapStyle = StyleSpecification;

export interface CountryData {
  iso: string;
  peacePercentage: number;
  name: string;
}

export interface CountryDataMap {
  [iso: string]: CountryData;
} 