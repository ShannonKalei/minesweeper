import React from "react";

export default class LevelSelect extends React.Component<{
  handleGameStart: (height: number, width: number, mines: number) => void;
}> {
  state = {
    height: 8,
    width: 8,
    mines: 10,
    maxHeight: 20,
    maxWidth: 40,
    maxMines: 50,
    minHeight: 2,
    minWidth: 2,
    minMines: 1,
    newGameRequested: false,
    debounce: false
  };

  handleLevelSelect = () => {
    let size = document.querySelector("#board_size_select") as HTMLInputElement;
    let levelSelection = { height: 8, width: 8, mines: 10 };
    switch(size.value) { 
      case "5x5":
        levelSelection = { height: 5, width: 5, mines: 5 };
        break;
      case "8x8":
        levelSelection = { height: 8, width: 8, mines: 10 };
        break;
      case "12x12":
        levelSelection = { height: 12, width: 12, mines: 20 };
        break;
      case "16x16":
        levelSelection = { height: 16, width: 16, mines: 40 };
        break;
      default:
        break;
    }

    this.setState({ 
      height: levelSelection.height,
      width: levelSelection.width,
      mines: levelSelection.mines
    }, () => this.requestGameStart());    
  };

  //TODO: clean up handling of custom inputs & handle NaN
  handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const id = e.target.id;
    let value: number | string = parseInt(e.target.value);
    if (isNaN(value)) value = '';
    switch(id) {
      case "custom-height":
        this.setState({ height: value }, () => this.validateInput(id, value));
        break;
      case "custom-width":
        this.setState({ width: value }, () => this.validateInput(id, value));
        break;
      case "custom-mines":
        this.setState({ mines: value }, () => this.validateInput(id, value));
        break;
      default:
        break;
    }
  }

  debounceTimer = setTimeout(() => {});
  validateInput(id: string, value: number | string) {
    clearTimeout(this.debounceTimer);  
    if (typeof value !== 'number') return;
    let val = 0;
    if (typeof value === 'number') val = value;
    this.debounceTimer = setTimeout(() => {      
      switch(id) {
        case "custom-height":
          val = Math.min(Math.max(val, this.state.minHeight), this.state.maxHeight);
          this.setState({ height: val });
          break;
        case "custom-width":
          val = Math.min(Math.max(val, this.state.minWidth), this.state.maxWidth);
          this.setState({ width: val });

          break;
        case "custom-mines":
          val = Math.min(Math.max(val, this.state.minMines), this.state.maxMines);
          this.setState({ mines: val });
          break;
        default:
          break;
      }
    }, 400);
  }

  requestGameStart = () => {
    let height = this.state.height;
    let width = this.state.width;
    let mines = this.state.mines;
    if (typeof this.state.height !== 'number') {
      height = this.state.minHeight;
      this.setState({ height });
    }
    if (typeof this.state.width !== 'number') {
      width = this.state.minWidth;
      this.setState({ width });
    }
    
    if (typeof this.state.mines !== 'number') {
      mines = this.state.minMines;
      this.setState({ mines });
    }  
    const size = width * height;  
    if (size <= mines) {
      mines = size - 2;
      this.setState({ mines });
    }
    
    this.props.handleGameStart(height, width, mines);
  }

  render() {
    return (
      <div>
        <div className="level-selection">
          <div className='level-selection-predefined'>
            <select id="board_size_select" defaultValue={"8x8"}>
              <option value="5x5">5x5; 5x💣</option>
              <option value="8x8">8x8; 10x💣</option>
              <option value="12x12">12x12; 20x💣</option>
              <option value="16x16">16x16; 40x💣</option>
            </select>
            <button onClick={this.handleLevelSelect}>Create New Board</button>
          </div>
          <div className="level-selection-custom">
            <div className='level-selection-custom-input-fields'>
              <label htmlFor="custom-height">Height: </label>
              <input 
                id="custom-height" name="custom height" type="number" min={1} max={this.state.maxHeight} pattern="[0-9]"
                value={this.state.height} onChange={this.handleChange.bind(this)}
              />
              <label htmlFor="custom-width">Width: </label>
              <input 
                id="custom-width" name="custom width" type="number" min={1} max={this.state.maxWidth} pattern="[0-9]"
                value={this.state.width} onChange={this.handleChange.bind(this)}
              />
              <label htmlFor="custom-mines">Mines: </label>
              <input 
                id="custom-mines" name="custom mines" type="number" min={1} max={this.state.maxMines} pattern="[0-9]"
                value={this.state.mines} onChange={this.handleChange.bind(this)}
              />
            </div>
            <button onClick={this.requestGameStart}>Create New Custom Board</button>
          </div>
        </div>
      </div>
    );
  }
}