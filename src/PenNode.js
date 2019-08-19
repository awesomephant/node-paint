import React from 'react';
import Socket from './Socket.js'

export default class PenNode extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dragging: false
        }
        this.handleDraftConnectionDrop = this.handleDraftConnectionDrop.bind(this);
        this.handleDragStart = this.handleDragStart.bind(this)
        this.handleDragEnd = this.handleDragEnd.bind(this)
    }

    handleDraftConnectionDrop(socketID) {
        this.props.finishDraftConnection(this.props.id, socketID)
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
    render() {
        const nodeCSS = {
            width: `${this.props.width}px`,
            height: `${this.props.height}px`,
            transform: `translateX(${this.props.x}px) translateY(${this.props.y}px)`
        }
        const inputs = this.props.inputs.map((socket) =>
            <Socket key={socket.id} id={socket.id} handleDraftConnectionDrop={this.handleDraftConnectionDrop} handleDraftConnection={this.handleDraftConnection} value={socket.value} label={socket.label}></Socket>
        );

        return (
            <div data-dragging={this.state.dragging} className='node permanent' key={this.props.id} style={nodeCSS}>
                <header onMouseDown={this.handleDragStart} onMouseUp={this.handleDragEnd} className='node-header'>{this.props.title}</header>
                <div className='node-body'>
                </div>
                <ul className='node-inputs'>
                    {inputs}
                </ul>
            </div>
        )
    }
}
