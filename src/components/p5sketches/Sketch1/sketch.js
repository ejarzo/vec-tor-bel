export default function sketch(p) {
  const width = 800;
  const height = 200;

  let leftReply = '';
  let rightReply = '';

  p.setup = function() {
    p.createCanvas(width, height);
    p.frameRate(60);
  };

  p.myCustomRedrawAccordingToNewPropsHandler = props => {
    const { currReply, prevReply, count } = props;
    if (count % 2) {
      rightReply = currReply || '';
    } else {
      leftReply = currReply || '';
    }
  };

  p.draw = () => {
    p.background(255);
    p.textAlign(p.LEFT);
    p.text(leftReply, 20, 30);
    p.textAlign(p.RIGHT);
    p.text(rightReply, width - 20, 30);
  };
}
