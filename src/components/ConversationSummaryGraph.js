import React, { Component } from 'react';
import { Treemap } from 'react-vis';
import { emotionLists } from 'utils/emotions';
import {
  getColorForEmotionCategory,
  rgbToHex,
  getEmotionCategoryForEmotion,
} from 'utils/color';

import './treemap.css';
const emotionCategories = [];

for (const key in emotionLists) {
  emotionCategories.push({
    title: '',
    emotionCategory: key,
    // size: 1,
    color: rgbToHex(getColorForEmotionCategory(key)),
    children: [],
    // children: emotionLists[key].map(emotion => ({
    //   title: emotion,
    //   color: rgbToHex(getColorForEmotionCategory(key)),
    //   size: 0,
    // })),
  });
}

const data = {
  title: '',
  color: '#000',
  children: emotionCategories,
};

class AudioPlayer extends Component {
  constructor(props) {
    super(props);
    this.state = { data, width: 0, height: 9 };
    this.addEmotionToGraph = this.addEmotionToGraph.bind(this);
  }

  componentDidMount() {
    const viewWidth = window.innerWidth;
    const viewHeight = window.innerHeight;
    this.setState({ width: viewWidth, height: viewHeight });
    if (this.props.currEmotion) {
      console.log('init emotion', this.props.currEmotion);
      this.addEmotionToGraph(this.props.currEmotion);
    }
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.currEmotion &&
      prevProps.currEmotion !== this.props.currEmotion
    ) {
      console.log('GOT EMOTION', this.props.currEmotion);
      this.addEmotionToGraph(this.props.currEmotion);
    }
  }

  addEmotionToGraph(emotion) {
    const dataChildren = this.state.data.children.slice();
    const emotionCategory = getEmotionCategoryForEmotion(emotion);
    const categoryChildren = dataChildren.find(
      category => category.emotionCategory === emotionCategory
    );
    if (!categoryChildren) {
      return;
    }
    // debugger;
    const found = categoryChildren.children.find(x => x.title === emotion);
    if (found) {
      found.size++;

      this.setState({
        data: { ...this.state.data, children: dataChildren },
      });
    } else {
      categoryChildren.children.push({
        title: emotion,
        size: 1,
        color: rgbToHex(getColorForEmotionCategory(emotionCategory)),
      });
      this.setState({
        data: { ...this.state.data, children: dataChildren },
      });
    }
  }

  render() {
    const { src, enabled } = this.props;
    const { width, height, data } = this.state;
    if (!width) {
      return null;
    }

    if (!enabled) {
      return null;
    }
    return (
      <div
        style={{
          transition: 'all 15s',
          filter: enabled ? 'none' : 'blur(200px)',
          opacity: enabled ? '1' : '0',
          mixBlendMode: 'overlay',
        }}
      >
        <Treemap
          {...{
            // animation: true,
            colorType: 'literal',
            colorRange: ['#88572C'],
            data,
            mode: 'squarify',
            renderMode: 'SVG',
            height: this.props.height || this.state.height,
            width: this.props.width || this.state.height,
            margin: 0,
            getSize: d => d.size,
            getColor: d => d.color,
            style: {
              stroke: '#000',
              // fillOpacity: '0.4',
              strokeWidth: '0.5',
              strokeOpacity: '0.25',
            },
          }}
        />
      </div>
    );
  }
}

export default AudioPlayer;
