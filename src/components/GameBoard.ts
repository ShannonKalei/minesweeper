import { generateMineNeighbors, traverseBoard } from "../utils/BoardUtils";

export default class GameBoard {
  grid: any[][];
  length: number;

  constructor(height: number, width: number, mines: number, protectedX?: number, protectedY?: number) {
    this.grid = this.initGameBoard(height, width, mines, protectedX, protectedY);
    this.length = this.grid.length;
  }

  private initGameBoard(height: number, width: number, mines: number, protectedX?: number, protectedY?: number) {
    let gridData: any[][] = [];
    for (let i = 0; i < height; i++) {
      gridData.push([null]);
      for (let j = 0; j < width; j++) {
        gridData[i][j] = {
          x: i,
          y: j,
          isMine: false,
          neighbour: 0,
          isRevealed: false,
          isEmpty: false,
          isFlagged: false,
        };
      }
    }

    gridData = this.createMines(gridData, height, width, mines, protectedX, protectedY);
    gridData = generateMineNeighbors(gridData, height, width);

    return gridData;
  }

  private createMines(grid: any[][], height: number, width: number, mines: number, protectedX?: number, protectedY?: number) {
    let randomx, randomy, minesCreated = 0;

    while (minesCreated < mines) {
        randomx = this.randomInt(width, protectedX);
        randomy = this.randomInt(height, protectedY);
        if (!(grid[randomx][randomy].isMine)) {
            grid[randomx][randomy].isMine = true;
            minesCreated++;
        }
    }
  
    return grid;
  }

  private randomInt(size: number, protectedInt?: number) {
    // TODO check this
    // return Math.floor(Math.random() * size); ??
    let randomNumber = Math.floor((Math.random() * 1000) + 1) % size;
    while(randomNumber === protectedInt) {
      randomNumber = Math.floor((Math.random() * 1000) + 1) % size;
    }
    return randomNumber;
  }
}
