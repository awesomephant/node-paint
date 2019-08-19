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

    this.updatePen = this.updatePen.bind(this)
  }

  updatePen(penObject){
    this.setState({
      pen: penObject
    })
  }

  componentWillMount(){
    this.setState({height: window.innerHeight, width: window.innerWidth});  
  }

  render() {
    return (
      <div className="app">
        <NodeContainer updatePen={this.updatePen} width={this.state.width} height={this.state.height * .5}></NodeContainer>
        <div className='divider'></div>
        <Canvas width={this.state.width} height={this.state.height * .5} pen={this.state.pen}></Canvas>
      </div>
    );
  }
}

export default App;
