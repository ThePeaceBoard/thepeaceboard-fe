interface CameraState {
  zoom: number;
  lat: number;
  lng: number;
  pitch: number;
  bearing: number;
}

const DEFAULT_CAMERA: CameraState = {
  zoom: 1,
  lat: 60.3804532,
  lng: 5.3266662,
  pitch: 0,
  bearing: 0
};

export const storeCamera = (state: CameraState): void => {
  localStorage.setItem('map_zoom', state.zoom.toString());
  localStorage.setItem('map_lat', state.lat.toString());
  localStorage.setItem('map_lng', state.lng.toString());
  localStorage.setItem('map_pitch', state.pitch.toString());
  localStorage.setItem('map_bearing', state.bearing.toString());
};

export const loadCamera = (): CameraState => {
  const zoom = parseFloat(localStorage.getItem('map_zoom') || '');
  const lat = parseFloat(localStorage.getItem('map_lat') || '');
  const lng = parseFloat(localStorage.getItem('map_lng') || '');
  const pitch = parseFloat(localStorage.getItem('map_pitch') || '');
  const bearing = parseFloat(localStorage.getItem('map_bearing') || '');

  if (!isFinite(zoom) || !isFinite(lat) || !isFinite(lng) || !isFinite(pitch) || !isFinite(bearing)) {
    return DEFAULT_CAMERA;
  }

  return {
    zoom,
    lat,
    lng,
    pitch,
    bearing
  };
}; 