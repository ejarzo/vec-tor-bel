import React from 'react';
import Tone from 'tone';
Tone.context.latencyHint = 'playback';

class AudioPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.sounds = [];

    const masterCompressor = new Tone.Compressor({
      ratio: 16,
      threshold: -30,
      release: 0.25,
      attack: 0.003,
      knee: 30,
    });

    this.volume = new Tone.Volume();

    const masterLimiter = new Tone.Limiter(-2);
    const reverb = new Tone.Freeverb();
    this.filter = new Tone.Filter();
    const masterOutput = new Tone.Gain(0.9).receive('masterOutput');

    masterOutput.chain(
      this.filter,
      reverb,
      masterCompressor,
      masterLimiter,
      this.volume,
      Tone.Master
    );

    this.players = [...Array(10)].map((_, i) => {
      const player = new Tone.Player();
      // player.autostart = true;
      player.send('masterOutput');
      return player;
    });
  }

  componentDidUpdate(prevProps) {
    console.log(prevProps, this.props);
    const { src, count } = this.props;
    if (this.props.src && prevProps.src !== src) {
      const player = this.players[count % 10];
      player.stop('+0.2');
      player.load(src, () => {
        player.start('+0.2');
      });
    }

    if (this.props.intensity !== !prevProps.intensity) {
      const freq = this.props.intensity * 10000 + 50;
      console.log(this.props.intensity, freq);
      this.filter.frequency.rampTo(freq, 5);
    }

    if (this.props.isSpeaking && !prevProps.isSpeaking) {
      this.volume.volume.rampTo(-12, 1);
    }

    if (!this.props.isSpeaking && prevProps.isSpeaking) {
      this.volume.volume.rampTo(0, 1);
    }
  }

  render() {
    return null;
  }
}

export default AudioPlayer;
