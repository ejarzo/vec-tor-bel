import React, { Component } from 'react';
import ReactAudioPlayer from 'react-audio-player';

class AudioPlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      soundUrls: [],
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.src && prevProps.src !== this.props.src) {
      const soundUrls = this.state.soundUrls.slice();
      soundUrls.push(this.props.src);
      this.setState({
        soundUrls,
      });
    }
  }

  render() {
    const { soundUrls } = this.state;
    return (
      <div>
        {soundUrls.map(url => (
          <ReactAudioPlayer src={url} autoPlay />
        ))}
      </div>
    );
  }
}

export default AudioPlayer;
