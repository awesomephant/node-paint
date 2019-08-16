import React from 'react';

export default class Socket extends React.Component {

  render() {
    return (
      <li className='socket'>
        <span className='socket--plug'></span>
        <span className='socket--label'>{this.props.label}: {this.props.value}</span>
      </li>
    )
  }
}
