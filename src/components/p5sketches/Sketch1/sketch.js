export default function sketch(p) {
  const width = 1000;
  const height = 1000;

  p.setup = function() {
    p.createCanvas(width, height);
    p.frameRate(60);
  };

  p.myCustomRedrawAccordingToNewPropsHandler = props => {
    console.log(props);
  };

  p.draw = () => {
    p.rect(0, 0, 20, 20);
  };
}
