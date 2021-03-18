import * as  equal from 'fast-deep-equal';
import React from 'react'
import Socket from './Socket.js';
import * as utils from './utils.js';
import './css/RampNode.css'

export default class NumberNode extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            dragging: false,  // should be a prop
            draggingStopIndex: null,
            cachedValue: [0, 0, 0],
            stops: [
                { position: 0.0, color: '#ff3300', picker: React.createRef() },
                { position: 1.0, color: '#aabbcc', picker: React.createRef() }
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
        this.handleStopColorChange = this.handleStopColorChange.bind(this)
        this.handleStopMouseDown = this.handleStopMouseDown.bind(this)
        this.handleStopMouseUp = this.handleStopMouseUp.bind(this)
        this.handleStopDrag = this.handleStopDrag.bind(this)
        this.addStop = this.addStop.bind(this)
        this.removeStop = this.removeStop.bind(this)
        this.triggerColorPicker = this.triggerColorPicker.bind(this)

        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentDidUpdate = this.componentDidUpdate.bind(this);
    }

    handleClose() {
        this.props.removeNode(this.props.id)
    }

    handleChange() {
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

        let v = this.props.inputs[0].value;

        if (v < 0) {
            v = 0
        } else if (v > 1) {
            v = 1
        };


        this.c.fillRect(v * this.c.canvas.width, 12, 1, this.c.canvas.height);
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

    handleStopColorChange(e) {
        let index = e.target.dataset.index;
        let value = e.target.value;
        this.setState((prevState) => {
            prevState.stops[index].color = value
            return prevState;
        })
    }
    handleStopMouseDown(e, index) {
        e.stopPropagation();
        this.setState({ draggingStopIndex: index })
    }
    handleStopMouseUp(e) {
        e.stopPropagation();
        this.setState({ draggingStopIndex: null })
    }

    addStop(e) {
        let x = (e.clientX - this.props.x - 14) / (this.c.canvas.width - 12);
        let imageData = this.c.getImageData(x, 1, 1, 1).data;
        let c = utils.rgbToHex([imageData[0], imageData[1], imageData[2]])
        if (x > 1) { x = 1 }
        if (x < 0) { x = 0 }

        this.setState((prevState) => {
            prevState.stops.push({ position: x, color: c, picker: React.createRef() })
            return prevState;
        })
    }

    triggerColorPicker(e, index) {
        e.stopPropagation()
        this.state.stops[index].picker.current.click()
    }

    removeStop(e, index) {
        e.stopPropagation();
        this.setState((prevState) => {
            prevState.stops.splice(index, 1)
            return prevState;
        })
    }

    handleStopDrag(e) {
        let x = (e.clientX - this.props.x - 14) / (this.c.canvas.width - 12);
        if (x > 1) { x = 1 }
        if (x < 0) { x = 0 }
        if (this.state.draggingStopIndex !== null) {
            this.setState((prevState) => {
                prevState.stops[this.state.draggingStopIndex].position = x;
                return prevState;
            })
        }
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
    componentWillUnmount() {
        this.props.removeNode(this.props.id)
    }

    componentDidUpdate(prevProps, prevState) {
        this.drawGradient()
        let outputValue = this.solve();
        if (utils.compareArrays(this.props.outputs[0].value, outputValue) === false) {
            this.props.updateOutput(this.props.id, 0, outputValue)
            this.props.updateNodes(this.props.id);
        }
    }
    handleInputMouseUp(e) {
        e.preventDefault();
    }

    solve() {
        let v = this.props.inputs[0].value;
        if (v > 1) { v = 1 };
        if (v < 0) { v = 0 };

        let x = (v * this.c.canvas.width)
        let imageData = this.c.getImageData(x, 1, 1, 1).data;
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
        const stops = this.state.stops.map((stop, index) => {
            let stopCSS = {
                left: `${stop.position * 100}%`,
            }
            let indicatorCSS = {
                background: `${stop.color}`,
            }

            return (
                <li key={index} style={stopCSS} className='gradient--stop ' data-dragging={stop.dragging}>
                    <div onMouseDown={(e) => { this.handleStopMouseDown(e, index) }} onMouseUp={(e) => { this.handleStopMouseUp(e) }} onClick={(e) => { e.stopPropagation() }} style={indicatorCSS} data-index={index} className='stop--indicator'></div>
                    <div className='stop--controls'>
                        <button onClick={(e) => { this.triggerColorPicker(e, index) }} className='stop--edit'>
                            <svg viewBox="0 0 24 24">
                                <path fill="#000000" d="M20.71,4.04C21.1,3.65 21.1,3 20.71,2.63L18.37,0.29C18,-0.1 17.35,-0.1 16.96,0.29L15,2.25L18.75,6M17.75,7L14,3.25L4,13.25V17H7.75L17.75,7Z" />
                            </svg>
                        </button>
                        <button className='stop--remove' onClick={(e) => this.removeStop(e, index)}>
                            <svg viewBox="0 0 24 24">
                                <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                            </svg>
                        </button>
                    </div>
                    <input onClick={(e) => { e.stopPropagation() }} ref={stop.picker} type='color' data-index={index} value={stop.color} onChange={this.handleStopColorChange}></input>
                </li>
            )
        });

        return (
            <div onMouseUp={this.handleStopMouseUp} data-dragging={this.state.dragging} className='node' key={this.props.id} style={nodeCSS}>
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
                        <canvas ref={this.canvasRef} width={this.props.width - 20 + 'px'} height='80' className='gradient--canvas'></canvas>
                        <ul className='gradient--stops' onClick={this.addStop} onMouseMove={this.handleStopDrag}>
                            {stops}
                        </ul>
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
