import * as React from 'react';
import Board from "./components/Board";
import LevelSelect from './components/LevelSelect';
import ThemeSlider from './components/ThemeSlider';
import "./index.css";

class App extends React.Component<any, any> {
  state = {
    height: 8,
    width: 8,
    mines: 10,
    newGameRequested: false,
  };

  handleGameStart = (height: number, width: number, mines: number) => {
    this.setState({ 
      height,
      width,
      mines,
      newGameRequested: true 
    }, () => {
      this.setState({ newGameRequested: false })
    });
  };

  render() {
    const { height, width, mines, newGameRequested } = this.state;
    return (
      <div className="game">
        <Board height={height} width={width} mines={mines} newGameRequested={newGameRequested} />
        <LevelSelect handleGameStart={this.handleGameStart} />
        <ThemeSlider></ThemeSlider>
        <div id="gradient-background" className="gradient-background"></div>
      </div>
    );
  }
}

export default App;
