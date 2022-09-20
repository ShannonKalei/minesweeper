import * as React from "react";
import Cell from "./Cell";
import { getMines, getFlags, getHiddenCells, traverseBoard } from "../utils/BoardUtils";
import GameBoard from "./GameBoard";

export default class Board extends React.Component<any, any> {
  state = {
    boardData: new GameBoard(this.props.height, this.props.width, this.props.mines),
    gameWon: false,
    flagCount: 0,
    mineCount: this.props.mines,
    moveCount: 0,
    newGameRequested: false,
  };

  cell = document.getElementsByClassName("game-board-cell")[0] as HTMLElement;
  cellWidth = this.cell ? this.cell.offsetWidth : 42;
  gameBoardStyle: React.CSSProperties = { width: this.state.boardData.length * this.cellWidth };

  componentDidUpdate(
    prevProps: { height: number, width: number, newGameRequested: boolean },
    prevState: { boardData: { grid: [][] }, newGameRequested: boolean }
  ) {
    const comparisonState = {
      height: prevState.boardData.grid.length,
      width: prevState.boardData.grid[0].length,
      newGameRequested: prevState.newGameRequested
    }
    const comparisonProps = {
      height: prevProps.height,
      width: prevProps.width,
      newGameRequested: this.props.newGameRequested
    }
    const isNewBoardRequired = JSON.stringify(comparisonProps) !== JSON.stringify(comparisonState);

    if (isNewBoardRequired && this.props.newGameRequested !== prevProps.newGameRequested) {
      this.createNewBoard(this.props.height, this.props.width, this.props.mines);
    }
  }

  createNewBoard(width: number, height: number, mines: number) {
    this.setState({
      boardData: new GameBoard(height, width, mines),
      gameWon: false,
      flagCount: 0,
      mineCount: mines,
      moveCount: 0,
    });

    this.cell = document.getElementsByClassName("game-board-cell")[0] as HTMLElement;
    this.cellWidth = this.cell ? this.cell.offsetWidth : 42;
    this.gameBoardStyle = { width: width * this.cellWidth };
  }

  revealBoard() {
    let updatedData = this.state.boardData;
    updatedData.grid.forEach((row: Array<any>) => {
      row.forEach((item) => item.isRevealed = true);
    });
    this.setState({ boardData: updatedData });
  }

  revealEmpty(x: number, y: number, data: any[][], flagsToRemove = 0) {
    let area = traverseBoard(x, y, data);
    area.forEach((value) => {
      if (!value.isRevealed && (value.isEmpty || !value.isMine)) {
        data[value.x][value.y].isRevealed = true;
        data[value.x][value.y].isFlagged = false;
        if (value.isEmpty) this.revealEmpty(value.x, value.y, data, flagsToRemove);
      }
    });

    return data;
  }

  swapMineWithEmpty(x: number, y: number) {
    this.setState(
      { boardData: new GameBoard(this.props.height, this.props.width, this.props.mines, x, y) },
      () => { this.activateCell(x, y) }
    );
  }

  activateCell(x: number, y: number) {
    const selectedCell = this.state.boardData.grid[x][y];
    if (selectedCell.isRevealed) return null;
    if (this.state.moveCount === 0 && selectedCell.isMine) {
      this.swapMineWithEmpty(x, y);
      return;
    }

    const moves = this.state.moveCount + 1;
    this.setState({ moveCount: moves });

    if (selectedCell.isMine) this.revealBoard();

    let updatedData = this.state.boardData;
    updatedData.grid[x][y].isRevealed = true;

    if (updatedData.grid[x][y].isEmpty) {
      updatedData.grid = this.revealEmpty(x, y, updatedData.grid);
    }

    let win = false;
    if (getHiddenCells(updatedData.grid).length === this.props.mines) {
      win = true;
      this.revealBoard();
    } else {
      updatedData.grid[x][y].isFlagged = false;
    }

    const flagCount = getFlags(updatedData.grid).length;
    const mineCount = this.props.mines - flagCount;
    this.setState({ boardData: updatedData, mineCount, gameWon: win, flagCount });
  }

  tagCell(x: number, y: number) {
    let updatedData = this.state.boardData;
    if (updatedData.grid[x][y].isRevealed) return;

    let mineCount = this.state.mineCount;
    let flagCount = this.state.flagCount;
    let win = false;

    if (updatedData.grid[x][y].isFlagged) {
      updatedData.grid[x][y].isFlagged = false;
      flagCount--;
      mineCount++;
    } else {
      updatedData.grid[x][y].isFlagged = true;
      flagCount++;
      mineCount--;
    }

    if (mineCount === 0) {
      const mineArray = getMines(updatedData.grid);
      const FlagArray = getFlags(updatedData.grid);
      win = JSON.stringify(mineArray) === JSON.stringify(FlagArray);
      if (win) this.revealBoard();
    }

    this.setState({ boardData: updatedData, flagCount, mineCount, gameWon: win });
  }

  handleCellClick(x: number, y: number) {
    this.activateCell(x, y);
  }

  handleKeyboardEvent(x: number, y: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Enter") return;
    if (!e.shiftKey) {
      this.activateCell(x, y);
    } else {
      this.tagCell(x, y);
    }
  }

  handleContextMenu(e: React.MouseEvent<HTMLDivElement, MouseEvent>, x: number, y: number) {
    e.preventDefault();
    this.tagCell(x, y);
  }

  renderBoard(data: Array<any>) {
    return data.map((row) => {
      return row.map(
        (item: {
          x: number;
          y: number;
          isRevealed: boolean;
          isFlagged: boolean;
          isMine: boolean;
          neighbour: number;
        }) => {
          return (
            <div key={item.x * row.length + item.y}>
              <Cell value={item}
                onClick={() => this.handleCellClick(item.x, item.y)}
                onKeyboardEvent={(e: React.KeyboardEvent<HTMLInputElement>) =>
                  this.handleKeyboardEvent(item.x, item.y, e)
                }
                cMenu={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
                  this.handleContextMenu(e, item.x, item.y)
                }
              />
              {row[row.length - 1] === item ? <div className="clear" /> : ""}
            </div>
          );
        }
      );
    });
  }

  render() {
    return (
      <div className="board">
        <div className="game-info">
          <span className="info">Total Mines: {this.props.mines}</span>
          <br />
          <span className="info">Flags In-Use: {this.state.flagCount}</span>
          <br />
          <span className="info">Moves Taken: {this.state.moveCount}</span>
          <br />
          <span className="info">{this.state.gameWon ? "You Win" : ""}</span>
        </div>
        <div className="game-board-container" style={this.gameBoardStyle}>
          <div>{this.renderBoard(this.state.boardData.grid)}</div>
        </div>
      </div>
    );
  }
}
