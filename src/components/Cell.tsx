import React from "react";

export default class Cell extends React.Component<{
  value: {
    x: number;
    y: number;
    isRevealed: boolean;
    isFlagged: boolean;
    isMine: boolean;
    neighbour: number;
  };
  onClick: () => void;
  onKeyboardEvent: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  cMenu: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}> {
  getValueToDisplay() {
    if (!this.props.value.isRevealed) {
      return this.props.value.isFlagged ? "🚩" : null;
    }
    if (this.props.value.isMine) {
      return "💣";
    }
    if (this.props.value.neighbour === 0) {
      return null;
    }
    return this.props.value.neighbour;
  }

  render() {
    const className =
      "game-board-cell"
      + (this.props.value.isRevealed ? "" : " hidden")
      + (this.props.value.isMine ? " game-m" : "")
      + (this.props.value.isFlagged ? " game-f" : "");

    return (
      <div
        id="game-board-cell"
        className={className}
        tabIndex={0}
        onClick={this.props.onClick}
        onKeyDown={this.props.onKeyboardEvent}
        onContextMenu={this.props.cMenu}
      >
        {this.getValueToDisplay()}
      </div>
    );
  }
}
