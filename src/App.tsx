import { useState } from "react";
import { parseRadarFile, type ShipData } from "./utils/parser";
import { ShipMatrix } from "./components/ShipMatrix";
import { Tabs, Tab } from "./components/tabs";

function App() {
  const [ships, setShips] = useState<ShipData[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar extensión
    if (!file.name.endsWith('.in')) {
      setError('Please upload a .in file');
      return;
    }

    setError(null);
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = parseRadarFile(text);
        setShips(parsed);
      } catch (err) {
        setError('Error parsing file. Check the format and try again.');
        console.error('Parsing error:', err);
      }
    };

    reader.onerror = () => {
      setError('Error reading file');
    };

    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <h1 className="text-4xl font-bold mb-2">Alien Radar Decoder</h1>
      <h2 className="text-xl text-lime-400 mb-4">Development By ThePilotDev</h2>
      
      <div className="mb-6">
        <label className="block mb-2 text-sm font-medium">
          Upload radar scan file (.in)
        </label>
        <input
          type="file"
          accept=".in"
          onChange={handleFile}
          className="file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-lime-500 file:text-gray-900 hover:file:bg-lime-400"
        />
        {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
      </div>

      {ships.length > 0 ? (
        <Tabs>
          {ships.map((ship, idx) => (
            <Tab key={`ship-${idx}`} title={`Ship ${idx + 1}`}>
              <ShipMatrix ship={ship} />
            </Tab>
          ))}
        </Tabs>
      ) : (
        <div className="bg-gray-800/50 p-8 rounded-lg border border-gray-700 text-center">
          <p className="text-gray-400">No ship data loaded</p>
          <p className="text-sm text-gray-500 mt-2">
            Upload a radar scan file to visualize ship command centers
          </p>
        </div>
      )}
    </div>
  );
}

export default App;