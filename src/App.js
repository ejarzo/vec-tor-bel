import React, { Component } from 'react';
import './App.css';

import Sketch1 from 'components/p5sketches/Sketch1';

import YoutubePlayer from 'components/YoutubePlayer';
import {
  getYoutubeResults,
  getYoutubeComments,
  getFreesoundResults,
  getCleverbotReply,
  getNews,
} from 'middleware/middleware.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      todaysArticle: '',
      videoId: '',
      videoComments: [],
      input: 'what is the meaning of life?',
      output: '',
      conversationHistory: '',
      conversation: [],
      count: 0,
    };

    this.getYoutubeResults = this.getYoutubeResults.bind(this);
    this.getYoutubeComments = this.getYoutubeComments.bind(this);
    this.getFreesoundResults = this.getFreesoundResults.bind(this);
    this.getCleverbotReply = this.getCleverbotReply.bind(this);
    this.getNews = this.getNews.bind(this);
    this.continue = this.continue.bind(this);
  }

  componentDidMount() {
    getNews().then(
      data => {
        console.log('top headline');
        const { articles } = data;
        const firstArticle = articles[0];
        this.setState({
          todaysArticle: firstArticle,
          conversation: [firstArticle.title],
        });
      },
      error => {
        console.log('error', error);
      }
    );
  }

  componentDidUpdate(prevProps, prevState) {
    // if (prevState.input !== this.state.input) {
    //   // this.getYoutubeResults();
    //   // this.getCleverbotReply(this.state.input);
    // }
    // if (prevState.output !== this.state.output) {
    //   this.getYoutubeResults();
    //   console.log(this.state.output);
    // }
  }

  continue() {
    this.getCleverbotReply(this.state.conversation[0]);
  }

  getYoutubeResults(output) {
    console.log('=========== searching youtube for ===========', output);

    getYoutubeResults(output).then(data => {
      const { items: videos } = data;
      if (videos.length > 0) {
        const videoId =
          videos[Math.floor(Math.random() * videos.length)].id.videoId;
        this.setState({ videoId });
        this.getYoutubeComments(videoId);
      } else {
        console.log('No videos');
      }
    });
  }

  getYoutubeComments(videoId) {
    getYoutubeComments(videoId).then(data => {
      console.log(data);
      const { items } = data;
      if (items && items.length > 0) {
        const videoComments = items.map(item => ({
          id: item.id,
          author: item.snippet.topLevelComment.snippet.authorDisplayName,
          text: item.snippet.topLevelComment.snippet.textDisplay,
        }));
        this.setState({ videoComments });
        if (this.state.count % 3 === 0) {
          const conversation = this.state.conversation.slice();
          conversation.push(videoComments[0].text);
          this.setState({
            conversation,
          });
        }
      } else {
        console.log('No Comments');
      }
    });
  }

  getFreesoundResults() {
    const query =
      this.state.videoComments.length > 0
        ? this.state.videoComments[0].text.split(' ')[0]
        : 'slomo';

    getFreesoundResults(query).then(
      data => {
        const { results } = data;
        if (results.length <= 0) {
          console.log('NO SOUNDS for', query);
        } else {
          const first = data.results.length > 0 && data.results[0];
          const previewUrl = first.previews['preview-hq-mp3'];
          console.log(previewUrl);
        }
      },
      error => {
        console.log('error', error);
      }
    );
  }

  getCleverbotReply(query) {
    const { output, conversationHistory } = this.state;

    console.log('searching cleverbot for...');
    console.log(output);

    getCleverbotReply(output, conversationHistory).then(
      data => {
        console.log(data);
        const conversation = this.state.conversation.slice();
        conversation.push(data.output);
        this.setState({
          conversation,
        });
        this.setState({
          conversation,
          conversationHistory: data.cs,
          count: this.state.count + 1,
        });
        this.getYoutubeResults(data.output);
      },
      error => {
        console.log('error', error);
      }
    );
  }

  getNews() {
    getNews().then(
      data => {
        if (data.articles[0].title !== this.state.todaysArticle.title) {
          console.log('NEW HEADLINE');
          console.log(data.articles[0].title);
        } else {
          console.log('same title');
          console.log(data.articles[0].title);
          console.log(this.state.todaysArticle.title);
        }
      },
      error => {
        console.log('error', error);
      }
    );
  }

  render() {
    const { videoId, videoComments, conversation } = this.state;
    console.log(videoComments);
    return (
      <div className="App">
        {/* <Sketch1 /> */}
        <YoutubePlayer videoId={videoId} />
        <button onClick={this.continue}>GO</button>
        <button onClick={this.getNews}>CHECK FOR NEWS UPDATES</button>
        {/*<button onClick={this.getYoutubeResults}>fetch</button>
        <button onClick={this.getFreesoundResults}>fetch sounds</button>
        <button onClick={this.getCleverbotReply}>fetch cleverbot</button>
        <button onClick={this.getNews}>Get News</button>*/}
        {videoComments.map(comment => (
          <div key={comment.id} style={{ padding: 10 }}>
            <div>{comment.author}</div>
            <div>{comment.text}</div>
          </div>
        ))}

        <div style={{ padding: 20 }}>
          <h2>Headline</h2>
          {this.state.todaysArticle.title}
        </div>
        <div
          style={{
            padding: 20,
            position: 'fixed',
            bottom: 0,
            maxHeight: 200,
            overflow: 'scroll',
            background: 'white',
            borderTop: '2px solid gray',
            width: '100%',
          }}
        >
          <h2>Conversation</h2>
          {conversation.map((text, i) => (
            <div style={{ textAlign: i % 2 !== 0 && 'right' }}>{text}</div>
          ))}
        </div>
        <div style={{ padding: 20 }}>
          <h2>Count</h2>
          {this.state.count}
        </div>
      </div>
    );
  }
}

export default App;
