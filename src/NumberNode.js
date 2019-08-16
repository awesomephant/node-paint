import React from 'react'
import Socket from './Socket.js';

export default class NumberNode extends React.Component {
    constructor(props) {
        super(props)
        this.handleChange = this.handleChange.bind(this)
    }
    
    handleChange(e) {
        let v = e.target.value
        this.props.updateOutput(this.props.id, 0, v)
        this.props.update(this.props.id)
    }

    render() {
        const nodeCSS = {
            width: `${this.props.width}px`,
            height: `${this.props.height}px`,
            transform: `translateX(${this.props.x}px) translateY(${this.props.y}px)`
        }
        const outputs = this.props.outputs.map((socket) =>
            <Socket key={socket.id} value={socket.value} label={socket.label}></Socket>
        );

        return (
            <div className='node' key={this.props.id} style={nodeCSS}>
                <header className='node-header'>{this.props.title}</header>
                <div className='node-body'>               
                    <input type='number' value={this.props.outputs[0].value} onChange={this.handleChange}></input>
                </div>
                <ul className='node-outputs'>
                    {outputs}
                </ul>
            </div>
        )
    }
}
