import React from 'react'
import Socket from './Socket.js';
import * as utils from './utils.js';

export default class NumberNode extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            dragging: false,
            stops: [
                { position: 0.0, color: 'red' },
                { position: 0.3, color: 'pink' },
                { position: 1.0, color: 'green' }
            ]
        }

        this.c = null;
        this.canvasRef = React.createRef();

        this.handleClose = this.handleClose.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleDragStart = this.handleDragStart.bind(this)
        this.handleDragEnd = this.handleDragEnd.bind(this)
        this.handleDraftConnection = this.handleDraftConnection.bind(this)
        this.handleDraftConnectionDrop = this.handleDraftConnectionDrop.bind(this)
        this.solve = this.solve.bind(this);

        this.drawGradient = this.drawGradient.bind(this)

        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentDidUpdate = this.componentDidUpdate.bind(this);
    }

    handleClose(e) {
        this.props.removeNode(this.props.id)
    }

    handleChange(e) {
        let v = this.solve()
        this.props.updateOutput(this.props.id, 0, v)
        this.props.update(this.props.id)
    }

    drawGradient() {
        let gradient = this.c.createLinearGradient(0, 0, this.props.width - 20, 0);

        this.state.stops.forEach((stop) => {
            gradient.addColorStop(stop.position, stop.color);
        })

        this.c.fillStyle = gradient;
        this.c.fillRect(0, 0, this.c.canvas.width, this.c.canvas.height);
        this.c.fillStyle = 'black';
        this.c.fillRect(this.props.inputs[0].value * this.c.canvas.width, 0, 1, this.c.canvas.height);
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
    }
    componentWillUnmount(){
        this.props.removeNode(this.props.id)
    }

    componentDidUpdate() {
        this.drawGradient()
        let outputValue = this.solve();

        if (utils.compareArrays(this.props.outputs[0].value, outputValue) === false) {
            this.props.updateOutput(this.props.id, 0, outputValue)
            this.props.updateNodes(this.props.id);
        }
    }

    solve() {
        let x = (this.props.inputs[0].value * this.c.canvas.width) + 3
        let imageData = this.c.getImageData(x, 10, 1, 1).data;
        return [imageData[0], imageData[1], imageData[2]]
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
            <Socket key={socket.id} id={socket.id} finishDraftConnectionDrop={this.handleDraftConnectionDrop} handleDraftConnection={this.handleDraftConnection} value={socket.value} type={socket.type} label={socket.label}></Socket>
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
                    <div className='gradient'>
                        <canvas ref={this.canvasRef} height='80' className='gradient--canvas'></canvas>
                    </div>
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
