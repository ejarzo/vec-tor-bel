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
        controls: 0, // Show pause/play buttons in player
        showinfo: 0, // Hide the video title
        modestbranding: 1, // Hide the Youtube Logo
        enablejsapi: 1,
        rel: 0,
        loop: 0, // Run the video in a loop
        fs: 0, // Hide the full screen button
        cc_load_policy: 0, // Hide closed captions
        iv_load_policy: 3, // Hide the Video Annotations
        autohide: 1, // Hide video controls when playing
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
