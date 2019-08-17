import React from 'react'
import Socket from './Socket.js'

export default class DisplayNode extends React.Component {

    constructor(props) {
        super(props);
        this.handleDraftConnectionDrop = this.handleDraftConnectionDrop.bind(this);
    }

    handleDraftConnectionDrop(socketID) {
        this.props.finishDraftConnection(this.props.id, socketID)
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

        return (
            <div className='node' key={this.props.id} style={nodeCSS} >
                <header className='node-header'>Display</header>
                <ul className='node-inputs'>
                    {inputs}
                </ul>
                <div className='node-body'>
                    <h2>{this.props.inputs[0].value}</h2>
                </div>
            </div>
        )
    }
}