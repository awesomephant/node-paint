import React from 'react'
import Socket from './Socket.js';

export default class NumberNode extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            dragging: false,
            operation: 'sine'
        }

        this.canvasRef = React.createRef();
        this.c = null;

        this.handleClose = this.handleClose.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleDragStart = this.handleDragStart.bind(this)
        this.handleDragEnd = this.handleDragEnd.bind(this)
        this.handleSelect = this.handleSelect.bind(this)
        this.handleDraftConection = this.handleDraftConection.bind(this)
        this.handleDraftConectionDrop = this.handleDraftConectionDrop.bind(this)
        this.solve = this.solve.bind(this);
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

    handleDraftConection(socketID) {
        this.props.startDraftConnection(this.props.id, socketID)
    }

    handleDraftConectionDrop(socketID) {
        this.props.finishDraftConection(this.props.id, socketID)
    }

    componentDidMount() {
        this.c = this.canvasRef.current.getContext('2d')
        this.drawWave();
    }

    componentDidUpdate() {
//        this.drawWave()
    }

    sgn(n){
        if (n > 0){return 1}
        if (n === 0){return 0}
        if (n < 0){return -1}
    }

    solve(t) {
        // let a = this.props.inputs[0].value;
        // let f = this.props.inputs[1].value;
        // let ro = this.props.inputs[2].value;
        let a = 30;
        let f = 1;
        let ro = 0;

        if (this.state.operation === 'sine') {
            return a * Math.sin((2 * Math.PI) * f * t + ro);
        }
        
        if (this.state.operation === 'triangle') {
            return a * Math.sin((2 * Math.PI) * f * t + ro);
        }
        if (this.state.operation === 'square') {
            return a * this.sgn(Math.sin((2 * Math.PI) * f * t + ro));
        }
        if (this.state.operation === 'sawtooth') {
            return a * Math.sin((2 * Math.PI) * f * t + ro);
        }
        
    }

    drawWave() {
        this.c.fillStyle = 'lightgray';
        for (let i = 0; i < 15; i++) { this.c.fillRect(20 * i + 15, 0, 1, this.props.height) }
        for (let i = 0; i < 15; i++) { this.c.fillRect(0, 20 * i + 15, this.props.width, 1) }


        let points = [[0, 60]];
        const resolution = .01;

        this.c.moveTo(points[0][0], points[0][1])
        
        for (let x = 0; x < 10; x += resolution){
            
            let y = this.solve(x);          
            this.c.lineTo(x * 100, y + 60)
        }
        this.c.lineWidth = 1.5;
        this.c.stroke();
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
            <Socket key={socket.id} id={socket.id} finishDraftConectionDrop={this.handleDraftConectionDrop} handleDraftConnection={this.handleDraftConection} value={socket.value} label={socket.label}></Socket>
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
