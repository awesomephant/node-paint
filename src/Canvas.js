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
    this.clear = this.clear.bind(this);
    this.resetData = this.resetData.bind(this);
    this.saveImage = this.saveImage.bind(this)
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
    if (this.state.isDrawing) {
      this.props.updateDrawingData({
        distance: this.props.drawingData.distance + 1,
        speed: 0,
        x: e.clientX - this.props.width,
        y: e.clientY
      })

      let x = e.clientX - this.props.width
      let y = e.clientY;
      this.c.fillStyle = utils.formatRGB(this.props.pen.fill);
      this.c.fillCircle(x, y, this.props.pen.radius)
    }
  }
  handleMouseDown(e) {
    this.setState({ isDrawing: true })
    this.props.updateDrawingData({
      distance: this.props.drawingData.distance + 1,
      speed: 0,
      x: e.clientX,
      y: e.clientY - this.props.height
    })
    let x = e.clientX
    let y = e.clientY - this.props.height;
    this.c.fillStyle = utils.formatRGB(this.props.pen.fill);
    this.c.fillCircle(x, y, this.props.pen.radius)
  }
  handleMouseUp() {
    this.setState({ isDrawing: false })
  }
  clear() {
    this.c.clearRect(0, 0, this.props.width, this.props.height)
  }
  saveImage(e) {
    this.c.canvas.toBlob((blob) => {
      let URLObj = window.URL || window.webkitURL;
      let a = document.createElement("a");
      a.href = URLObj.createObjectURL(blob);
      a.download = "untitled.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }
  resetData() {
    this.props.updateDrawingData({
      distance: 0,
      speed: 0,
      area: 0,
      x: 0,
      y: 0
    })
  }
  render() {
    return (
      <div className='canvas panel'>
        <div className='panel--menu'>
          <button onClick={this.resetData}>Reset</button>
          <button onClick={this.clear}>Clear</button>
          <button onClick={this.saveImage}>Save</button>
        </div>
        <canvas height={this.props.height} width={this.props.width} ref={this.canvasRef} onMouseMove={this.handleMouseMove} onMouseDown={this.handleMouseDown} onMouseUp={this.handleMouseUp} className='world'></canvas>
      </div>
    )
  }
}
