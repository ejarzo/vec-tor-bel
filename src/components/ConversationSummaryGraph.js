import React, { Component } from 'react';
import { Treemap } from 'react-vis';
import { emotionLists } from 'utils/emotions';
import {
  getColorForEmotionCategory,
  rgbToHex,
  getEmotionCategoryForEmotion,
} from 'utils/color';

import './treemap.css';

class ConversationSumaryGraph extends Component {
  constructor(props) {
    const emotionCategories = [];

    for (const key in emotionLists) {
      emotionCategories.push({
        title: '',
        emotionCategory: key,
        color: rgbToHex(getColorForEmotionCategory(key)),
        children: [],
      });
    }

    const data = {
      title: '',
      color: '#000',
      children: emotionCategories,
    };
    super(props);
    this.state = {
      data,
      isVisible: props.enabled,
      isEnabled: props.enabled,
    };
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
    if (prevProps.enabled && !this.props.enabled) {
      this.setState({
        isVisible: false,
      });

      setTimeout(() => {
        const newEmotionCategories = [];

        for (const key in emotionLists) {
          newEmotionCategories.push({
            title: '',
            emotionCategory: key,
            color: rgbToHex(getColorForEmotionCategory(key)),
            children: [],
          });
        }

        this.setState({
          isEnabled: false,
          data: {
            title: '',
            color: '#000',
            children: newEmotionCategories,
          },
        });
      }, 15000);
    } else if (
      this.props.currEmotion &&
      prevProps.currEmotion !== this.props.currEmotion
    ) {
      console.log('GOT EMOTION', this.props.currEmotion);
      this.addEmotionToGraph(this.props.currEmotion);
    }

    if (!prevProps.enabled && this.props.enabled) {
      this.setState({
        isEnabled: true,
      });
      setTimeout(() => {
        this.setState({
          isVisible: true,
        });
      }, 50);
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
    const { data, isEnabled, isVisible, width, height } = this.state;

    if (!width || !isEnabled) {
      return null;
    }

    return (
      <div
        style={{
          transition: 'all 15s',
          filter: isVisible ? 'none' : 'blur(200px)',
          opacity: isVisible ? '1' : '0',
          // mixBlendMode: 'overlay',
        }}
      >
        <Treemap
          {...{
            // animation: false,
            colorType: 'literal',
            colorRange: ['#88572C'],
            data,
            mode: 'squarify',
            renderMode: 'SVG',
            height: this.props.height || height,
            width: this.props.width || width,
            margin: 0,
            getSize: d => d.size,
            getColor: d => d.color,
            style: {
              stroke: '#000',
              strokeWidth: '0.5',
              strokeOpacity: '0.25',
            },
          }}
        />
      </div>
    );
  }
}

export default ConversationSumaryGraph;
