export interface CommandCenter {
  char: string;
  x: number;
  y: number;
  area: number;
}

export interface ShipData {
  matrix: string[][];
  scale: number;
  width: number;
  height: number;
  centers: CommandCenter[];
}

export function parseRadarFile(content: string): ShipData[] {
  const lines = content.split(/\r?\n/).filter(line => line.trim() !== '');
  const shipCount = parseInt(lines[0]);
  let currentLine = 1;
  const ships: ShipData[] = [];

  for (let i = 0; i < shipCount; i++) {
    // Parsear dimensiones y escala
    const [height, width, scale] = lines[currentLine++].split(' ').map(Number);
    
    // Leer matriz
    const matrix: string[][] = [];
    for (let row = 0; row < height; row++) {
      matrix.push(lines[currentLine++].split(' '));
    }

    // Procesar centros de mando
    const centers = findCommandCenters(matrix, scale);

    ships.push({
      matrix,
      scale,
      width,
      height,
      centers
    });
  }

  return ships;
}

function findCommandCenters(matrix: string[][], scale: number): CommandCenter[] {
  const centerMap: Record<string, { xs: number[]; ys: number[]; count: number }> = {};

  // Primera pasada: agrupar todas las posiciones de cada carácter
  for (let x = 0; x < matrix.length; x++) {
    for (let y = 0; y < matrix[x].length; y++) {
      const char = matrix[x][y].toUpperCase();
      if (/[A-Z]/.test(char)) {
        if (!centerMap[char]) {
          centerMap[char] = { xs: [], ys: [], count: 0 };
        }
        centerMap[char].xs.push(y); // Nota: y corresponde a la coordenada x real
        centerMap[char].ys.push(x); // x corresponde a la coordenada y real
        centerMap[char].count++;
      }
    }
  }

  // Segunda pasada: calcular centros y áreas
  const centers: CommandCenter[] = [];
  for (const [char, data] of Object.entries(centerMap)) {
    // Calcular centroide (posición promedio)
    const centerX = data.xs.reduce((sum, x) => sum + x, 0) / data.xs.length;
    const centerY = data.ys.reduce((sum, y) => sum + y, 0) / data.ys.length;

    // Aplicar escala y redondear a 3 decimales
    const scaledX = parseFloat((centerX * scale).toFixed(3));
    const scaledY = parseFloat((centerY * scale).toFixed(3));

    centers.push({
      char,
      x: scaledX,
      y: scaledY,
      area: data.count
    });
  }

  // Ordenar por carácter para consistencia
  centers.sort((a, b) => a.char.localeCompare(b.char));

  return centers;
}

// Función de ayuda para pruebas
export function debugPrintCenters(centers: CommandCenter[]): string {
  return centers
    .map(c => `${c.char}:${c.x.toFixed(3)},${c.y.toFixed(3)}[${c.area}]`)
    .join(' ');
}