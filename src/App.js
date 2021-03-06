import React from 'react';
import NodeContainer from './NodeContainer';
import Canvas from './Canvas';

import './App.css';

class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      width: 0,
      height: 0,
      pen: {
        radius: 0,
        fill: [0, 0, 0],
        x: 0,
        y: 0
      },
      drawingData: {
        speed: 0,
        distance: 0,
        area: 0
      }
    }

    this.updatePen = this.updatePen.bind(this)
    this.updateDrawingData = this.updateDrawingData.bind(this)
  }

  updatePen(newPen) {
    this.setState({
      pen: {
        x: newPen.x,
        y: newPen.y,
        radius: newPen.radius,
        fill: newPen.fill
      }
    })
  }
  updateDrawingData(newData) {
    this.setState({
      drawingData: newData
    })
  }

  componentWillMount() {
    this.setState({ height: window.innerHeight, width: window.innerWidth });
  }

  render() {
    return (
      <div className="app">
        <header className='app--header'>
          <h1>Node Paint</h1>
          <a href='https://www.maxkoehler.com/work/node-paint/'>Info</a>
        </header>
        <NodeContainer drawingData={this.state.drawingData} pen={this.state.pen} updatePen={this.updatePen} width={this.state.width * .5} height={this.state.height}></NodeContainer>
        <div className='divider'></div>
        <Canvas drawingData={this.state.drawingData} updateDrawingData={this.updateDrawingData} width={this.state.width / 2} height={this.state.height} pen={this.state.pen}></Canvas>
      </div>
    );
  }
}

export default App;
