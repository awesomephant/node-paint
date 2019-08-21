import React from 'react'
import * as utils from './utils.js';
import NumberNode from './NumberNode.js'
import DisplayNode from './DisplayNode.js'
import MathNode from './MathNode.js'
import PenNode from './PenNode'
import DataNode from './DataNode.js'
import RGBNode from './RGBNode.js'
import WaveNode from './WaveNode.js'

import Connection from './Connection.js'
import testState from './testState.js'
import ContextMenu from './ContextMenu.js'
import makeNode from './makeNode.js'

export default class NodeContainer extends React.Component {
    constructor(props) {
        super(props)

        this.updateNodes = this.updateNodes.bind(this)
        this.getNodeByID = this.getNodeByID.bind(this)
        this.updateOutput = this.updateOutput.bind(this)
        this.addNode = this.addNode.bind(this)
        this.removeNode = this.removeNode.bind(this)
        this.handleMouseMove = this.handleMouseMove.bind(this)
        this.handleContextMenu = this.handleContextMenu.bind(this)
        this.startDraftConnection = this.startDraftConnection.bind(this)
        this.finishDraftConnection = this.finishDraftConnection.bind(this)
        this.handleMouseUp = this.handleMouseUp.bind(this)
        this.handleDragStart = this.handleDragStart.bind(this)
        this.handleDragEnd = this.handleDragEnd.bind(this)
        this.componentDidMount = this.componentDidMount.bind(this)
        this.state = testState;
    }

    componentDidMount() {
        this.setState((prevState) => {
            prevState.nodes.push(makeNode('wave', 300, 400))
            return prevState;
        })
    }

    addNode(type) {
        this.setState((prevState) => {
            prevState.nodes.push(makeNode(type, this.state.contextMenu.x, this.state.contextMenu.y))
            prevState.contextMenu.isOpen = false;
            return prevState;
        })
    }
    removeNode(nodeID) {
        let index = this.getNodeByID(nodeID);

        this.setState((prevState) => {
            // Find affected connections and remove them
            prevState.connections = prevState.connections.filter(c => {
                if (c.from.nodeID === nodeID || c.to.nodeID === nodeID) {
                    return false
                }
                return true;
            })

            prevState.nodes.splice(index, 1)
            return prevState;
        })

    }
    startDraftConnection(nodeID, socket) {
        this.setState({
            draftConnection: {
                isActive: true,
                from: { nodeID: nodeID, socket: socket }
            }
        })
    }

    isConnectionValid(proposedConnection) {
        return true;
    }

    finishDraftConnection(nodeID, socket) {
        let proposedConnection = {
            from: { nodeID: this.state.draftConnection.from.nodeID, socket: this.state.draftConnection.from.socket },
            to: { nodeID: nodeID, socket: socket },
            id: Math.random()
        }
        if (this.isConnectionValid(proposedConnection)) {
            this.setState((prevState) => {
                // Clear any previous connections
                for (let i = 0; i < this.state.connections.length; i++) {
                    let c = this.state.connections[i];
                    if (c.to.nodeID === proposedConnection.to.nodeID &&
                        c.to.socket === proposedConnection.to.socket) {
                        prevState.connections.splice(i, 1);
                        break;
                    }
                }
                prevState.connections.push(proposedConnection)
                return prevState;
            }, () => this.updateNodes(proposedConnection.from.nodeID))
            // updateNodes() in a callback because setState() is async

        }
    }

    handleDragStart(nodeID) {
        let dragIndex = this.getNodeByID(nodeID);
        this.setState({
            drag: {
                isActive: true,
                nodeIndex: dragIndex
            }
        })
    }
    handleDragEnd() {
        this.setState({
            drag: {
                isActive: false,
                nodeIndex: null
            }
        })
    }

