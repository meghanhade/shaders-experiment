const canvasSketch = require('canvas-sketch');
const { lerp } = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const palettes = require('nice-color-palettes');

const settings = {
};

const sketch = () => {
  const palette = random.pick(palettes);
  const featureColors = palette.slice(0,4);
  const backgroundColor = palette.slice(4,5);

  const createGrid = () => {
    const points = [];
    const count = 50;
    for (let x=0; x < count; x++){
      for (let y = 0; y < count; y++){
        const u = count <= 1 ? 0.2 : x/(count - 1);
        const v = count <= 1 ? 0.2 : y/(count - 1);
        const radius = Math.abs(random.noise2D(u, v)) * 0.2;
        points.push({
          color: random.pick(featureColors),
          radius,
          rotation: random.noise2D(u, v),
          position: [u,v]
        });
      }
    }
    return points;
  };

  const points = createGrid().filter(() => random.value() > .5);
  const margin = 00;

  return ({ context, width, height }) => {
    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, width, height);

    points.forEach(data => {
      const {
        position,
        radius,
        color,
        rotation
      } = data;

      const [u, v] = position;
      const x = lerp(margin, width - margin, u);
      const y = lerp(margin, height - margin, v);
      
      context.save();
      context.fillStyle = color;
      context.font = `${radius * width}px "Helvetica"`;
      context.translate(x,y);
      context.rotate(rotation);
      context.fillText('|', 0, 0);

      context.restore();
    });
  };
};

canvasSketch(sketch, settings);