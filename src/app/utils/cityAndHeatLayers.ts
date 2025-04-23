import maplibregl, { Map } from '../../../public/lib/maplibre-gl/dist/maplibre-gl-dev';
import { CityPeaceGeoJSON, HeatGeoJSON } from '../types/map';

/**
 * Adds or updates the city peace layer showing city-level data
 */
export const addCityPeaceLayer = (
  mapInstance: Map | null, 
  cityPeaceData: CityPeaceGeoJSON | null
): void => {
  if (!mapInstance || !cityPeaceData) return;

  if (!mapInstance.getSource('city-peace')) {
    mapInstance.addSource('city-peace', {
      type: 'geojson',
      data: cityPeaceData,
    });
  } else {
    (mapInstance.getSource('city-peace') as maplibregl.GeoJSONSource).setData(cityPeaceData);
  }
  
  if (!mapInstance.getSource('city-peace-labels')) {
    mapInstance.addSource('city-peace-labels', {
      type: 'geojson',
      data: cityPeaceData,
    });
  } else {
    (mapInstance.getSource('city-peace-labels') as maplibregl.GeoJSONSource).setData(cityPeaceData);
  }
  
  if (mapInstance.getLayer('city-labels')) {
    mapInstance.removeLayer('city-labels');
  }
  
  // Add city points (visible circles)
  if (!mapInstance.getLayer('city-points')) {
    mapInstance.addLayer({
      id: 'city-points',
      type: 'circle',
      source: 'city-peace',
      minzoom: 4,
      paint: {
        'circle-radius': [
          'interpolate',
          ['linear'],
          ['zoom'],
          4, 2,
          8, 5,
          12, 8
        ],
        'circle-color': [
          'interpolate',
          ['linear'],
          ['get', 'peacePercentage'],
          0, '#FF5252',
          25, '#FF9800',
          50, '#FFC107',
          75, '#8BC34A',
          100, '#2E7D32'
        ],
        'circle-opacity': 0.7,
        'circle-stroke-width': 1,
        'circle-stroke-color': '#fff'
      }
    });
  }
  
  // Add city labels with peace percentages
  mapInstance.addLayer({
    id: 'city-labels',
    type: 'symbol',
    source: 'city-peace-labels',
    minzoom: 5,
    layout: {
      'text-field': [
        'format',
        ['get', 'city'],
        { 
          'font-scale': 1.0,
          'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold']
        },
        '\n',
        {},
        [
          'case',
          ['has', 'localName'],
          ['get', 'localName'],
          ''
        ],
        {
          'font-scale': 0.8,
          'text-font': ['Open Sans Italic', 'Arial Unicode MS Regular']
        },
        [
          'case',
          ['has', 'localName'],
          '\n',
          ''
        ],
        {},
        ['number-format', ['get', 'peacePercentage'], { 'min-fraction-digits': 1, 'max-fraction-digits': 1 }],
        { 
          'font-scale': 0.9
        },
        '% ',
        { 'font-scale': 0.9 },
        'Peace',
        { 
          'font-scale': 0.9
        }
      ],
      'text-size': [
        'interpolate',
        ['linear'],
        ['zoom'],
        5, 8,
        8, 12,
        12, 16
      ],
      'text-offset': [0, 1],
      'text-anchor': 'top',
      'text-allow-overlap': false,
      'text-ignore-placement': false,
      'symbol-z-order': 'source',
      'text-letter-spacing': 0.05,
      'symbol-sort-key': ['-', ['get', 'population']]
    },
    paint: {
      'text-color': [
        'interpolate',
        ['linear'],
        ['get', 'peacePercentage'],
        0, '#FF5252',
        25, '#FF9800',
        50, '#FFC107',
        75, '#8BC34A',
        100, '#2E7D32'
      ],
      'text-halo-color': [
        'case',
        ['<', ['get', 'peacePercentage'], 50],
        'rgba(0, 0, 0, 0.75)',
        'rgba(255, 255, 255, 0.75)'
      ],
      'text-halo-width': 1.5,
      'text-halo-blur': 0.5,
      'text-opacity': [
        'interpolate',
        ['linear'],
        ['zoom'],
        5, 0.6,
        7, 1
      ]
    }
  });
};

/**
 * Adds or updates the heat layer
 */
export const addHeatLayer = (
  mapInstance: Map | null, 
  heatData: HeatGeoJSON | null
): void => {
  if (!mapInstance || !heatData) return;

  if (!mapInstance.getSource('heat')) {
    mapInstance.addSource('heat', {
      type: 'geojson',
      data: heatData,
    });
  } else {
    (mapInstance.getSource('heat') as maplibregl.GeoJSONSource).setData(heatData);
  }

  if (!mapInstance.getLayer('heat-layer')) {
    mapInstance.addLayer({
      id: 'heat-layer',
      type: 'heatmap',
      source: 'heat',
      paint: {
        'heatmap-intensity': [
          'interpolate',
          ['linear'],
          ['zoom'],
          0, 1,
          9, 3,
        ],
        'heatmap-color': [
          'interpolate',
          ['linear'],
          ['heatmap-density'],
          0, 'rgba(33,102,172,0)',
          0.2, 'rgb(103,169,207)',
          0.4, 'rgb(209,229,240)',
          0.6, 'rgb(253,219,199)',
          0.8, 'rgb(239,138,98)',
          1, 'rgb(178,24,43)',
        ],
        'heatmap-radius': [
          'interpolate',
          ['linear'],
          ['zoom'],
          0, 2,
          9, 20,
        ],
        'heatmap-opacity': 0.6,
      },
    });
  }
}; 