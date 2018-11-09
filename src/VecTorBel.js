import React, { Component } from 'react';
import Sketch1 from 'components/p5sketches/Sketch1';
import RovingEye from 'components/RovingEye';
import NewsHeadline from 'components/NewsHeadline';
import YoutubePlayer from 'components/YoutubePlayer';
import AudioPlayer from 'components/AudioPlayer';
import LatestReplyText from 'components/LatestReplyText';
import ConversationSummaryGraph from 'components/ConversationSummaryGraph';
import { getColorForEmotion, getEmotionCategoryForEmotion } from 'utils/color';
import { Howl } from 'howler';
import { ReactHeight } from 'react-height';

import {
  getYoutubeComments,
  getSoundUrl,
  getCleverbotReply,
  getNews,
  getYoutubeVideo,
  getLanguage,
} from 'middleware/middleware.js';

const delay = time => new Promise(res => setTimeout(() => res(), time));

const scale = (num, in_min, in_max, out_min, out_max) => {
  return ((num - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
};

export const scaleIntensity = (num, outMin, outMax) =>
  scale(num, 0, 2, outMin, outMax);

class VecTorBel extends Component {
  constructor(props) {
    super(props);
    this.initState = {
      runIndefinitely: true,

      showEye: false,
      showGraph: true,
      showVideo: true,
      showTreemap: false,

      cycleCount: 0,
      headlines: [],

      replies: [],
      lastCBResponse: { cs: '' },
      count: 0,

      responsesBetweenYoutubeComments: 11,
      voices: [],
      currentVoice: null,

      videoCount: 0,
      videoIds: ['', '', '', ''],
      latestVideoId: '',
      videoComments: [],

      soundUrl: '',

      filterColor: 'rgb(255,255,255)',
      youtubeBlurAmount1: 0,
      youtubeBlurAmount2: 0,

      responsesPerCycle: 30,
      repliesUntilReset: 2,

      credits: [],
    };

    this.state = this.initState;

    this.begin = this.begin.bind(this);
    this.speak = this.speak.bind(this);
    this.reset = this.reset.bind(this);

    this.getVoices = this.getVoices.bind(this);
    this.getNextReply = this.getNextReply.bind(this);
    this.setNewVideo = this.setNewVideo.bind(this);
    this.clearVideos = this.clearVideos.bind(this);
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

    this.channel = new window.BroadcastChannel('ttt');
  }

  componentWillUnmount() {
    this.channel.close();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.voices.length === 0 && this.state.voices.length > 0) {
      this.setState({
        currentVoice: this.state.voices[0],
      });
    }
  }

  setNewVideo(videoId) {
    if (!videoId) return;
    const { videoCount } = this.state;
    const videoIds = this.state.videoIds.slice();

    videoIds[videoCount % 4] = videoId;
    this.setState({
      videoIds,
      latestVideoId: videoId,
      videoCount: videoCount + 1,
    });
  }

  clearVideos() {
    this.setState({
      videoIds: ['', '', '', ''],
      latestVideoId: '',
      videoCount: 0,
    });
  }

  // setNewCredit({name, source, text}) {
  //   const { credits } = this.state;
  //   const newCredits = credits.slice();
  //   newCredits.push({name, source, text});
  //   this.setState({ credits: newCredits })
  //   this.
  // }

  getVoices() {
    if (typeof speechSynthesis === 'undefined') {
      return;
    }

    const voices = speechSynthesis.getVoices();
    this.setState({ voices });
    return voices;
  }

  async begin() {
    const { headlines, cycleCount } = this.state;
    let nextHeadlines = headlines;
    const nextIndex = cycleCount % 10;
    if (nextIndex === 0) {
      // update news list
      const { articles } = await getNews();
      nextHeadlines = articles;
      this.setState({ headlines: articles });
    }

    const currentHeadline = nextHeadlines[nextIndex];
    const nextReply = { text: currentHeadline.title, source: 'news' };

    // search top headline on youtube
    const [
      { videoId, videoAuthor, videoTitle },
      { soundUrl, soundAuthor },
    ] = await Promise.all([
      getYoutubeVideo(nextReply.text),
      getSoundUrl('news+breaking news', { min: 45, max: 300 }),
    ]);

    const videoCredit = {
      name: videoAuthor,
      source: 'youtube',
      text: videoTitle,
    };
    const soundCredit = { name: soundAuthor, source: 'freesound' };

    const newCredits = [videoCredit, soundCredit];

    // initialize with top headline
    this.setState({
      count: 1,
      replies: [nextReply],
      soundUrl,
      cycleCount: cycleCount + 1,
      credits: newCredits,
    });
    this.setNewVideo(videoId);

    this.channel.postMessage({
      replies: [nextReply],
      intensity: 2,
      credits: newCredits,
    });
    this.speak(nextReply, 1);
  }

  async reset() {
    this.setState({
      showTreemap: true,
    });
    // TODO: fade out sounds

    this.channel.postMessage({ clearTreemap: true });
    await delay(20000);

    this.clearVideos();
    this.setState({
      showTreemap: false,
      showGraph: false,
    });

    await delay(15000);
    this.setState({
      showGraph: true,
    });

    this.begin();
  }

  async speak({ text, source }, count) {
    const { voices } = this.state;
    if (voices.length === 0) {
      console.log('no voice yet');
      return;
    }

    let voice = voices[0];
    if (source === 'news') {
      // use google voice
      voice = voices.find(({ voiceURI }) => voiceURI === 'Google US English');
    } else {
      const language = await getLanguage(text);
      const languageCode =
        language.probability > 5 ? language.language_code : 'en';

      voice = voices.find(voice => voice.lang.slice(0, 2) === languageCode);
    }

    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);

    window.utterances = [];
    window.utterances.push(utterance);

    const intensity = this.getIntensityFromCount(count);
    console.log('speaking intensity', intensity);

    const resetOnNextReply =
      count > 0 && count % this.state.repliesUntilReset === 0;

    const onEnd = async () => {
      // synth.cancel();
      this.setState({ showCommentOverlay: false, isSpeaking: false });

      const maxTimeUntilNextResponse = 15 * intensity;

      console.log('============ done speaking ===========');
      console.log('-- timeUntilNextReply', maxTimeUntilNextResponse);

      if (this.state.runIndefinitely) {
        if (resetOnNextReply) {
          this.reset();
        } else {
          await delay(maxTimeUntilNextResponse * 1000);
          this.getNextReply();
        }
      }
    };

    utterance.onend = onEnd;
    utterance.onerror = error => {
      console.log('speak error');
      console.log(error);
      onEnd();
    };

    const inverseIntensity = intensity * -1 + 2;
    utterance.volume = scaleIntensity(inverseIntensity, 0.7, 1);
    utterance.pitch = 1;
    utterance.rate = scaleIntensity(inverseIntensity, 0.8, 1.3);

    utterance.voice = voice;
    this.setState({ isSpeaking: true });

    synth.speak(utterance);
  }

  async getNextReply() {
    const {
      replies,
      count,
      latestVideoId,
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
      videoComments = await getYoutubeComments(latestVideoId).catch(error => {
        return null;
      });
    }

    if (videoComments && videoComments.length > 0) {
      // use comment as reply
      const { text, author } = videoComments[0];

      const nextReply = { text, source: 'comment' };
      nextReplies.push(nextReply);

      const [
        { videoId, videoAuthor, videoTitle },
        { soundUrl: alertSoundUrl },
      ] = await Promise.all([
        getYoutubeVideo(nextReply.text),
        getSoundUrl('computer alert', {
          min: 0,
          max: 2,
        }),
      ]);

      this.setState({ isSpeaking: true });
      const alertSound = new Howl({
        src: [alertSoundUrl],
        onend: () => {
          this.speak(nextReply, count + 1);
        },
      }).play();

      const commentCredit = { name: author, source: 'comment', text };
      const videoCredit = {
        name: videoAuthor,
        source: 'youtube',
        text: videoTitle,
      };

      const newCredits = this.state.credits.slice();
      newCredits.push(commentCredit);
      newCredits.push(videoCredit);

      this.setState({
        replies: nextReplies,
        count: count + 1,
        videoComments,
        showCommentOverlay: true,
        credits: newCredits,
      });

      this.setNewVideo(videoId);
      this.channel.postMessage({
        replies: nextReplies,
        intensity,
        credits: newCredits,
      });
    } else {
      // Get cleverbot response
      const cleverbotResponse = await getCleverbotReply(
        prevReply ? prevReply.text : ''
      );
      const { output, emotion, reaction } = cleverbotResponse;

      const nextReply = { text: output, source: 'cleverbot', emotion };
      nextReplies.push(nextReply);

      const [
        { videoId, videoAuthor, videoTitle },
        { soundUrl, soundAuthor },
      ] = await Promise.all([
        getYoutubeVideo(nextReply.text),
        getSoundUrl(nextReply.text, minMax),
      ]);

      const newCredits = this.state.credits.slice();
      const videoCredit = {
        name: videoAuthor,
        source: 'youtube',
        text: videoTitle,
      };
      if (soundUrl) {
        const soundCredit = { name: soundAuthor, source: 'freesound' };
        newCredits.push(soundCredit);
      }

      newCredits.push(videoCredit);

      const emotionColor = getColorForEmotion(emotion);
      const { soundUrl: emotionSoundUrl, soundAuthor: emotionSoundAuthor } =
        !soundUrl &&
        (await getSoundUrl(
          getEmotionCategoryForEmotion(`${emotion}+${reaction}`),
          minMax
        ));

      if (emotionSoundUrl) {
        const soundCredit = { name: emotionSoundAuthor, source: 'freesound' };
        newCredits.push(soundCredit);
      }
      this.setState({
        replies: nextReplies,
        lastCBResponse: cleverbotResponse,
        count: count + 1,
        showCommentOverlay: false,
        filterColor: emotionColor,
        credits: newCredits,
      });

      this.setNewVideo(videoId);

      if (soundUrl || emotionSoundUrl) {
        this.setState({
          soundUrl: soundUrl || emotionSoundUrl,
        });
      }

      this.channel.postMessage({
        replies: nextReplies,
        intensity,
        credits: newCredits,
      });
      this.speak(nextReply, count + 1);
    }
  }

  render() {
    const {
      showEye,
      showVideo,
      showGraph,
      showTreemap,
      videoIds,
      replies,
      lastCBResponse,
      youtubeBlurAmount1,
      youtubeBlurAmount2,
      showCommentOverlay,
      soundUrl,
      isSpeaking,
      count,
    } = this.state;

    const n = replies.length;
    const latestReply = replies[n - 1];

    if (!this.state.currentVoice) {
      return null;
    }

    const intensity = this.getIntensityFromCount(count);
    const inverseIntensity = intensity * -1 + 2;
    console.log('RENDER INVERSET INTENSITY', inverseIntensity);
    return (
      <div className="App" style={{ paddingBottom: 100 }}>
        {showVideo && (
          <div className="VideoContainer">
            <YoutubePlayer
              getNextReply={this.getNextReply}
              count={n}
              blurAmount1={youtubeBlurAmount1}
              blurAmount2={youtubeBlurAmount2}
              videoIds={videoIds}
              volume={inverseIntensity > 1.5 ? 100 : 0}
            />
          </div>
        )}

        {showEye && <RovingEye />}

        {latestReply && (
          <LatestReplyText
            latestReply={latestReply}
            lastCBResponse={lastCBResponse}
          />
        )}

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
          {latestReply &&
            showGraph && (
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
              padding: 30,
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
          <button onClick={this.reset}>RESET</button>
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

        {latestReply && <NewsHeadline latestReply={latestReply} />}

        <AudioPlayer
          src={soundUrl}
          intensity={inverseIntensity}
          isSpeaking={isSpeaking}
          count={count}
        />
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
