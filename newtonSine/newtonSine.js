/*
 * FILE NAME   : newtonSine.js
 * PROGRAMMER  : DC6
 * LAST UPDATE : 06.06.2024
 * PURPOSE     : Newton fractal with sine java script file.
 */

let
  canvas,
  gl;    
 
// OpenGL initialization function  
export function initGL() {
  canvas = document.getElementById("myCan");
  gl = canvas.getContext("webgl2");
  gl.clearColor(0.30, 0.47, 0.8, 1);
  
  // Shader creation
  let vs_txt =
  `#version 300 es
  precision highp float;
  in vec3 InPosition;
    
  out vec2 DrawPos;
 
  void main( void )
  {
    gl_Position = vec4(InPosition, 1);
    DrawPos = InPosition.xy;
  }
  `;
  let fs_txt =
  `#version 300 es
  precision highp float;
  out vec4 OutColor;
  
  in vec2 DrawPos;
 
  vec2 CmplSin( vec2 Z )
  {
    return vec2(sin(Z.x) * cosh(Z.y), cos(Z.x) * sinh(Z.y));
  }
  
  vec2 CmplCos( vec2 Z )
  {
    return vec2(cos(Z.x) * cosh(Z.y), -sin(Z.x) * sinh(Z.y));
  }

  vec2 CmplDivCmpl( vec2 Z1, vec2 Z2 )
  {
    return vec2((Z1.x * Z2.x + Z1.y * Z2.y) / (Z2.x * Z2.x + Z2.y * Z2.y),
                (Z1.y * Z2.x - Z1.x * Z2.y) / (Z2.x * Z2.x + Z2.y * Z2.y));
  }

  void main( void )
  {
    vec2 DrawPos = vec2(DrawPos.x + 1.4, DrawPos.y + 0.9) * 0.3;
    vec2 z = (DrawPos * 0.25 - 0.5) * 4.0 - vec2(0.0, 1.5);
    int n;

    for (n = 0; n < 255; n++)
    {
      z = z - CmplDivCmpl(CmplSin(z), CmplCos(z));
      if (length(CmplSin(z)) < 1e-6) break;
    }
    
    OutColor = vec4(float(n) / 255.0, float(n) / 8.0 / 255.0, float(n) * 8.0 / 255.0, 1.0);
  }
  `;
  let
    vs = loadShader(gl.VERTEX_SHADER, vs_txt),
    fs = loadShader(gl.FRAGMENT_SHADER, fs_txt),
    prg = gl.createProgram();
  gl.attachShader(prg, vs);
  gl.attachShader(prg, fs);
  gl.linkProgram(prg);
  if (!gl.getProgramParameter(prg, gl.LINK_STATUS)) {
    let buf = gl.getProgramInfoLog(prg);
    console.log('Shader program link fail: ' + buf);
  }                                            
 
  // Vertex buffer creation
  const size = 1;
  const vertexes = [-size, size, 0, -size, -size, 0, size, size, 0, size, -size, 0];
  const posLoc = gl.getAttribLocation(prg, "InPosition");
  let vertexArray = gl.createVertexArray();
  gl.bindVertexArray(vertexArray);
  let vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexes), gl.STATIC_DRAW);
  if (posLoc != -1) {
    gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(posLoc);
  }
  
  gl.useProgram(prg);
}  // End of 'initGL' function               
 
// Load and compile shader function
function loadShader(shaderType, shaderSource) {
  const shader = gl.createShader(shaderType);
  gl.shaderSource(shader, shaderSource);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    let buf = gl.getShaderInfoLog(shader);
    console.log('Shader compile fail: ' + buf);
  }                                            
  return shader;
} // End of 'loadShader' function
 
// Main render frame function
export function render() {
  // console.log(`Frame ${x++}`);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
} // End of 'render' function

/* END OF 'newtonSine.js' FILE */