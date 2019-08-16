import React from 'react';
 
export default class NumberField extends React.Component {
    constructor(props){
      super(props)
      this.handleChange = this.handleChange.bind(this);
    }
  
    handleChange(e) {
      this.props.handleChange(e.target.value);
    }
  
    render(){
      return(
        <input type='number' value={this.props.value} onChange={this.handleChange}></input>
      )
    }
  }
  