import React from 'react';
import NodeContainer from './NodeContainer';

import './App.css';

class App extends React.Component {
  
  constructor(props){
    super(props)
    this.state = {
      width: 0,
      height: 0
    }
  }
  componentWillMount(){
    this.setState({height: window.innerHeight - 50, width: window.innerWidth - 40});  
  }

  render() {
    return (
      <div className="App">
        <NodeContainer width={this.state.width} height={this.state.height}>
        </NodeContainer>
      </div>
    );
  }
}

export default App;
