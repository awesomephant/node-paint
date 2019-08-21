import React from 'react'
import Socket from './Socket.js';

export default class NumberNode extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            dragging: false,
            operation: 'sine'
        }

        this.c = null;
        this.canvasRef = React.createRef();

        this.handleClose = this.handleClose.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleDragStart = this.handleDragStart.bind(this)
        this.handleDragEnd = this.handleDragEnd.bind(this)
        this.handleSelect = this.handleSelect.bind(this)
        this.handleDraftConnection = this.handleDraftConnection.bind(this)
        this.handleDraftConnectionDrop = this.handleDraftConnectionDrop.bind(this)
        this.solve = this.solve.bind(this);
        this.drawWave = this.drawWave.bind(this)

        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentDidUpdate = this.componentDidUpdate.bind(this);
    }

    handleClose(e) {
        this.props.removeNode(this.props.id)
    }

    handleSelect(e) {
        this.setState({ operation: e.target.value })
    }

    handleChange(e) {
        let v = this.solve()
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

    handleDraftConnection(socketID) {
        this.props.startDraftConnection(this.props.id, socketID)
    }

    handleDraftConnectionDrop(socketID) {
        this.props.finishDraftConnection(this.props.id, socketID)
    }

    componentDidMount() {
        this.c = this.canvasRef.current.getContext('2d')
        this.c.fillCircle = function (x, y, r) {
            this.beginPath();
            this.arc(x, y, r, 0, 2 * Math.PI, false);
            this.fill();
        };
    }

    componentDidUpdate() {
        this.drawWave()
        //        let outputValue = this.solve(this.c.canvas.width / 2);
        let outputValue = this.solve(this.c.canvas.width / 2);
        if (this.props.outputs[0].value !== outputValue) {
            this.props.updateOutput(this.props.id, 0, outputValue)
            this.props.updateNodes(this.props.id);
        }
    }

    sgn(n) {
        if (n > 0) { return 1 }
        if (n === 0) { return 0 }
        if (n < 0) { return -1 }
    }

    solve(t) {
        let a = this.props.inputs[0].value;
        let f = this.props.inputs[1].value;
        let ro = this.props.inputs[2].value;
        let p = 1 / f;

        function cotan(x) { return 1 / Math.tan(x); }
        if (this.state.operation === 'sine') {
            return a * Math.sin((2 * Math.PI) * f * t + ro);
        }

        if (this.state.operation === 'triangle') {
            a *= .65;
            return a * Math.asin(Math.sin(((2 * Math.PI) / p) * t + ro));
        }
        if (this.state.operation === 'square') {
            return a * this.sgn(Math.sin((2 * Math.PI) * f * t + ro));
        }
        if (this.state.operation === 'sawtooth') {
            return (-2 * a) / Math.PI * Math.atan(cotan((t * Math.PI) / p + ro / 2));
        }

    }

    drawWave() {
        const resolution = .1;

        this.c.clearRect(0, 0, this.c.canvas.width, this.c.canvas.height)
        this.c.fillStyle = 'lightgray';
        for (let i = 0; i < 15; i++) { this.c.fillRect(20 * i + 15, 0, 1, this.props.height) }
        for (let i = 0; i < 15; i++) { this.c.fillRect(0, 20 * i + 15, this.props.width, 1) }

        this.c.fillStyle = 'black';

        this.c.fillCircle(this.c.canvas.width / 2, this.solve(this.c.canvas.width / 2) * -1 + 60, 3)
        this.c.fillRect(0, 60, this.c.canvas.width, 1)

        this.c.beginPath();
        this.c.moveTo(0, 60)

        for (let x = 0; x < this.c.canvas.width; x += resolution) {
            let y = this.solve(x) * -1;
            this.c.lineTo(x, y + 60)
        }
        this.c.lineWidth = 1.5;
        this.c.stroke();
        this.c.closePath()
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
            <Socket key={socket.id} id={socket.id} finishDraftConnectionDrop={this.handleDraftConnectionDrop} handleDraftConnection={this.handleDraftConnection} value={socket.value} label={socket.label}></Socket>
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
                    <canvas ref={this.canvasRef} height={this.props.height - 140} width={this.props.width - 20}>
                    </canvas>
                    <select value={this.state.operation} onChange={this.handleSelect}>
                        <option value='sine'>Sine</option>
                        <option value='square'>Square</option>
                        <option value='triangle'>Triangle</option>
                        <option value='sawtooth'>Sawtooth</option>
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
