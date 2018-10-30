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
    title: key,
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
  title: 'Emotion',
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
      category => category.title === emotionCategory
    ).children;
    // debugger;
    const found = categoryChildren.find(x => x.title === emotion);
    if (found) {
      found.size++;

      this.setState({
        data: { ...this.state.data, children: dataChildren },
      });
    } else {
      categoryChildren.push({
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
    const { src } = this.props;
    const { width, height, data } = this.state;
    if (!width) {
      return null;
    }
    return (
      <div>
        <Treemap
          {...{
            // animation: true,
            colorType: 'literal',
            colorRange: ['#88572C'],
            data,
            mode: 'squarify',
            renderMode: 'SVG',
            height,
            width,
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
