import React from 'react';
import Tone from 'tone';

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
    const masterOutput = new Tone.Gain(0.9).receive('masterOutput');

    masterOutput.chain(
      reverb,
      masterCompressor,
      masterLimiter,
      this.volume,
      Tone.Master
    );

    this.players = [...Array(10)].map((_, i) => {
      const player = new Tone.Player();
      player.autostart = true;
      player.send('masterOutput');
      return player;
    });
  }

  componentDidUpdate(prevProps) {
    const { src, count } = this.props;
    if (this.props.src && prevProps.src !== src) {
      this.players[count % 10].load(src, () => {
        console.log('Player ', 0, 'loaded ', src);
      });
    }

    if (this.props.isSpeaking && !prevProps.isSpeaking) {
      // todo ramp
      this.volume.volume.rampTo(-12, 1);
    }

    if (!this.props.isSpeaking && prevProps.isSpeaking) {
      // todo ramp
      this.volume.volume.rampTo(0, 1);
    }
  }

  render() {
    return null;
  }
}

export default AudioPlayer;
