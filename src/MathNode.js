// This is called Math but it just adds two inputs
import React from 'react'
import Socket from './Socket.js';

export default class MathNode extends React.Component {
    constructor(props) {
        super(props)

        this.solve = this.solve.bind(this)
        this.componentDidUpdate = this.componentDidUpdate.bind(this)
        this.handleSelect = this.handleSelect.bind(this)
        this.handleDraftConnection = this.handleDraftConnection.bind(this)
        this.handleDraftConnectionDrop = this.handleDraftConnectionDrop.bind(this)
        this.handleDragStart = this.handleDragStart.bind(this)
        this.handleDragEnd = this.handleDragEnd.bind(this)

        this.state = {
            operation: 'add'
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

    solve() {
        let a = parseFloat(this.props.inputs[0].value);
        let b = parseFloat(this.props.inputs[1].value);
        let result = 0;

        if (this.state.operation === 'add') { result = a + b; }
        if (this.state.operation === 'subtract') { result = a - b; }
        if (this.state.operation === 'multiply') { result = a * b; }
        if (this.state.operation === 'divide' && b !== 0) { result = a / b; }

        return result;
    }

    handleSelect(e) {
        this.setState({ operation: e.target.value })
    }

    handleDraftConnection(socketID) {
        this.props.startDraftConnection(this.props.id, socketID)
    }

    handleDraftConnectionDrop(socketID) {
        this.props.finishDraftConnection(this.props.id, socketID)
    }

    componentDidUpdate(prevProps) {
        let outputValue = this.solve();
        if (this.props.outputs[0].value !== outputValue) {
            this.props.updateOutput(this.props.id, 0, outputValue)
            this.props.updateNodes(this.props.id);
        }
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
            <Socket key={socket.id} id={socket.id} finishDraftConectionDrop={this.handleDraftConectionDrop} handleDraftConnection={this.handleDraftConnection} value={socket.value} label={socket.label}></Socket>
        );
        return (
            <div data-dragging={this.state.dragging} className='node' style={nodeCSS}>
                <header onMouseDown={this.handleDragStart} onMouseUp={this.handleDragEnd} className='node-header'>Math</header>
                <div className='node-body'>
                    <select value={this.state.operation} onChange={this.handleSelect}>
                        <option value='add'>Add</option>
                        <option value='subtract'>Subtract</option>
                        <option value='multiply'>Multiply</option>
                        <option value='divide'>Divide</option>
                    </select>
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
