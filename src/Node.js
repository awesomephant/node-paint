import React from 'react'
import Socket from './Socket.js';

export default class Node extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            dragging: false
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleDragStart = this.handleDragStart.bind(this)
        this.handleDragEnd = this.handleDragEnd.bind(this)
        this.handleDraftConection = this.handleDraftConection.bind(this)
        this.handleDraftConectionDrop = this.handleDraftConectionDrop.bind(this)
    }

    handleChange(e) {
        let v = e.target.value
        this.props.updateOutput(this.props.id, 0, v)
        this.props.update(this.props.id)
    }

    handleDragStart() {
        this.setState({
            dragging: true
        })
        this.props.handleDragStart(this.props.id)
    }
    handleDragEnd() {
        this.setState({
            dragging: false
        })
        this.props.handleDragEnd(this.props.id)
    }

    handleDraftConection(socketID) {
        this.props.startDraftConnection(this.props.id, socketID)
    }

    handleDraftConectionDrop(socketID) {
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
            <div data-dragging={this.state.dragging} className='node' key={this.props.id} style={nodeCSS}>
                <header onMouseDown={this.handleDragStart} onMouseUp={this.handleDragEnd} className='node-header'>
                    <span>{this.props.title}</span>
                    <button className='node--close'>
                        <svg viewBox="0 0 24 24">
                            <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                        </svg>
                    Close</button>
                </header>
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
