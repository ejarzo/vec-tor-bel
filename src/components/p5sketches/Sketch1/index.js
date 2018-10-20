import React, { Component } from 'react';
import P5Wrapper from 'react-p5-wrapper';

import sketch from './sketch';

class Sketch1 extends Component {
  render() {
    return (
      <div>
        <P5Wrapper sketch={sketch} {...this.props} />
      </div>
    );
  }
}

export default Sketch1;
