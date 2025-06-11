import { scaleLinear } from "@visx/scale";
import { Group } from "@visx/group";
import { Circle } from "@visx/shape";

interface Center {
  x: number;
  y: number;
  char: string;
}

interface RadarMapProps {
  matrix: string[][];  // Cambiado de number[][] a string[][]
  centers: Center[];
}

const CELL_SIZE = 20;
const PADDING = 40;

export const RadarMap = ({ matrix, centers }: RadarMapProps) => {
  const rows = matrix.length;
  const cols = matrix[0].length;
  const width = cols * CELL_SIZE + PADDING * 2;
  const height = rows * CELL_SIZE + PADDING * 2;

  const xScale = scaleLinear({ domain: [0, cols], range: [PADDING, width - PADDING] });
  const yScale = scaleLinear({ domain: [0, rows], range: [PADDING, height - PADDING] });

  return (
    <svg width={width} height={height} className="bg-gray-800 rounded shadow">
      <Group>
        {centers.map((c, i) => (
          <g key={`center-${i}`}>
            <Circle
              cx={xScale(c.y)}
              cy={yScale(c.x)}
              r={8}
              fill="lime"
              stroke="black"
            />
            <text
              x={xScale(c.y) + 10}
              y={yScale(c.x)}
              fill="white"
              fontSize={12}
            >
              {c.char}
            </text>
          </g>
        ))}
      </Group>
    </svg>
  );
};