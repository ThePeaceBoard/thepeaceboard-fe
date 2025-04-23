interface MapErrorProps {
  error: string;
}

export const MapError: React.FC<MapErrorProps> = ({ error }) => (
  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white p-4 z-50">
    <div className="bg-red-800 p-4 rounded-lg">
      <h3 className="font-bold">Error Loading Map</h3>
      <p>{error}</p>
    </div>
  </div>
); 