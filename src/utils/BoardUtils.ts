function traverseBoard(x: number, y: number, grid: any[][]) {
  const values = [];

  if (x > 0) {
    // Cells above
    values.push(grid[x - 1][y]);

    if (y > 0) {
      values.push(grid[x - 1][y - 1]);
    }

    if (y < grid[0].length - 1) {
      values.push(grid[x - 1][y + 1]);
    }
  }

  if (x < grid.length - 1) {
    // Cells below
    values.push(grid[x + 1][y]);

    if (y > 0) {
      values.push(grid[x + 1][y - 1]);
    }

    if (y < grid[0].length - 1) {
      values.push(grid[x + 1][y + 1]);
    }
  }

  if (y > 0) values.push(grid[x][y - 1]); // Cell left
  if (y < grid[0].length - 1) values.push(grid[x][y + 1]); // Cell right

  return values;
}

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

function getMines(grid: any[][]) {
  let mines: any[] = [];

  grid.forEach((row) => {
    row.forEach((item) => {
      if (item.isMine) mines.push(item);
    });
  });

  return mines;
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

function getEmpty(grid: any[][]) {
  let empty: any[] = [];

  grid.forEach((row) => {
    row.forEach((item) => {
      if (item.isEmpty) empty.push(item);
    });
  });

  return empty;
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

export { generateMineNeighbors, getEmpty, getFlags, getHiddenCells, getMines, traverseBoard };
