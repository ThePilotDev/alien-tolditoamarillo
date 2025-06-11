import React from "react";
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

    console.log("File name:", file.name);
    console.log("File size:", file.size);
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <h1 className="text-4xl font-bold mb-2">Alien Radar Decoder</h1>
      <h2 className="text-xl text-lime-400 mb-4">Development By ThePilotDev</h2>
      
      <div className="mb-6">
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-700 border-gray-600 hover:bg-gray-600"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
              <p className="mb-2 text-sm text-gray-400 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                .in file (max. 2MB)
              </p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              accept=".in"
              onChange={handleFile}
              className="hidden"
            />
          </label>
        </div>
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