#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_selection;

#define RANGE 3.0
// see: https://gist.github.com/DonKarlssonSan/f87ba5e4e5f1093cb83e39024a6a5e72
#define cx_mul(a, b) vec2(a.x*b.x-a.y*b.y, a.x*b.y+a.y*b.x)

void main( void ) {
//UV
//normalize uv to [-1;1] and adjust aspect ratio
  vec2 p = (gl_FragCoord.xy * 2. - u_resolution) / min(u_resolution.x, u_resolution.y) * RANGE;
  vec4 colour = vec4(0.);
  float alpha = 1.0;

  if        (u_selection < 0.1){
     // Implicit/ Backwards Euler
    vec4 base_colour = vec4(0.757, 1., 0.604 , alpha); 
    colour += length(vec2(1., 0.)-p)>1.0?base_colour:vec4(0.0);
  } else if (u_selection < 0.2){
    // Trapezoidal rule
    vec4 base_colour = vec4(0.953, 0.886, 0.18 , alpha); 
    colour += p.x<0.?base_colour:vec4(0.0); 
  } else if (u_selection < 0.3){
    //RK1 = Expl Euler
    vec4 base_colour = vec4(1., 0.29, 0.365 , alpha); 
    colour += length(vec2(1., 0.)+p)<1.0?base_colour:vec4(0.0); 
  } else if (u_selection < 0.4){
    //RK2
    vec4 base_colour = vec4(1., 0.776, 1. , alpha); 
    colour += length(vec2(1., 0.)+p+cx_mul(p,p)*0.5)<1.0?base_colour:vec4(0.0); 
  } else if (u_selection < 0.5){
    //RK3
    vec4 base_colour = vec4(0.937, 0.561, 1. , alpha); 
    colour += length(vec2(1., 0.)+p+cx_mul(p,p)*0.5+ cx_mul(cx_mul(p,p),p)/6.0)<1.0?base_colour:vec4(0.0); 
  } else if (u_selection < 0.6){
    //RK4
    vec4 base_colour = vec4(0.871, 0.345, 1. , alpha); 
    colour =+ length(vec2(1., 0.)+p+cx_mul(p,p)*.5+cx_mul(cx_mul(p,p),p)/6.+cx_mul(p,cx_mul(cx_mul(p,p),p))/24.)<1.0?base_colour:vec4(0.0); 
  } 
  
  gl_FragColor = colour;
}