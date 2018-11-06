import React, { Component } from 'react';
import { convertRange } from 'utils/data';

class LatestReplyText extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: null,
      height: null,
      show: false,
    };
  }

  componentDidMount() {
    const viewWidth = window.innerWidth;
    const viewHeight = window.innerHeight;
    this.setState({ width: viewWidth, height: viewHeight });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.lastCBResponse.output !== this.props.lastCBResponse.output) {
      this.setState({
        show: true,
      });
      setTimeout(() => {
        this.setState({ show: false });
      }, 2000);
    }
  }

  render() {
    if (!this.state.width) return null;
    const {
      latestReply,
      lastCBResponse: {
        emotion_degree: emotionDegree,
        reaction_degree: reactionDegree,
      },
    } = this.props;

    if (!emotionDegree) {
      return null;
    }

    const { width, height } = this.state;
    const r = convertRange(emotionDegree, [0, 50], [0, width / 2]) || 0;
    const theta = convertRange(reactionDegree, [0, 50], [0, 360]) || 0;
    const x = r * Math.cos(theta) + width / 2;
    const y = ((r * Math.sin(theta) + height / 2) * height) / width;

    return (
      <div
        style={{
          position: 'absolute',
          transform: `translate3d(${x}px,${y}px,0)`,
          transition: 'all 1s',
          background: 'white',
          color: 'black',
          padding: 2,
          opacity: this.state.show ? 1 : 0,
          fontFamily: 'Input Mono Narrow',
        }}
      >
        {latestReply.text}
      </div>
    );
  }
}

export default LatestReplyText;
