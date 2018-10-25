import React, { Component } from 'react';

import YoutubeVideo from './YoutubeVideo';

const options = {
  height: '100%',
  width: '100%',
  playerVars: {
    // https://developers.google.com/youtube/player_parameters
    autoplay: 1,
    controls: 0, // Show pause/play buttons in player
    showinfo: 0, // Hide the video title
    modestbranding: 1, // Hide the Youtube Logo
    enablejsapi: 1,
    rel: 0,
    loop: 1, // Run the video in a loop
    fs: 0, // Hide the full screen button
    cc_load_policy: 0, // Hide closed captions
    iv_load_policy: 3, // Hide the Video Annotations
    autohide: 1, // Hide video controls when playing
  },
};

class YoutubePlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      scale: 1,
      translateX: 0,
      translateY: 0,
      topVideoId: '',
      bottomVideoId: '',
    };
  }

  componentDidMount() {
    // this.setState({ width: viewWidth, height: viewHeight });
    // const that = this;
    // (function loop() {
    //   var rand = Math.round(Math.random() * (3000 - 500)) + 500;
    //   setTimeout(() => {
    //     that.setState({
    //       translateX: Math.random() * 20 - 10,
    //       translateY: Math.random() * 20 - 10,
    //     });
    //     loop();
    //   }, rand);
    // })();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.videoId !== this.props.videoId) {
      console.log('UPDATE', prevProps.videoId, this.props.videoId);
      // setTimeout(this.props.getNextReply, 5000);

      if (this.props.count % 2) {
        this.setState({
          topVideoId: this.props.videoId,
        });
      } else {
        this.setState({
          bottomVideoId: this.props.videoId,
        });
      }
    }
  }
  // handleReady(e) {
  //   const player = e.target;
  //   // player.setPlaybackRate(0.5);
  //   this.setState({
  //     isLoaded: true,
  //   });
  //   player.mute();
  // }

  render() {
    const { blurAmount } = this.props;
    const { topVideoId, bottomVideoId } = this.state;
    console.log(blurAmount);
    // const { scale, translateX, translateY, isLoaded } = this.state;
    return (
      <div>
        <YoutubeVideo
          blurAmount={1}
          videoId={bottomVideoId}
          options={options}
        />
        <YoutubeVideo
          isTop
          blurAmount={1}
          videoId={topVideoId}
          options={options}
        />
      </div>
    );
  }
}

export default YoutubePlayer;
