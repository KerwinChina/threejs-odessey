export default `
  uniform float time;
  uniform float progress;
  uniform sampler2D sceneDestination;
  uniform sampler2D sceneOrigin;
  uniform sampler2D texture1;
  uniform vec4 resolution;
  varying vec2 vUv;
  varying vec3 vPosition;
  float PI = 3.141592653589793238;

  vec2 distort(vec2 olduv, float pr, float expo) {
  vec2 p0 = 2.*olduv - 1.;
  vec2 p1 = p0/(1. - pr*length(p0)*expo);
  return (p1 + 1.)*0.5;
  }

  void main(){

    float progress1 = smoothstep(0.10, 1.0, progress);

    // 有穿梭效果
    // vec2 uv1 = distort(vUv, -90.*progress, progress*4.);
    // vec4 sPlanet = texture2D(sceneOrigin, uv1);
    // vec4 s360 = texture2D(sceneDestination, vUv);

    // float mixer = progress1;
    // gl_FragColor = s360;
    // vec4 finalTexture = mix(sPlanet, s360, mixer);
    // gl_FragColor = finalTexture;


    // 没有穿梭效果
    vec4 sPlanet = texture2D(sceneOrigin, vUv);
    vec4 s360 = texture2D(sceneDestination, vUv);

    float mixer = progress1;
    gl_FragColor = s360;
    vec4 finalTexture = mix(sPlanet, s360, mixer);
    gl_FragColor = finalTexture;
  }
`;
