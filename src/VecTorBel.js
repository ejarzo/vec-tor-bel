import React, { Component } from 'react';
import Sketch1 from 'components/p5sketches/Sketch1';
import RovingEye from 'components/RovingEye';
import NewsHeadline from 'components/NewsHeadline';
import YoutubePlayer from 'components/YoutubePlayer';
import AudioPlayer from 'components/AudioPlayer';
import ConversationSummaryGraph from 'components/ConversationSummaryGraph';
import { getColorForEmotion, getEmotionCategoryForEmotion } from 'utils/color';
import { getRandomIn } from 'utils/data';
import { Howl, Howler } from 'howler';
import { ReactHeight } from 'react-height';

import {
  getYoutubeComments,
  getFreesounds,
  getCleverbotReply,
  getNews,
  getYoutubeVideos,
  getLanguage,
} from 'middleware/middleware.js';

const scale = (num, in_min, in_max, out_min, out_max) => {
  return ((num - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
};

const scaleIntensity = (num, outMin, outMax) =>
  scale(num, 0, 2, outMin, outMax);

class VecTorBel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      runIndefinitely: true,

      showEye: false,
      showVideo: true,
      showTreemap: false,

      todaysArticle: '',
      replies: [],
      lastCBResponse: { cs: '' },
      count: 0,

      responsesBetweenYoutubeComments: 11,
      voices: [],
      currentVoice: null,

      videoId: '',
      videoComments: [],

      soundUrl: '',

      filterColor: 'rgb(255,255,255)',
      youtubeBlurAmount1: 0,
      youtubeBlurAmount2: 0,

      responsesPerCycle: 10,

      commentHeight: 0,
    };

    this.begin = this.begin.bind(this);
    this.speak = this.speak.bind(this);

    this.getVoices = this.getVoices.bind(this);
    this.getYoutubeData = this.getYoutubeData.bind(this);
    this.getSoundUrl = this.getSoundUrl.bind(this);
    this.getNextReply = this.getNextReply.bind(this);
  }

  getIntensityFromCount(count) {
    return Math.cos(((2 * Math.PI) / this.state.responsesPerCycle) * count) + 1;
  }

  async componentDidMount() {
    if (
      typeof speechSynthesis !== 'undefined' &&
      speechSynthesis.onvoiceschanged !== undefined
    ) {
      speechSynthesis.onvoiceschanged = this.getVoices;
    }

    // this.channel = new window.BroadcastChannel('ttt');
  }

  componentWillUnmount() {
    // this.channel.close();
  }

  async begin() {
    const { articles } = await getNews().catch(error => {
      console.log(error);
      return {};
      // TODO: handle get news error
    });
    if (!articles) return;

    // let initArticle = getRandomIn(articles);
    let initArticle = articles[0];

    // search top headline on youtube
    const [videoId, soundUrl] = await Promise.all([
      this.getYoutubeData(initArticle.title),
      this.getSoundUrl('news+breaking news', { min: 45, max: 300 }),
    ]);

    const nextReply = { text: initArticle.title, source: 'news' };

    // initialize with top headline
    this.setState({
      todaysArticle: initArticle,
      replies: [nextReply],
      videoId,
      soundUrl,
    });

    this.speak(nextReply, 1);
  }

  getVoices() {
    if (typeof speechSynthesis === 'undefined') {
      return;
    }

    const voices = speechSynthesis.getVoices();
    this.setState({ voices });
    return voices;
  }

  async speak({ text, source }, count) {
    console.log('SPEAK CALLED', this.state);
    const { voices, responsesPerCycle } = this.state;
    if (voices.length === 0) {
      console.log('no voice yet');
      return;
    }

    let voice = voices[0];

    if (source === 'news') {
      // use google voice
      voice = voices[48];
    } else {
      const language = await getLanguage(text);
      const languageCode =
        language.probability > 10 ? language.language_code : 'en';

      voice = voices.find(voice => voice.lang.slice(0, 2) === languageCode);
      console.log('Language:', language, voice);
    }

    const synth = window.speechSynthesis;
    window.utterances = [];
    const utterance = new SpeechSynthesisUtterance(text);
    window.utterances.push(utterance);

    const intensity = this.getIntensityFromCount(count);
    console.log('speaking intensity', intensity);

    // const onEnd =

    utterance.onend = () => {
      // synth.cancel();
      this.setState({ showCommentOverlay: false, isSpeaking: false });

      const maxTimeUntilNextResponse = 15 * intensity;

      console.log('============ done speaking ===========');
      console.log('-- timeUntilNextReply', maxTimeUntilNextResponse);

      if (this.state.runIndefinitely) {
        setTimeout(this.getNextReply, maxTimeUntilNextResponse * 1000);
      }
    };

    utterance.onerror = error => {
      console.log('speak error');
      console.log(error);
      // onEnd();
    };

    const inverseIntensity = intensity * -1 + 2;
    utterance.volume = scaleIntensity(inverseIntensity, 0.7, 1);
    utterance.pitch = 1;
    utterance.rate = scaleIntensity(inverseIntensity, 0.8, 1.3);

    utterance.voice = voice;
    this.setState({ isSpeaking: true });

    synth.speak(utterance);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.voices.length === 0 && this.state.voices.length > 0) {
      this.setState({
        currentVoice: this.state.voices[0],
      });
    }
  }

  async getSoundUrl(query, minMax) {
    console.log('getsoundurl', minMax);
    const freeSounds = await getFreesounds(query, minMax).catch(error => {
      console.log('get sounds error:', error);
    });

    if (!freeSounds) return '';
    return getRandomIn(freeSounds).previews['preview-hq-mp3'];
  }

  async getYoutubeData(query) {
    const videos = await getYoutubeVideos(query).catch(error => {
      console.log('error getting videos');
      console.log(error);
      return [];
    });

    if (videos.length > 0) {
      const randomVideo = getRandomIn(videos);
      return randomVideo.id.videoId;
    }

    return '';
  }

  async getNextReply() {
    const {
      replies,
      lastCBResponse,
      count,
      videoId,
      responsesPerCycle,
      responsesBetweenYoutubeComments,
    } = this.state;

    const prevReply = replies[replies.length - 1];
    const nextReplies = replies.slice();

    const intensity = this.getIntensityFromCount(count);
    const minSoundLength = scaleIntensity(intensity, -45, 0) + 45;
    const maxSoundLength = scaleIntensity(intensity, -300, 0) + 400;

    const minMax = { min: minSoundLength, max: maxSoundLength };

    let videoComments = null;
    if (
      replies.length === 2 ||
      replies.length % responsesBetweenYoutubeComments === 0
    ) {
      videoComments = await getYoutubeComments(videoId).catch(error => {
        return null;
      });
    }

    if (videoComments && videoComments.length > 0) {
      // use comment as reply
      const { text, author } = videoComments[0];
      const nextReply = { text, source: 'comment' };
      nextReplies.push(nextReply);

      const [nextVideoId, alertSoundUrl] = await Promise.all([
        this.getYoutubeData(nextReply.text),
        this.getSoundUrl('computer alert', {
          min: 0,
          max: 2,
        }),
      ]);

      const alertSound = new Howl({
        src: [alertSoundUrl],
        onend: () => {
          this.speak(nextReply, count + 1);
        },
      }).play();

      this.setState({
        replies: nextReplies,
        count: count + 1,
        videoComments,
        showCommentOverlay: true,
      });

      if (nextVideoId) {
        this.setState({
          videoId: nextVideoId,
        });
      }
    } else {
      // Get cleverbot response
      const cleverbotResponse = await getCleverbotReply(
        prevReply ? prevReply.text : ''
      );
      const { output, emotion, reaction } = cleverbotResponse;

      const nextReply = { text: output, source: 'cleverbot', emotion };
      nextReplies.push(nextReply);

      const [nextVideoId, soundUrl] = await Promise.all([
        this.getYoutubeData(nextReply.text),
        this.getSoundUrl(nextReply.text, minMax),
      ]);

      const emotionColor = getColorForEmotion(emotion);
      const emotionSoundUrl =
        !soundUrl &&
        (await this.getSoundUrl(
          getEmotionCategoryForEmotion(`${emotion}+${reaction}`),
          minMax
        ));

      this.setState({
        replies: nextReplies,
        lastCBResponse: cleverbotResponse,
        count: count + 1,
        showCommentOverlay: false,
        filterColor: emotionColor,
      });

      if (nextVideoId) {
        this.setState({
          videoId: nextVideoId,
        });
      }

      if (soundUrl || emotionSoundUrl) {
        this.setState({
          soundUrl: soundUrl || emotionSoundUrl,
        });
      }

      this.speak(nextReply, count + 1);
    }
  }

  render() {
    const {
      showEye,
      showVideo,
      showTreemap,
      videoId,
      videoComments,
      replies,
      lastCBResponse,
      youtubeBlurAmount1,
      youtubeBlurAmount2,
      showCommentOverlay,
      soundUrl,
      isSpeaking,
    } = this.state;

    const n = replies.length;
    const latestReply = replies[n - 1];

    if (!this.state.currentVoice) {
      return null;
    }

    return (
      <div className="App" style={{ paddingBottom: 100 }}>
        {showVideo && (
          <div className="VideoContainer">
            <YoutubePlayer
              getNextReply={this.getNextReply}
              count={n}
              blurAmount1={youtubeBlurAmount1}
              blurAmount2={youtubeBlurAmount2}
              videoId={videoId}
            />
          </div>
        )}

        {showEye && <RovingEye />}

        {/*<div
          style={{
            mixBlendMode: 'hue',
            transition: 'all 0.5s',
            position: 'absolute',
            width: '100vw',
            height: '100vh',
            background: this.state.filterColor,
          }}
        />*/}

        <div className="SketchContainer">
          {latestReply && (
            <Sketch1
              newReply={latestReply}
              newData={lastCBResponse}
              count={this.state.count}
            />
          )}
        </div>

        {latestReply && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              transition: 'all 0.3s',
              transform: `translate3d(${showCommentOverlay ? 0 : 100}vw, 0, 0)`,
              mixBlendMode: 'screen',
              // bottom: 0,
              // width: '100%',
              padding: 30,
              // top: 0,
              fontFamily: 'Roboto',
              color: '#222',
              background: 'white',
              fontSize: '8em',
            }}
          >
            <ReactHeight onHeightReady={height => this.setState()}>
              <div>
                {/* TODO: this is a long comment this is a long comment this is a long
                  comment this is a long comment this is a long comment this is a
                  long comment this is a long comment this is a long comment this
                  is a long comment this is a long comment this is a long comment
                  this is a long comment this is a long comment this is a long
                  comment this is a long comment this is a long comment this is a
                  long comment this is a long comment this is a long comment this
                  is a long comment this is a long comment this is a long comment
                  this is a long comment this is a long comment*/}
                {latestReply.text}
              </div>
            </ReactHeight>
          </div>
        )}
        <div className="controls" style={{ zIndex: 20 }}>
          <button onClick={this.begin}>BEGIN</button>
          <button
            onClick={() => {
              // Send a message on "my_bus".
              // this.channel.postMessage('This is a test message.');
            }}
          >
            SEND MESSAGE
          </button>
          <button onClick={this.getNextReply}>GO</button>
          <button
            onClick={() =>
              this.setState({ showTreemap: !this.state.showTreemap })
            }
          >
            Toggle treemap
          </button>
          <button
            onClick={() =>
              this.setState({
                showCommentOverlay: !this.state.showCommentOverlay,
              })
            }
          >
            toggle comment overlay
          </button>
          <button
            onClick={() =>
              this.setState({ runIndefinitely: !this.state.runIndefinitely })
            }
          >
            Toggle infinite
          </button>
          <button
            onClick={() => {
              this.setState({
                youtubeBlurAmount1: 0,
                youtubeBlurAmount2: 0,
              });
            }}
          >
            CLEAR BLUR
          </button>
          <button
            onClick={() => {
              this.setState({
                youtubeBlurAmount1: Math.random() * 50,
              });
            }}
          >
            RANDOM BLUR 1
          </button>
          <button
            onClick={() => {
              this.setState({
                youtubeBlurAmount2: Math.random() * 50,
              });
            }}
          >
            RANDOM BLUR 2
          </button>
          <button
            onClick={() => {
              const r = Math.random() * 255;
              const g = Math.random() * 255;
              const b = Math.random() * 255;
              this.setState({
                filterColor: `rgb(${r},${g},${b})`,
              });
            }}
          >
            RANDOM COLOR
          </button>
        </div>

        <NewsHeadline headline={this.state.replies[0]} />

        <AudioPlayer src={soundUrl} isSpeaking={isSpeaking} />
        {latestReply && (
          <div style={{ position: 'absolute', zIndex: 1 }}>
            <ConversationSummaryGraph
              enabled={showTreemap}
              currEmotion={latestReply.emotion}
            />
          </div>
        )}
      </div>
    );
  }
}

export default VecTorBel;
