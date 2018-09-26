import React, { Component } from 'react';
import YouTube from 'react-youtube';

class YoutubePlayer extends Component {
  render() {
    const { videoId } = this.props;
    const options = {
      height: '390',
      width: '640',
      playerVars: {
        // https://developers.google.com/youtube/player_parameters
        autoplay: 1,
      },
    };

    return (
      <div>
        <YouTube videoId={videoId} opts={options} />
      </div>
    );
  }
}

export default YoutubePlayer;
