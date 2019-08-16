import React from 'react'

export default class Connection extends React.Component {
    generatePath(x1, y1, x2, y2) {
        let pathOffset = 70;
        let path = `M ${x1} ${y1} C${x1 + pathOffset} ${y1}, ${x2 - pathOffset} ${y2}, ${x2} ${y2}`;
       // let path = `M ${x1} ${y1} L${x2} ${y2}`;
        return path;
    }

    render() {
        return(
            <path  d={this.generatePath(this.props.x1,this.props.y1,this.props.x2,this.props.y2)} />
        )
    }
}