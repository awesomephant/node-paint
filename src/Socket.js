import React from 'react';

export default class Socket extends React.Component {

  constructor(props) {
    super(props)
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseDp = this.handleMouseUp.bind(this);
    this.formatValue = this.formatValue.bind(this)
  }

  formatValue(){
    if (this.props.type !== 'color' && isNaN(this.props.value) === false){
      return (parseFloat(this.props.value).toFixed(1))
    }
  }

  handleMouseDown(e) {
    this.props.handleDraftConnection(this.props.id);
  }
  
  handleMouseUp(e) {
    this.props.handleDraftConnectionDrop(this.props.id);
  }

  render() {
    return (
      <li className='socket' data-type={this.props.type}>
        <span onMouseDown={this.handleMouseDown} onMouseUp={this.handleMouseDp} className='socket--plug'></span>
        <span className='socket--label'>{this.props.label}: {this.formatValue()}</span>
      </li>
    )
  }
}
