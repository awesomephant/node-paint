import React from 'react'
import Socket from './Socket.js';

export default class NumberNode extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            dragging: false
        }

        this.handleClose = this.handleClose.bind(this)
        this.componentDidUpdate = this.componentDidUpdate.bind(this)
        this.handleDragStart = this.handleDragStart.bind(this)
        this.handleDragEnd = this.handleDragEnd.bind(this)
        this.handleDraftConection = this.handleDraftConection.bind(this)
        this.handleDraftConectionDrop = this.handleDraftConectionDrop.bind(this)

    }

    handleClose(e){
        this.props.removeNode(this.props.id)
    }

    componentDidUpdate(){
        let d = this.props.drawingData.distance;
        if (d !== this.props.outputs[0].value){
            this.props.updateOutput(this.props.id, 0, d)
            this.props.update(this.props.id)
        }
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
            <Socket type={socket.type} key={socket.id} id={socket.id} finishDraftConectionDrop={this.handleDraftConectionDrop} handleDraftConnection={this.handleDraftConection} value={socket.value} label={socket.label}></Socket>
        );

        return (
            <div data-dragging={this.state.dragging} className='node permanent' key={this.props.id} style={nodeCSS}>
                <header onMouseDown={this.handleDragStart} onMouseUp={this.handleDragEnd} className='node-header'>
                    <span>{this.props.title}</span>
                </header>
                <div className='node-body'>
                </div>
                <ul className='node-outputs'>
                    {outputs}
                </ul>
            </div>
        )
    }
}
