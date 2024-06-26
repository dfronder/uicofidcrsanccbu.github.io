/*
 * FILE NAME   : mylib.js
 * PROGRAMMER  : DC6
 * LAST UPDATE : 26.06.2024
 * PURPOSE     : Julia Fractal JavaScript file.
 */

import {timer} from "./timer.js";

class JuliaFractal {
  constructor(canvas) {
    this.timer = new timer();
    this.canvas = canvas;
    this.gl = null;
    this.timeLoc = null;
    this.mouseLoc = null;
    this.program = null;
    this.scale = 2.0;
    this.mousePos = { x: 0, y: 0 };
    this.start = { x: -1, y: -1 };
    this.end = { x: 1, y: 1 };
  }

  initGL() {
    this.canvas = document.getElementById("myCan");
    this.gl = this.canvas.getContext("webgl2");
    this.gl.clearColor(0.30, 0.47, 0.8, 1);

    const vertexShaderSource = 
    `#version 300 es
    precision highp float;

    in vec3 InPosition;
    out vec2 DrawPos;

    uniform float Time;

    void main( void )
    {
      gl_Position = vec4(InPosition, 1);
      DrawPos = InPosition.xy;
    }
    `;

    const fragmentShaderSource = 
    `#version 300 es
    precision highp float;

    out vec4 OutColor;
    in vec2 DrawPos;

    uniform float Time;
    uniform vec4 Mouse;

    #define START vec2(Mouse.xy)
    #define END vec2(Mouse.zw)

    void main( void )
    {
      vec2 C = vec2(0.35 + 0.05 * sin(Time * 1.30), 0.35 + 0.05 * sin(Time * 0.8));
      vec2 Z = mix(START, END, (DrawPos + 1.0) * 0.5);
      vec2 Zn = Z;
      int iterations = 0;
      const int maxIterations = 255;
      const float bailout = 2.0;

      while (iterations++ < maxIterations && length(Zn) <= bailout)
      {
        Zn = vec2(Zn.x * Zn.x - Zn.y * Zn.y, 2.0 * Zn.x * Zn.y) + C;
      }

      float colorFactor = float(iterations) / float(maxIterations);
      OutColor = vec4(0.9 - colorFactor,
                      0.9 - colorFactor * sin(2000.0) * 1.5,
                      0.9 - colorFactor * sin(2000.0) * 2.0, 1.0);
    }
    `;

    const vertexShader = this.compileShader(this.gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = this.compileShader(this.gl.FRAGMENT_SHADER, fragmentShaderSource);
    this.program = this.createProgram(vertexShader, fragmentShader);

    const vertexArray = this.gl.createVertexArray();
    this.gl.bindVertexArray(vertexArray);

    const vertices = new Float32Array([-1, 1, 0, -1, -1, 0, 1, 1, 0, 1, -1, 0]);
    const vertexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);

    const positionLoc = this.gl.getAttribLocation(this.program, "InPosition");
    this.gl.vertexAttribPointer(positionLoc, 3, this.gl.FLOAT, false, 0, 0);
    this.gl.enableVertexAttribArray(positionLoc);

    this.timeLoc = this.gl.getUniformLocation(this.program, "Time");
    this.mouseLoc = this.gl.getUniformLocation(this.program, "Mouse");

    this.gl.useProgram(this.program);
  }

  compileShader(type, source) {
    const shader = this.gl.createShader(type);
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error('Shader compile error:', this.gl.getShaderInfoLog(shader));
      this.gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  createProgram(vertexShader, fragmentShader) {
    const program = this.gl.createProgram();
    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);
    this.gl.linkProgram(program);
    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      console.error('Program link error:', this.gl.getProgramInfoLog(program));
      this.gl.deleteProgram(program);
      return null;
    }
    return program;
  }

  render() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    if (this.timeLoc) {
      this.gl.uniform1f(this.timeLoc, this.timer.pauseTime);
    }
    if (this.mouseLoc) {
      this.gl.uniform4fv(this.mouseLoc, new Float32Array([this.start.x, this.start.y, this.end.x, this.end.y]));
    }
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
  }
}

export function anim(...args) {
  return new JuliaFractal(...args);
}

window.addEventListener('keydown', (event) => {
  if (event.key.toLowerCase() === 'p') {
    window.anim.timer.isPause = !window.anim.timer.isPause;
  }
});

const canvasElement = document.getElementById("myCan");
canvasElement.onwheel = canvasElement.onmousewheel = (event) => {
  event.preventDefault();
};

/* END OF 'mylib.js' FILE */