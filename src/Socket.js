import React from 'react';

export default class Socket extends React.Component {

  constructor(props){
    super(props)
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e){
  }
  
  render() {
    return (
      <li className='socket'>
        <span onClick={this.handleClick} className='socket--plug'></span>
        <span className='socket--label'>{this.props.label}: {this.props.value}</span>
      </li>
    )
  }
}
