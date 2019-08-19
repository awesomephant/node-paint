import React from 'react';
import * as utils from './utils.js';

export default class Canvas extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isDrawing: false
    }

    this.canvasRef = React.createRef();
    this.c = null;

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
  }
  componentDidMount() {
    this.c = this.canvasRef.current.getContext('2d');
    this.c.fillCircle = function (x, y, r) {
      this.beginPath();
      this.arc(x, y, r, 0, 2 * Math.PI, false);
      this.fill();
    };
  }
  handleMouseMove(e) {
    if (this.state.isDrawing){
      let x = e.clientX
      let y = e.clientY - this.props.height;
      this.c.fillStyle = utils.formatRGB(this.props.pen.fill);
      this.c.fillCircle(x,y,this.props.pen.r)
    }
  }
  handleMouseDown(e) {
    this.setState({ isDrawing: true })
    let x = e.clientX
    let y = e.clientY - this.props.height;
    this.c.fillStyle = utils.formatRGB(this.props.pen.fill);
    this.c.fillCircle(x,y,this.props.pen.r)
  }
  handleMouseUp() {
    this.setState({ isDrawing: false })
  }
  render() {
    return (
      <div className='canvas'>
      <canvas height={this.props.height} width={this.props.width} ref={this.canvasRef} onMouseMove={this.handleMouseMove} onMouseDown={this.handleMouseDown} onMouseUp={this.handleMouseUp} className='world'></canvas>
      </div>
    )
  }
}
