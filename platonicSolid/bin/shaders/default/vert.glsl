#version 300 es
precision highp float;

in vec3 InPosition;
in vec3 InNormal;

out vec3 DrawPos;
out vec3 DrawNormal;

uniform float Time;
uniform mat4 MatrWVP;
uniform mat4 MatrW;
uniform mat4 MatrWInv;

void main( void )
{
  gl_Position = MatrWVP * vec4(InPosition, 1.0);
  DrawPos = vec3(MatrW * vec4(InPosition, 1.0));
  DrawNormal = mat3(MatrWInv) * InNormal;
}