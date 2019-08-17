import React from 'react'
import Socket from './Socket.js';

export default class NumberNode extends React.Component {
    constructor(props) {
        super(props)
        this.handleChange = this.handleChange.bind(this)
        this.handleDraftConection = this.handleDraftConection.bind(this)
        this.handleDraftConectionDrop = this.handleDraftConectionDrop.bind(this)
    }
    
    handleChange(e) {
        let v = e.target.value
        this.props.updateOutput(this.props.id, 0, v)
        this.props.update(this.props.id)
    }

    handleDraftConection(socketID){
        this.props.startDraftConnection(this.props.id, socketID)
    }
    
    handleDraftConectionDrop(socketID){
        this.props.finishDraftConection(this.props.id, socketID)
    }

    render() {
        const nodeCSS = {
            width: `${this.props.width}px`,
            height: `${this.props.height}px`,
            transform: `translateX(${this.props.x}px) translateY(${this.props.y}px)`
        }
        const outputs = this.props.outputs.map((socket) =>
            <Socket key={socket.id} id={socket.id} finishDraftConectionDrop={this.handleDraftConectionDrop} handleDraftConnection={this.handleDraftConection} value={socket.value} label={socket.label}></Socket>
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
