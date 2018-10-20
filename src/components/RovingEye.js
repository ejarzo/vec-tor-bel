import React, { Component } from 'react';

const clipArc = (ctx, x, y, rx, ry, f, blurAmount) => {
  ctx.globalCompositeOperation = 'destination-out';

  // cant do negative TODO
  if (rx < 0) rx = 10;
  if (ry < 0) ry = 10;

  ctx.filter = 'blur(' + blurAmount + 'px)'; // "feather"
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, 2 * Math.PI);
  ctx.fill();

  // reset comp. mode and filter
  ctx.globalCompositeOperation = 'destination-out';
  ctx.filter = 'none';
};

class RovingEye extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: null,
      height: null,
    };

    this.initCanvas = this.initCanvas.bind(this);
  }

  componentDidMount() {
    const viewWidth = window.innerWidth;
    const viewHeight = window.innerHeight;
    this.setState({ width: viewWidth, height: viewHeight });
  }

  initCanvas(canvas) {
    this.canvas = canvas;

    const { width, height } = this.state;
    const radius = 300;
    const blurAmount = 20;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);
    clipArc(ctx, width / 2, height / 2, radius, radius, 10, blurAmount);
  }

  render() {
    if (!this.state.width) return null;

    return (
      <canvas
        style={{
          position: 'absolute',
        }}
        ref={this.initCanvas}
        width={this.state.width}
        height={this.state.height}
      />
    );
  }
}

export default RovingEye;