    handleMouseMove(e) {
        let deltaX = e.clientX - this.state.mouse.x;
        let deltaY = e.clientY - this.state.mouse.y;
        this.setState({
            mouse: {
                x: e.clientX,
                y: e.clientY,
                deltaX: deltaX,
                deltaY: deltaY,
            }
        }, function () {

            if (utils.distance(this.state.mouse.x, this.state.mouse.y, this.state.contextMenu.x, this.state.contextMenu.y) > 200 && this.state.contextMenu.isOpen === true) {
                this.setState({ contextMenu: { isActive: false } })
            }

            if (this.state.drag.isActive) {
                this.setState((prevState) => {
                    prevState.nodes[this.state.drag.nodeIndex].x += this.state.mouse.deltaX
                    prevState.nodes[this.state.drag.nodeIndex].y += this.state.mouse.deltaY
                    return prevState;
                })
            }

        })
    }

    handleMouseUp(e) {
        if (this.state.draftConnection.isActive === true) {
            this.setState({
                draftConnection: { isActive: false }
            })
        }

        if (this.state.drag.isActive === true) {
            this.setState({
                drag: { isActive: false }
            })
        }
    }

    handleContextMenu(e) {
        e.preventDefault()
        this.setState({
            contextMenu: {
                isOpen: true,
                x: e.clientX,
                y: e.clientY
            }
        })
    }

    getNodeByID(id) {
        for (let i = 0; i < this.state.nodes.length; i++) {
            if (this.state.nodes[i].id === id) {
                return i;
            }
        }
        console.error(`Node with ID ${id} could not be found.`)
        return false;
    }

    updateOutput(nodeID, outputIndex, newValue) {
        const nodeIndex = this.getNodeByID(nodeID);
        this.setState((prevState) => {
            prevState.nodes[nodeIndex].outputs[outputIndex].value = newValue;
            return prevState;
        })
    }
    updateNodes(id) {

        // We're going top-down
        // Find every node that's connected to this one's outputs
        // We're passing the origin node.
        // Then all subsequent nodes call this method themselves 

        //console.log(`Running update from node ID ${id}.`);

        let relevantConnections = []
        for (let i = 0; i < this.state.connections.length; i++) {
            let c = this.state.connections[i];
            if (c.from.nodeID === id) {
                relevantConnections.push(c)
            }
        }

        //console.log(`Found ${relevantConnections.length} subsequent nodes.`);
        for (let i = 0; i < relevantConnections.length; i++) {

            const rc = relevantConnections[i];
            const toIndex = this.getNodeByID(rc.to.nodeID);
            const fromIndex = this.getNodeByID(rc.from.nodeID);

            this.setState((prevState) => {
                prevState.nodes[toIndex].inputs[rc.to.socket].value = prevState.nodes[fromIndex].outputs[rc.from.socket].value;
                return prevState;
            })
        }
    }

