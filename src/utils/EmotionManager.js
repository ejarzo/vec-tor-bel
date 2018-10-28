function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? '0' + hex : hex;
}
const rgbToHex = col => {
  var r = col.r;
  var g = col.g;
  var b = col.b;

  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
};

class EmotionManager {
  constructor() {
    var likeList = [
      'happy',
      'nice',
      'genuine smile ',
      'agreement',
      'pleased',
      'relieved',
      'interested',
      'agreeable',
      'nice hello ',
      'nice goodbye ',
      'calm',
      'modest',
      'relaxed',
      'curious',
      'determined',
      'questioning',
      'contemplative',
      'smug',
      'knowing',
      'shy',
      'look left ',
      'look right ',
      'look up ',
      'look down',
      'cool',
    ];

    var loveList = [
      'love',
      'sympathy',
      'supportive',
      'positive',
      'appreciation',
      'very happy',
      'gentle',
      'belief',
      'thoughtful',
      'dancing',
      'serious',
      'excited',
      'proud',
      'sweetness',
      'singing',
      'flirty',
      'righteous',
      'sure',
      'victorious',
      'didactic',
    ];

    var laughingList = [
      'ha!',
      'ha',
      'nice laugh',
      'nasty laugh',
      'giggling',
      'sniggering',
      'mocking',
      'joking',
      'silly',
      'wry smile',
      'sarcastic smile',
      'amused',
      'naughty',
      'tongue out',
      'winking',
    ];

    var surpriseList = [
      'shocked',
      'aah',
      'disbelief',
      'amazed',
      'surprised',
      'jumpy',
      'impressed',
      'alert',
    ];

    var sadList = [
      'crying',
      'very sad',
      'upset',
      'frowning',
      'sad',
      'uninterested',
      'sigh',
      'apologetic',
      'disappointed',
      'disinterested',
      'confused',
      'uncomfortable',
      'embarrassed',
      'disagreement',
      'reluctant',
      'worried',
      'concerned',
      'distracted',
      'doubting',
      'forgetful',
      'guilty',
      'lazy',
      'none',
      'bored',
      'sleepy',
      'tired',
      'unsure',
      'robotic',
    ];

    var angerList = [
      'furious',
      'forceful',
      'infuriated',
      'angry',
      'scared',
      'shouting',
      'frustrated',
      'nasty goodbye',
      'indignation',
      'mean',
      'annoyed',
      'argumentative',
      'assertive',
      'stubborn',
      'devious',
      'grumpy',
    ];

    var disgustList = [
      'eek!',
      'eek',
      'hatred',
      'disgust',
      'sneering',
      'sarcastic',
      'displeased',
      'negative',
      'unimpressed',
      'reluctant hello',
      'nosey',
      'rude',
      'uncomfortable',
    ];

    this.responseLists = [
      likeList,
      loveList,
      laughingList,
      surpriseList,
      sadList,
      angerList,
      disgustList,
    ];
    this.responseNames = [
      'like',
      'love',
      'laughing',
      'surprise',
      'sad',
      'anger',
      'disgust',
    ];
  }

  /*  Returns the high level emotion category (like, love, laughing, surprise, 
    sad, anger, or disgust) that the input falls under */
  getEmotionCategory(input) {
    for (var i = 0; i < this.responseLists.length; i++) {
      var list = this.responseLists[i];
      var foundI = list.indexOf(input.trim());
      if (foundI >= 0) {
        return this.getEmotionCategoryName(i);
      }
    }
  }

  /* Returns the name of the emotion category at the given index */
  getEmotionCategoryName(index) {
    return this.responseNames[index];
  }

  /* Returns the color in {r,g,b} format for the given emotion */
  getColorForEmotion(input) {
    return this.getColorForEmotionCategory(this.getEmotionCategory(input));
  }

  /* Returns the color of the emotion at index i (in the responseNames array) */
  getColorForEmotionIndex(i) {
    return rgbToHex(this.getColorForEmotionCategory(this.responseNames[i]));
  }

  /*  Returns the color in {r,g,b} format for the input, which is a high 
    level emotion category */
  getColorForEmotionCategory(input) {
    var r = 0;
    var g = 0;
    var b = 0;

    if (input === 'anger') {
      r = 175;
      g = 7;
      b = 7;
    }
    if (input === 'sad') {
      r = 145;
      g = 169;
      b = 242;
    }
    if (input === 'love') {
      r = 255;
      g = 0;
      b = 106;
    }
    if (input === 'disgust') {
      r = 77;
      g = 170;
      b = 37;
    }
    if (input === 'like') {
      r = 115;
      g = 239;
      b = 146;
    }
    if (input === 'laughing') {
      r = 255;
      g = 255;
      b = 22;
    }
    if (input === 'surprise') {
      r = 255;
      g = 170;
      b = 10;
    }

    if (input === '') {
      return this.getColorForEmotion('like');
    }

    return {
      r: r,
      g: g,
      b: b,
    };
  }

  getVoiceParamsForEmotionCategory(input) {
    if (input === 'anger') return { rate: 1.2, pitch: 0.5, volume: 1.1 };
    else if (input === 'sad') return { rate: 0.6, pitch: 1.3, volume: 0.9 };
    else if (input === 'love') return { rate: 0.8, pitch: 0.9, volume: 1 };
    else if (input === 'disgust') return { rate: 0.7, pitch: 0.8, volume: 1 };
    else if (input === 'like') return { rate: 1, pitch: 0.7, volume: 1 };
    else if (input === 'laughing') return { rate: 1.2, pitch: 1.2, volume: 1 };
    else if (input === 'surprise')
      return { rate: 1.3, pitch: 1.2, volume: 1.2 };

    return { rate: 1, pitch: 1, volume: 1 };
  }
}

export default EmotionManager;
