#version 300 es
precision highp float;

out vec4 OutColor;

in vec3 DrawPos;
in vec3 DrawNormal;

uniform float Time;

void main( void )
{
  vec3 L = normalize(vec3(0.5, 0.5, 0.5));
  vec3 N = normalize(DrawNormal);
  N = faceforward(N, normalize(DrawPos), N);
  N = vec3(N.x, -N.y, N.z);
  vec3 col = dot(L, normalize(N)) * vec3(0.5, 0.5, 0.5);
  OutColor = vec4(col, 1.0);
}