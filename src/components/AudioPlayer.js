import React, { Component } from 'react';
import ReactAudioPlayer from 'react-audio-player';

class AudioPlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { src } = this.props;
    console.log('AUDIO SOURCE', src);
    return (
      <div>
        <ReactAudioPlayer src={src} autoPlay />
      </div>
    );
  }
}

export default AudioPlayer;
