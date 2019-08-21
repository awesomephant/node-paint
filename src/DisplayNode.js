import React from 'react'
import Socket from './Socket.js'

export default class DisplayNode extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dragging: false
        }
        this.handleDraftConnectionDrop = this.handleDraftConnectionDrop.bind(this);
        this.handleDragStart = this.handleDragStart.bind(this)
        this.handleDragEnd = this.handleDragEnd.bind(this)
        this.handleClose = this.handleClose.bind(this)
    }

    handleDraftConnectionDrop(socketID) {
        this.props.finishDraftConnection(this.props.id, socketID)
    }
    handleClose() {
        this.props.removeNode(this.props.id)
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
            <Socket handleDraftConnectionDrop={this.handleDraftConnectionDrop} key={socket.id} id={socket.id} value={socket.value} label={socket.label}></Socket>
        );

        return (
            <div data-dragging={this.state.dragging} className='node' key={this.props.id} style={nodeCSS} >
                <header onMouseDown={this.handleDragStart} onMouseUp={this.handleDragEnd} className='node-header'>Display
                <button onClick={this.handleClose} className='node--close'>
                        <svg viewBox="0 0 24 24">
                            <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                        </svg>
                        Close</button>
                </header>
                <ul className='node-inputs'>
                    {inputs}
                </ul>
                <div className='node-body'>
                    <h2>{parseFloat(this.props.inputs[0].value).toFixed(2)}</h2>
                </div>
            </div>
        )
    }
}