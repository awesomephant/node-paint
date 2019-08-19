import React from 'react';
import NodeContainer from './NodeContainer';
import Canvas from './Canvas';

import './App.css';

class App extends React.Component {
  
  constructor(props){
    super(props)
    this.state = {
      width: 0,
      height: 0,
      pen: {
        r: 20,
        fill: [123,21,190],
      }
    }
  }
  componentWillMount(){
    this.setState({height: window.innerHeight, width: window.innerWidth});  
  }

  render() {
    return (
      <div className="app">
        <NodeContainer width={this.state.width} height={this.state.height * .5}></NodeContainer>
        <Canvas width={this.state.width} height={this.state.height * .5} pen={this.state.pen}></Canvas>
      </div>
    );
  }
}

export default App;