    render() {
        const connectionItems = this.state.connections.map(function (c) {
            let toIndex = this.getNodeByID(c.to.nodeID)
            let fromIndex = this.getNodeByID(c.from.nodeID)
            let x1 = this.state.nodes[fromIndex].x + this.state.nodes[fromIndex].width;
            let y1 = (this.state.nodes[fromIndex].y + this.state.nodes[fromIndex].height) - ((this.state.nodes[fromIndex].outputs.length - c.from.socket) * 17);

            let x2 = this.state.nodes[toIndex].x;
            let y2 = (this.state.nodes[toIndex].y + this.state.nodes[toIndex].height) - ((this.state.nodes[toIndex].inputs.length - c.to.socket) * 17);

            return (<Connection key={c.id} x1={x1} y1={y1} x2={x2} y2={y2}></Connection>)
        }, this)

        const nodeItems = this.state.nodes.map(function (node) {
            if (node.type === 'number') {
                return <NumberNode removeNode={this.removeNode} handleDragStart={this.handleDragStart} handleDragEnd={this.handleDragEnd} finishDraftConnection={this.finishDraftConnection} startDraftConnection={this.startDraftConnection} updateOutput={this.updateOutput} update={this.updateNodes} outputs={node.outputs} width={node.width} height={node.height} x={node.x} y={node.y} key={node.id} id={node.id} title={node.title}></NumberNode>
            } else if (node.type === 'data') {
                return <DataNode drawingData={this.props.drawingData} handleDragStart={this.handleDragStart} handleDragEnd={this.handleDragEnd} finishDraftConnection={this.finishDraftConnection} startDraftConnection={this.startDraftConnection} outputs={node.outputs} update={this.updateNodes} updateOutput={this.updateOutput} width={node.width} height={node.height} x={node.x} y={node.y} key={node.id} id={node.id} title={node.title}></DataNode>

            } else if (node.type === 'display') {
                return <DisplayNode removeNode={this.removeNode} handleDragStart={this.handleDragStart} handleDragEnd={this.handleDragEnd} finishDraftConnection={this.finishDraftConnection} startDraftConnection={this.startDraftConnection} inputs={node.inputs} update={this.updateNodes} width={node.width} height={node.height} x={node.x} y={node.y} key={node.id} id={node.id} title={node.title}></DisplayNode>
            } else if (node.type === 'math') {
                return <MathNode removeNode={this.removeNode} handleDragStart={this.handleDragStart} handleDragEnd={this.handleDragEnd} finishDraftConnection={this.finishDraftConnection} startDraftConnection={this.startDraftConnection} inputs={node.inputs} outputs={node.outputs} updateOutput={this.updateOutput} updateNodes={this.updateNodes} width={node.width} height={node.height} x={node.x} y={node.y} id={node.id} key={node.id} title={node.title}></MathNode>
            } else if (node.type === 'pen') {
                return <PenNode pen={this.props.pen} updatePen={this.props.updatePen} handleDragStart={this.handleDragStart} handleDragEnd={this.handleDragEnd} finishDraftConnection={this.finishDraftConnection} startDraftConnection={this.startDraftConnection} updateOutput={this.updateOutput} update={this.updateNodes} inputs={node.inputs} outputs={node.outputs} width={node.width} height={node.height} x={node.x} y={node.y} key={node.id} id={node.id} title={node.title}></PenNode>
            } else if (node.type === 'rgb') {
                return <RGBNode removeNode={this.removeNode} handleDragStart={this.handleDragStart} handleDragEnd={this.handleDragEnd} finishDraftConnection={this.finishDraftConnection} startDraftConnection={this.startDraftConnection} updateNodes={this.updateNodes} updateOutput={this.updateOutput} update={this.updateNodes} outputs={node.outputs} inputs={node.inputs} width={node.width} height={node.height} x={node.x} y={node.y} key={node.id} id={node.id} title={node.title}></RGBNode>
            } else if (node.type === 'wave') {
                return <WaveNode removeNode={this.removeNode} handleDragStart={this.handleDragStart} handleDragEnd={this.handleDragEnd} finishDraftConnection={this.finishDraftConnection} startDraftConnection={this.startDraftConnection} updateNodes={this.updateNodes} updateOutput={this.updateOutput} update={this.updateNodes} outputs={node.outputs} inputs={node.inputs} width={node.width} height={node.height} x={node.x} y={node.y} key={node.id} id={node.id} title={node.title}></WaveNode>
            }
            return false;
        }, this);

        let contextMenu = '';
        if (this.state.contextMenu.isOpen) {
            contextMenu = <ContextMenu addNode={this.addNode} x={this.state.contextMenu.x} y={this.state.contextMenu.y}></ContextMenu>
        }

        let draftConnection = '';
        if (this.state.draftConnection.isActive) {
            let fromNode = this.state.nodes[this.getNodeByID(this.state.draftConnection.from.nodeID)]
            let x1 = fromNode.x + fromNode.width;
            let y1 = fromNode.y + fromNode.height - ((fromNode.outputs.length - this.state.draftConnection.from.socket) * 17);
            draftConnection = <Connection key={0} x1={x1} y1={y1} x2={this.state.mouse.x} y2={this.state.mouse.y}></Connection>
        }

        return (
            <div className='nodeContainer' onMouseUp={this.handleMouseUp} onMouseMove={this.handleMouseMove} onContextMenu={this.handleContextMenu}>
                < svg width={this.props.width + 'px'} height={this.props.height + 'px'} >
                    {connectionItems}
                    {draftConnection}
                </svg>
                {contextMenu}
                {nodeItems}
            </div >
        )
    }
}