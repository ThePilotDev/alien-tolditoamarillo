export const CommandCenterList = ({ centers }: any) => {
  return (
    <div className="p-4 border border-gray-700 rounded">
      <h2 className="text-xl font-semibold mb-2">Target Coordinates</h2>
      <ul className="text-sm space-y-1">
        {centers.map((c: any, idx: number) => (
          <li key={idx}>
            {c.char}:{" "}
            <span className="text-green-400">
              {c.x.toFixed(3)},{c.y.toFixed(3)}
            </span>{" "}
            (Area: {c.area})
          </li>
        ))}
      </ul>
    </div>
  );
};