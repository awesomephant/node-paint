import React from 'react'
import Socket from './Socket.js';
import * as utils from './utils.js';

export default class NumberNode extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            dragging: false
        }
        this.handleClose = this.handleClose.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleDragStart = this.handleDragStart.bind(this)
        this.handleDragEnd = this.handleDragEnd.bind(this)
        this.handleDraftConnection = this.handleDraftConnection.bind(this)
        this.handleDraftConnectionDrop = this.handleDraftConnectionDrop.bind(this)
        this.formatOutput = this.formatOutput.bind(this)
    }

    handleClose(e) {
        this.props.removeNode(this.props.id)
    }

    handleChange(e) {
        let v = e.target.value;
        let _rgb = utils.hexToRGB(v);
        let rgb = [_rgb.r, _rgb.g, _rgb.b]
        this.props.updateOutput(this.props.id, 0, rgb)
        this.props.update(this.props.id)
    }

    handleDragStart() {
        this.setState({
            dragging: true
        })
        this.props.handleDragStart(this.props.id)
    }
    componentDidUpdate(prevProps) {
    }
    handleDragEnd() {
        this.setState({
            dragging: false
        })
        this.props.handleDragEnd(this.props.id)
    }

    handleDraftConnection(socketID) {
        this.props.startDraftConnection(this.props.id, socketID)
    }

    handleDraftConnectionDrop(socketID) {
        this.props.finishDraftConnection(this.props.id, socketID)
    }

    formatOutput(){
        let hex = utils.rgbToHex(this.props.outputs[0].value)
        console.log(hex)
        return hex
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
        const outputs = this.props.outputs.map((socket) =>
            <Socket type={socket.type} key={socket.id} id={socket.id} finishDraftConnectionDrop={this.handleDraftConnectionDrop} handleDraftConnection={this.handleDraftConnection} value={socket.value} label={socket.label}></Socket>
        );

        return (
            <div data-dragging={this.state.dragging} className='node' key={this.props.id} style={nodeCSS}>
                <header onMouseDown={this.handleDragStart} onMouseUp={this.handleDragEnd} className='node-header'>
                    <span>{this.props.title}</span>
                    <button onClick={this.handleClose} className='node--close'>
                        <svg viewBox="0 0 24 24">
                            <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                        </svg>
                        Close</button>
                </header>
                <div className='node-body'>
                    <input type='color' onChange={this.handleChange} value={this.formatOutput()}></input>
                </div>
                <ul className='node-inputs'>
                    {inputs}
                </ul>
                <ul className='node-outputs'>
                    {outputs}
                </ul>
            </div>
        )
    }
}
