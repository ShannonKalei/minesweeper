import * as React from 'react';
import Board from "./components/Board";
import "./index.css";

class App extends React.Component<any, any> {
  state = {
    height: 8,
    width: 8,
    mines: 10,
    newGameRequested: false,
  };

  handleGameStart = () => {
    let size = document.querySelector("#board_size_select") as HTMLInputElement;
    switch(size.value) {
      case "5x5":
        this.setState({ height: 5, width: 5, mines: 5 });
        break;
      case "8x8":
        this.setState({ height: 8, width: 8, mines: 10 });
        break;
      case "12x12":
        this.setState({ height: 12, width: 12, mines: 20 });
        break;
      case "16x16":
        this.setState({ height: 16, width: 16, mines: 40 });
        break;
      default:
        break;
    }
    this.setState({ newGameRequested: true }, () => {
      this.setState({ newGameRequested: false })
    });
  };

  render() {
    const { height, width, mines, newGameRequested } = this.state;
    return (
      <div className="game">
        <Board height={height} width={width} mines={mines} newGameRequested={newGameRequested} />
        <div>
          <span className="info">
            Size: 
            <select id="board_size_select" defaultValue={"8x8"}>
              <option value="5x5"> 5x5 </option>
              <option value="8x8"> 8x8 </option>
              <option value="12x12"> 12x12 </option>
              <option value="16x16"> 16x16 </option>
            </select>
          </span>
          <button onClick={this.handleGameStart}>Create New Board</button>
        </div>
      </div>
    );
  }
}

export default App;
