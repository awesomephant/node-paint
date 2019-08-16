import React from 'react'
import NumberNode from './NumberNode.js'
import DisplayNode from './DisplayNode.js'
import MathNode from './MathNode.js'
import Connection from './Connection.js'


export default class NodeContainer extends React.Component {
    constructor(props) {
        super(props)

        this.updateNodes = this.updateNodes.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.getNodeByID = this.getNodeByID.bind(this)
        this.updateOutput = this.updateOutput.bind(this)

        this.state = {
            nodes: [
                {
                    type: 'number',
                    title: 'Number',
                    id: 0,
                    x: 100,
                    y: 250,
                    width: 250,
                    height: 100,
                    outputs: [
                        { label: 'Output', value: 13, id:'0' }
                    ]
                },
                {
                    type: 'math',
                    title: 'Multiply',
                    id: 1,
                    x: 500,
                    y: 350,
                    width: 250,
                    height: 110,
                    inputs: [
                        {label: 'Value A', value: 0, id: 0},
                        {label: 'Value B', value: 0, id: 1}
                    ],
                    outputs: [
                        { label: 'Output', value: 0, id:'0' }
                    ]
                },
                {
                    type: 'display',
                    id: 2,
                    x: 560,
                    y: 500,
                    width: 160,
                    height: 100,
                    inputs: [
                        { label: 'Input', value: 0 }
                    ]
                }
            ],
            connections: [
                { from: { nodeID: 0, socket: 0 }, to: { nodeID: 1, socket: 0 }, id: 0 },
                { from: { nodeID: 0, socket: 0 }, to: { nodeID: 1, socket: 1 }, id: 1 },
                { from: { nodeID: 1, socket: 0 }, to: { nodeID: 2, socket: 0 }, id: 2 },
            ]
        }
    }

    handleChange(n) {
        this.setState((prevState, props) => {
            prevState.nodes.a.value = n;
            return prevState;
        })
        this.updateNode();
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
        console.log(`Updating output ${outputIndex} on node ${nodeID}. New value: ${newValue}`)
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

        console.log(`Running update from node ID ${id}.`);

        let relevantConnections = []
        for (let i = 0; i < this.state.connections.length; i++) {
            let c = this.state.connections[i];
            if (c.from.nodeID === id) {
                relevantConnections.push(c)
            }
        }

        console.log(`Found ${relevantConnections.length} subsequent nodes.`);
        for (let i = 0; i < relevantConnections.length; i++) {

            const rc = relevantConnections[i];
            console.log(rc);

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
            let y1 = (this.state.nodes[fromIndex].y + this.state.nodes[fromIndex].height) - ((this.state.nodes[fromIndex].outputs.length - c.from.socket) * 15);
            
            let x2 = this.state.nodes[toIndex].x;
            let y2 = (this.state.nodes[toIndex].y + this.state.nodes[toIndex].height) - ((this.state.nodes[toIndex].inputs.length - c.to.socket) * 18);

            return (<Connection key={c.id} x1={x1} y1={y1} x2={x2} y2={y2}></Connection>)
        }, this)

        const nodeItems = this.state.nodes.map(function (node) {
            if (node.type === 'number') {
                return <NumberNode updateOutput={this.updateOutput} update={this.updateNodes} outputs={node.outputs} width={node.width} height={node.height} x={node.x} y={node.y} key={node.id} id={node.id} title={node.title}></NumberNode>
            } else if (node.type === 'display') {
                return <DisplayNode inputs={node.inputs} update={this.updateNodes} width={node.width} height={node.height} x={node.x} y={node.y} key={node.id} title={node.title}></DisplayNode>
            } else if (node.type === 'math'){
                return <MathNode inputs={node.inputs} outputs={node.outputs} updateOutput={this.updateOutput} updateNodes={this.updateNodes} width={node.width} height={node.height} x={node.x} y={node.y} id={node.id} key={node.id} title={node.title}></MathNode>
            }
            return false;
        }, this);
        return (
            <div className='nodeContainer' >
                < svg width={this.props.width + 'px'} height={this.props.height + 'px'} >
                    {connectionItems}
                </svg>
                <>
                    {nodeItems}
                </>
            </div >
        )
    }
}