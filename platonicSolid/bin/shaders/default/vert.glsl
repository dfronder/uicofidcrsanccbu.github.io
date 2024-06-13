#version 300 es
precision highp float;

in vec3 InPosition;
in vec3 InNormal;

uniform float Time;
uniform mat4 MatrProj;
uniform mat4 MatrW;

out vec3 DrawNormal;
out vec3 DrawPos;
    
void main( void )
{
  gl_Position = MatrProj * vec4(InPosition, 1.0);
  DrawPos = vec3(MatrW * vec4(InPosition.xyz, 1.0));
  DrawNormal = mat3(transpose(inverse(MatrW))) * InNormal;
}
