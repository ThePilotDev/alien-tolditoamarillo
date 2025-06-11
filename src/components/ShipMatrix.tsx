import React from "react";
import { RadarMap } from "./RadarMap.tsx";
import { CommandCenterList } from "./CommandCenterList.tsx";

type Props = {
  ship: {
    matrix: string[][];
    scale: number;
    width: number;
    height: number;
    centers: {
      char: string;
      area: number;
      x: number;
      y: number;
    }[];
  };
};

export const ShipMatrix = ({ ship }: Props) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
      <div>
        <RadarMap matrix={ship.matrix} centers={ship.centers} scale={ship.scale} />
      </div>
      <div>
        <CommandCenterList centers={ship.centers} />
      </div>
    </div>
  );
};