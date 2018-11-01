import React, { Component } from 'react';
import ReactAudioPlayer from 'react-audio-player';

class AudioPlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      soundUrls: [],
      volume: 1,
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

    if (this.props.isSpeaking && !prevProps.isSpeaking) {
      this.setState({ volume: 0.6 });
      console.log('speaking');
    }

    if (!this.props.isSpeaking && prevProps.isSpeaking) {
      this.setState({ volume: 1 });
      console.log('done speaking');
    }
  }

  render() {
    const { soundUrls } = this.state;
    return (
      <div>
        {soundUrls.map(url => (
          <ReactAudioPlayer src={url} volume={this.state.volume} autoPlay />
        ))}
      </div>
    );
  }
}

export default AudioPlayer;
