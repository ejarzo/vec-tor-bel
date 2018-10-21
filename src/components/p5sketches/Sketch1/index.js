import React, { Component } from 'react';
import P5Wrapper from 'react-p5-wrapper';

import sketch from './sketch';

class Sketch1 extends Component {
  constructor(props) {
    super(props);
    this.state = { width: null, height: null };
  }

  componentDidMount() {
    const viewWidth = window.innerWidth;
    const viewHeight = window.innerHeight;
    this.setState({ width: viewWidth, height: viewHeight });
  }

  render() {
    const { width, height } = this.state;
    if (!width) return null;
    return <P5Wrapper sketch={sketch} {...this.props} />;
  }
}

export default Sketch1;
