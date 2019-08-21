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
        this.componentDidUpdate = this.componentDidUpdate.bind(this)
        this.solve = this.solve.bind(this)
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
    solve() {
        let r = this.props.inputs[0].value
        if (r < 0){r = 0}
        let newPen = {
            radius: r,
            fill: this.props.inputs[1].value
        };
        return newPen;
    }
    componentDidUpdate() {
        let newPen = this.solve();
        if (this.props.pen.radius !== newPen.radius ||
            this.props.pen.fill !== newPen.fill) {
            this.props.updatePen(newPen)
        }
    }
    render() {
        const nodeCSS = {
            width: `${this.props.width}px`,
            height: `${this.props.height}px`,
            transform: `translateX(${this.props.x}px) translateY(${this.props.y}px)`
        }
        const inputs = this.props.inputs.map((socket) =>
            <Socket type={socket.type} key={socket.id} id={socket.id} handleDraftConnectionDrop={this.handleDraftConnectionDrop} handleDraftConnection={this.handleDraftConnection} value={socket.value} label={socket.label}></Socket>
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
