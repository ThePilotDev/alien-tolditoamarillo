import React from "react";
import { scaleLinear } from "@visx/scale";
import { Group } from "@visx/group";
import { Circle } from "@visx/shape";

interface Center {
  x: number;
  y: number;
  char: string;
}

interface RadarMapProps {
  matrix: string[][];
  centers: Center[];
  scale: number;
}

const CELL_SIZE = 20;
const PADDING = 40;

export const RadarMap = ({ matrix, centers, scale }: RadarMapProps) => {
  const rows = matrix.length;
  const cols = matrix[0].length;
  const width = cols * CELL_SIZE + PADDING * 2;
  const height = rows * CELL_SIZE + PADDING * 2;

  const xScale = scaleLinear({
    domain: [0, cols],
    range: [PADDING, width - PADDING],
  });
  const yScale = scaleLinear({
    domain: [0, rows],
    range: [PADDING, height - PADDING],
  });

  return (
    <svg width={width} height={height} className="bg-gray-800 rounded shadow">
      <Group>
        {/* Grid Background */}
        {matrix.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <rect
              key={`cell-${rowIndex}-${colIndex}`}
              x={xScale(colIndex)}
              y={yScale(rowIndex)}
              width={CELL_SIZE}
              height={CELL_SIZE}
              fill={cell === "" ? "transparent" : "rgba(255, 255, 255, 0.05)"}
            />
          ))
        )}

        {centers.map((c, i) => {
          // Unscale the coordinates by dividing by the scale factor
          const unscaledX = c.x / scale;
          const unscaledY = c.y / scale;
          return (
            <g key={`center-${i}`}>
              <Circle
                cx={xScale(unscaledY)}
                cy={yScale(unscaledX)}
                r={8}
                fill="lime"
                stroke="black"
                className="transition-all duration-300 hover:scale-110"
              />
              <text
                x={xScale(unscaledY) + 10}
                y={yScale(unscaledX)}
                fill="white"
                fontSize={12}
                className="pointer-events-none"
              >
                {c.char}
              </text>
            </g>
          );
        })}
      </Group>
    </svg>
  );
};
