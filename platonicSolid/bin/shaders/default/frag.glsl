#version 300 es
precision highp float;

in vec3 DrawNormal;
in vec3 DrawPos;

uniform float Time;

out vec4 OutColor;
    
void main( void )
{
  vec3 L = normalize(vec3(0.8, 0.47, 1.0));
  vec3 N = normalize(DrawNormal);
  N = faceforward(N, normalize(DrawPos), N);
  N = vec3(N.x, -N.y, N.z);
  float k = dot(L, normalize(N));
  OutColor = vec4(k * vec3(0.5, 0.5, 0.5), 1.0);
}
