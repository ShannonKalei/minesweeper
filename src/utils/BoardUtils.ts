function generateMineNeighbors(grid: any[][], height: number, width: number) {
  let updatedGrid = grid;
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      if (grid[i][j].isMine !== true) {
        let neighboringMines = 0;
        const area = traverseBoard(grid[i][j].x, grid[i][j].y, grid);
        area.forEach((value) => {
          if (value != null && value.isMine) neighboringMines++;
        });
        if (neighboringMines === 0) updatedGrid[i][j].isEmpty = true;
        updatedGrid[i][j].neighbour = neighboringMines;
      }
    }
  }

  return updatedGrid;
}

function getEmpty(grid: any[][]) {
  let empty: any[] = [];
  grid.forEach((row) => {
    row.forEach((item) => {
      if (item.isEmpty) empty.push(item);
    });
  });

  return empty;
}

function getFlags(grid: any[][]) {
  let flags: any[] = [];
  grid.forEach((row) => {
    row.forEach((item) => {
      if (item.isFlagged) flags.push(item);
    });
  });

  return flags;
}

function getHiddenCells(grid: any[][]) {
  let hiddenCells: any[] = [];
  grid.forEach((row) => {
    row.forEach((item) => {
      if (!item.isRevealed) hiddenCells.push(item);
    });
  });

  return hiddenCells;
}

function getMines(grid: any[][]) {
  let mines: any[] = [];
  grid.forEach((row) => {
    row.forEach((item) => {
      if (item.isMine) mines.push(item);
    });
  });

  return mines;
}

function traverseBoard(x: number, y: number, grid: any[][]) {
  const values = [];
  if (y > 0) { // Cells above
    values.push(grid[y - 1][x]);
    if (x > 0) values.push(grid[y - 1][x - 1]);
    if (x < grid[0].length - 1) values.push(grid[y - 1][x + 1]);
  }

  if (y < grid.length - 1) { // Cells below
    values.push(grid[y + 1][x]);
    if (x > 0) values.push(grid[y + 1][x - 1]);
    if (x < grid[0].length - 1) values.push(grid[y + 1][x + 1]);
  }

  if (x > 0) values.push(grid[y][x - 1]); // Cell left
  if (x < grid[0].length - 1) values.push(grid[y][x + 1]); // Cell right

  return values;
}

export { generateMineNeighbors, getEmpty, getFlags, getHiddenCells, getMines, traverseBoard };
