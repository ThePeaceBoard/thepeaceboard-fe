// Import types from the standard maplibre-gl package
declare module '@/lib/maplibre-gl/dist/maplibre-gl' {
  export * from 'maplibre-gl';
}

// Import types for the dev version in public dir
declare module '../../../public/lib/maplibre-gl/dist/maplibre-gl-dev' {
  import * as maplibregl from 'maplibre-gl';
  export = maplibregl;
}

// Import types for non-dev version in public dir
declare module '../../../public/lib/maplibre-gl/dist/maplibre-gl' {
  import * as maplibregl from 'maplibre-gl';
  export = maplibregl;
} 