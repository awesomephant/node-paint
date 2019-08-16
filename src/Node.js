import React from 'react'
import NumberNode from './NumberNode';
import MathNode from './MathNode';

export default class Node extends React.Component{
    render(){
        if (this.props.type === 'Number'){
            return (<NumberNode x={this.props.x} y={this.props.y} title={this.props.title}></NumberNode>)
        } else if (this.props.type === 'Math'){
            return (<MathNode x={this.props.x} y={this.props.y} title={this.props.title}></MathNode>)
        }
    }
}