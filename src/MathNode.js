// This is called Math but it just adds two inputs
import React from 'react'
import Socket from './Socket.js';

export default class MathNode extends React.Component {
    constructor(props) {
        super(props)
        this.solve = this.solve.bind(this)
        this.componentDidUpdate = this.componentDidUpdate.bind(this)
        this.handleSelect = this.handleSelect.bind(this)

        this.state = {
            operation: 'add'
        }

    }
    solve() {
        let a = parseFloat(this.props.inputs[0].value);
        let b = parseFloat(this.props.inputs[1].value);
        let result = 0;

        if (this.state.operation === 'add') { result = a + b; }
        if (this.state.operation === 'subtract') { result = a - b; }
        if (this.state.operation === 'multiply') { result = a * b; }
        if (this.state.operation === 'diviide') { result = a / b; }

        return result;
    }

    handleSelect(e) {
        this.setState({ operation: e.target.value })
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
            <Socket key={socket.id} id={socket.id} value={socket.value} label={socket.label}></Socket>
        );
        const outputs = this.props.outputs.map((socket) =>
            <Socket key={socket.id} id={socket.id} value={socket.value} label={socket.label}></Socket>
        );
        return (
            <div className='node' style={nodeCSS}>
                <header className='node-header'>Math</header>
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
