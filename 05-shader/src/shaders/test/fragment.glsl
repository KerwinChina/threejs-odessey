varying vec2 vUv;

void main() {
  // // pattern 1
  // gl_FragColor = vec4(vUv, 1.0, 1.0);

  // // pattern 2
  // gl_FragColor = vec4(vUv, 0.0, 1.0);

  // // pattern 3
  // float strength = vUv.x;
  // gl_FragColor = vec4(vec3(strength), 1.0);
  // 等价于
  // gl_FragColor = vec4(vUv.x, vUv.x, vUv.x, 1.0);

  // // pattern 4
  // float strength = vUv.y;
  // gl_FragColor = vec4(vec3(strength), 1.0);

  // // pattern 5
  // float strength = 1.0 - vUv.y;
  // gl_FragColor = vec4(vec3(strength), 1.0);

  // pattern 6
  // float strength = vUv.y * 10.0;
  // gl_FragColor = vec4(vec3(strength), 1.0);

  // pattern 7
  // float strength = mod(vUv.y * 10.0, 1.0);
  // gl_FragColor = vec4(vec3(strength), 1.0);

  // pattern 8
  // float strength = mod(vUv.y * 10.0, 1.0);
  // strength = step(0.5, strength);
  // gl_FragColor = vec4(vec3(strength), 1.0);

  // pattern 9
  // float strength = mod(vUv.y * 10.0, 1.0);
  // strength = step(0.8, strength);
  // gl_FragColor = vec4(vec3(strength), 1.0);

  // pattern 10
  // float strength = mod(vUv.x * 10.0, 1.0);
  // strength = step(0.8, strength);
  // gl_FragColor = vec4(vec3(strength), 1.0);

  // pattern 11
  // float strength = step(0.8, mod(vUv.x * 10.0, 1.0));
  // strength += step(0.8, mod(vUv.y * 10.0, 1.0));
  // strength = clamp(strength, 0.0, 1.0);
  // gl_FragColor = vec4(vec3(strength), 1.0);

  // pattern 12
  // float strength = step(0.8, mod(vUv.x * 10.0, 1.0));
  // strength *= step(0.8, mod(vUv.y * 10.0, 1.0));
  // gl_FragColor = vec4(vec3(strength), 1.0);

  // pattern 13
  // float strength = step(0.4, mod(vUv.x * 10.0, 1.0));
  // strength *= step(0.8, mod(vUv.y * 10.0, 1.0));
  // gl_FragColor = vec4(vec3(strength), 1.0);

  // pattern 14
  float barX = step(0.4, mod(vUv.x * 10.0, 1.0)) * step(0.8, mod(vUv.y * 10.0, 1.0));
  float barY = step(0.8, mod(vUv.x * 10.0, 1.0)) * step(0.4, mod(vUv.y * 10.0, 1.0));
  float strength = barX + barY;
  strength = clamp(strength, 0.0, 1.0);
  gl_FragColor = vec4(vec3(strength), 1.0);

}