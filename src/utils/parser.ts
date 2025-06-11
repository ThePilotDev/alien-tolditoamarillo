interface ShipData {
  matrix: string[][];
  width: number;
  height: number;
  scale: number;
  centers: {
    char: string;
    x: number;
    y: number;
    area: number;
  }[];
}

export function parseRadarFile(content: string): ShipData[] {
  const lines = content.split(/\r?\n/).filter(Boolean);
  const n = parseInt(lines[0]);
  let index = 1;
  const ships: ShipData[] = [];

  for (let i = 0; i < n; i++) {
    const [X, Y, Z] = lines[index++].split(" ").map((v, i) => (i < 2 ? parseInt(v) : parseFloat(v)));
    const matrix: string[][] = [];
    for (let r = 0; r < X; r++) {
      matrix.push(lines[index++].split(" "));
    }
    const centers = detectCenters(matrix, Z);
    ships.push({ matrix, width: Y, height: X, scale: Z, centers });
  }
  return ships;
}

interface Center {
  char: string;
  x: number;
  y: number;
  area: number;
}

function detectCenters(matrix: string[][], scale: number): Center[] {
  const H = matrix.length;
  const W = matrix[0].length;
  const visited: boolean[][] = Array.from({ length: H }, () => Array(W).fill(false));
  const centers: Center[] = [];

  function bfs(i: number, j: number, char: string): [number, number][] {
    const q: [number, number][] = [[i, j]];
    const cells: [number, number][] = [];
    visited[i][j] = true;
    while (q.length) {
      const [x, y] = q.shift()!;
      cells.push([x, y]);
      for (const [dx, dy] of [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
      ] as [number, number][]) {
        const nx = x + dx,
          ny = y + dy;
        if (
          nx >= 0 &&
          ny >= 0 &&
          nx < H &&
          ny < W &&
          !visited[nx][ny] &&
          matrix[nx][ny] === char
        ) {
          visited[nx][ny] = true;
          q.push([nx, ny]);
        }
      }
    }
    return cells;
  }

  for (let i = 0; i < H; i++) {
    for (let j = 0; j < W; j++) {
      const char = matrix[i][j];
      if (!/[a-zA-Z]/.test(char) || visited[i][j]) continue;
      const group = bfs(i, j, char);
      const cx = (group.reduce((sum, [x]) => sum + x, 0) / group.length) * scale;
      const cy = (group.reduce((sum, [, y]) => sum + y, 0) / group.length) * scale;
      centers.push({
        char,
        x: parseFloat(cx.toFixed(3)),
        y: parseFloat(cy.toFixed(3)),
        area: group.length,
      });
    }
  }
  return centers;
}