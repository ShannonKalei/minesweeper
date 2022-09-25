import { generateMineNeighbors } from "../utils/BoardUtils";

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
          x: j,
          y: i,
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
    let randomX, randomY; 
    let minesCreated = 0;
    let tries = 0;
    while (minesCreated < mines && tries < mines * 2) {
        randomX = this.randomInt(width, protectedX);
        randomY = this.randomInt(height, protectedY);
        if (!grid[randomY][randomX].isMine) {
            grid[randomY][randomX].isMine = true;
            minesCreated++;
        }
        tries++
    }
    if (tries >= mines * 1.5 && minesCreated < mines) {
      for(let i=0; i < height; i++) {
        for (let j = 0; j < width; j++) {
          if (i === protectedY && j === protectedX) continue;
          if (minesCreated >= mines) return grid;
          if (!grid[i][j].isMine) {
            grid[i][j].isMine = true;
            minesCreated++;
          }
        }
      }
    }
  
    return grid;
  }

  private randomInt(size: number, protectedInt?: number) {
    let randomNumber = Math.round(Math.random() * (size - 1));
      while(randomNumber === protectedInt) {
        randomNumber = Math.round(Math.random() * (size - 1));
      }
    return randomNumber;
  }
}
