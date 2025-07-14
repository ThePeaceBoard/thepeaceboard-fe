(async () => {
  let peaceMap = null;

  async function loadPeaceMap() {
    if (!peaceMap) {
      try {
        const res = await fetch(`${self.location.origin}/peace-map.json`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        peaceMap = await res.json();
      } catch (e) {
        console.error('Failed to load peace map:', e);
        peaceMap = {};
      }
    }
  }

  async function featurePropertiesTransform(source, sourceLayer, tileID, geometryType, featureID, properties) {
    if (properties === null) return;

    await loadPeaceMap();

    if (sourceLayer === 'centroids' && geometryType === 'Point') {
      const name = properties['NAME'];
      const value = peaceMap[name] !== undefined ? peaceMap[name] : 0;
      properties['NAME'] = `${name}\n${value}% for peace`;
    }
  }

  self.setFeaturePropertiesTransform(featurePropertiesTransform);
})();
