import React from 'react';

export default class Socket extends React.Component {

  constructor(props) {
    super(props)
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseDp = this.handleMouseUp.bind(this);
  }

  handleMouseDown(e) {
    this.props.handleDraftConnection(this.props.id);
  }
  
  handleMouseUp(e) {
    this.props.handleDraftConnectionDrop(this.props.id);
  }

  render() {
    return (
      <li className='socket'>
        <span onMouseDown={this.handleMouseDown} onMouseUp={this.handleMouseDp} className='socket--plug'></span>
        <span className='socket--label'>{this.props.label}: {this.props.value}</span>
      </li>
    )
  }
}
