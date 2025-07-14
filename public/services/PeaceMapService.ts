export type PeaceMap = Record<string, number>;

export async function fetchPeaceMap(): Promise<PeaceMap> {
  try {
    const response = await fetch('/peace-map.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (e) {
    console.error('Failed to fetch peace map:', e);
    return {};
  }
}
