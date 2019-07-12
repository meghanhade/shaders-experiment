const canvasSketch = require('canvas-sketch');
// utility to get quickly started with a fullscreen shader
const createShader = require('canvas-sketch-util/shader');
// a module/tool used to write tools
// we can use this to import utilities
const glsl = require('glslify');

// Setup our sketch
const settings = {
  // use webgl instead of 2d
  context: 'webgl',
  animate: true
  // dimensions: [512, 512],
  // duration: 10,
  // fps: 24
};

// Your glsl code
// use 'shader languages support' or 'comment tagged template strings' 
// vscode extensions, add /* glsl */ before string
const frag = glsl(/* glsl */`
  precision highp float;

  uniform float time;
  uniform float aspect;
  varying vec2 vUv;

  // to import glsl-noise
  #pragma glslify: noise = require('glsl-noise/simplex/3d');
  #pragma glslify: hsl2rgb = require('glsl-hsl2rgb');

  void main () {
    
    // this came with template, delete
    // vec3 color = 0.5 + 0.5 * cos(time + vUv.xyx + vec3(0.0, 2.0, 4.0));
    // gl_FragColor = vec4(color, 1.0);
    // rgba(0,0,255,0.5) = red,green,blue values between 0-255, with alpa transparency between 0-1
    // values in shaders are between 0-1. red, green, blue, alpha
    // gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    
    // vec3 colorA = sin(time * 2.0) + vec3(0.5,0.0,0.0);
    // vec3 colorB = vec3(0.0, 0.0, 0.5);

    vec2 center = vUv - 0.5;
    center.x *= aspect;
    // length is the magnitude of the vector
    float dist = length(center);
    
    // mix is a glsl built-in function
    // specify colors you want to mix between and the value between 0-1
    // mix is another way of saying lerp
    // vec3 color = mix(colorA, colorB, vUv.x + vUv.y * sin(time));

    // dist is a harsh step, creates jagged edge
    // gl_FragColor = vec4(color, dist > 0.25 ? 0.0 : 1.0);
    // try this instead
    // step replaces the turnary
    // float alpha = step(dist, 0.25);
    // smoothstep
    // the closer the first value is to the second, the less of a falloff there is
    float alpha = smoothstep(0.2515, 0.25, dist);    
    // gl_FragColor = vec4(color, alpha);

    float n = noise(vec3(vUv.xy * 1.5, time * 0.1));

    vec3 color = hsl2rgb(
      0.7 + n * 0.3,
      0.5,
      0.5
    );

    gl_FragColor = vec4(color, alpha);


  }
`);

// Your sketch, which simply returns the shader
const sketch = ({ gl }) => {
  // Create the shader and return it
  return createShader({
    // set background color
    // if you set it to 'false', it is transparent
    clearColor: 'white',
    // Pass along WebGL context
    gl,
    // Specify fragment and/or vertex shader strings
    frag,
    // Specify additional uniforms to pass down to the shaders
    uniforms: {
      // Expose props from canvas-sketch
      time: ({ time }) => time,
      aspect: ({ width, height }) => width / height
    }
  });
};

canvasSketch(sketch, settings);
