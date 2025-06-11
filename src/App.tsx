import { useState } from "react";
import { parseRadarFile } from "./utils/parser";
import { ShipMatrix } from "./components/ShipMatrix.tsx";
import { Tabs, Tab } from "./components/tabs.tsx";

function App() {
  const [ships, setShips] = useState<any[]>([]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const parsed = parseRadarFile(text);
      setShips(parsed);
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <h1 className="text-4xl font-bold mb-4">🛸 Alien Radar Command Decoder</h1>
      <p className="mb-4 text-gray-400">Upload radar scan file (.in) to decode ship centers</p>
      <input type="file" accept=".in" onChange={handleFile} className="mb-6" />

      {ships.length > 0 && (
        <Tabs>
          {ships.map((ship, idx) => (
            <Tab key={idx} title={`Ship ${idx + 1}`}>
              <ShipMatrix ship={ship} />
            </Tab>
          ))}
        </Tabs>
      )}
    </div>
  );
}

export default App;