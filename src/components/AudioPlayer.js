import React, { Component } from 'react';
import ReactAudioPlayer from 'react-audio-player';
import { Howl, Howler } from 'howler';
import Tone from 'tone';

class AudioPlayer extends Component {
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
  }

  componentDidUpdate(prevProps) {
    if (this.props.src && prevProps.src !== this.props.src) {
      const player = new Tone.Player(this.props.src, () => {
        console.log('LOADED', this.props.src);
      });
      player.autostart = true;
      player.send('masterOutput');
    }

    if (this.props.isSpeaking && !prevProps.isSpeaking) {
      // todo ramp
      this.volume.volume.linearRampToValueAtTime(-12, 1);
    }

    if (!this.props.isSpeaking && prevProps.isSpeaking) {
      // todo ramp
      this.volume.volume.linearRampToValueAtTime(0, 1);
    }
  }

  render() {
    return null;
  }
}

export default AudioPlayer;
