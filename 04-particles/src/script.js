import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';

console.log(dat)

// 定义渲染尺寸
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

// 初始化渲染器
const canvas = document.querySelector('canvas.webgl');
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// 初始化场景
const scene = new THREE.Scene();

// 初始化相机
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 1000)
camera.position.z = 150
camera.lookAt(new THREE.Vector3(0, 0, 0))
scene.add(camera);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// 页面缩放事件监听
window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  // 更新渲染
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  // 更新相机
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
});

// 动画
const tick = () => {
  controls && controls.update();
  // 更新渲染器
  renderer.render(scene, camera);
  // 页面重绘时调用自身
  window.requestAnimationFrame(tick);
}
tick();

// 01 使用THREE.Sprite创建粒子
const createParticlesBySprite = () => {
  for (let x = -15; x < 15; x++) {
    for(let y = -10; y < 10; y++) {
      let material = new THREE.SpriteMaterial({
        color: Math.random() * 0xffffff
      });
      let sprite = new THREE.Sprite(material);
      sprite.position.set(x * 4, y * 4, 0);
      scene.add(sprite);
    }
  }
}

// createParticlesBySprite();

// 02
const createParticlesByPoints = () => {
  const geom = new THREE.BufferGeometry();
  const material = new THREE.PointsMaterial({
    size: 2,
    vertexColors: true,
    color: 0xffffff
  });
  let veticsFloat32Array = []
  let veticsColors = []
  for (let x = -15; x < 15; x++) {
    for (let y = -10; y < 10; y++) {
        veticsFloat32Array.push(x * 4, y * 4, 0);
        const randomColor = new THREE.Color(Math.random() * 0xffffff);
        veticsColors.push(randomColor.r, randomColor.g, randomColor.b);
    }
  }
  const vertices = new THREE.Float32BufferAttribute(veticsFloat32Array, 3);
  const colors = new THREE.Float32BufferAttribute(veticsColors, 3);
  geom.attributes.position = vertices;
  geom.attributes.color = colors;
  const particles = new THREE.Points(geom, material);
  scene.add(particles);
}

// createParticlesByPoints();

// 03 粒子样式化
const createStyledParticlesByPoints = (ctrls) => {
  const geom = new THREE.BufferGeometry();
  const material = new THREE.PointsMaterial({
    size: ctrls.size,
    transparent: ctrls.transparent,
    opacity: ctrls.opacity,
    color: new THREE.Color(ctrls.color),
    vertexColors: ctrls.vertexColors,
    sizeAttenuation: ctrls.sizeAttenuation
  });
  let veticsFloat32Array = []
  let veticsColors = []
  for (let x = -15; x < 15; x++) {
    for (let y = -10; y < 10; y++) {
        veticsFloat32Array.push(x * 4, y * 4, 0)
        const randomColor = new THREE.Color(Math.random() * ctrls.vertexColor)
        veticsColors.push(randomColor.r, randomColor.g, randomColor.b)
    }
  }
  const vertices = new THREE.Float32BufferAttribute(veticsFloat32Array, 3)
  const colors = new THREE.Float32BufferAttribute(veticsColors, 3)
  geom.attributes.position = vertices;
  geom.attributes.color = colors;
  const particles = new THREE.Points(geom, material);
  particles.name = 'particles';
  scene.add(particles)
}

const ctrls = new function () {
  this.size = 5;
  this.transparent = true;
  this.opacity = 0.6;
  this.vertexColors = true;
  this.color = 0xffffff;
  this.vertexColor = 0x00ff00;
  this.sizeAttenuation = true;
  this.rotate = true;
  this.redraw = function () {
    if (scene.getObjectByName("particles")) {
      scene.remove(scene.getObjectByName("particles"));
    }
    createStyledParticlesByPoints({
      size: ctrls.size,
      transparent: ctrls.transparent,
      opacity: ctrls.opacity,
      vertexColors: ctrls.vertexColors,
      sizeAttenuation: ctrls.sizeAttenuation,
      color: ctrls.color,
      vertexColor: ctrls.vertexColor
    });
  };
}
const gui = new dat.GUI();
gui.add(ctrls, 'size', 0, 10).onChange(ctrls.redraw);
gui.add(ctrls, 'transparent').onChange(ctrls.redraw);
gui.add(ctrls, 'opacity', 0, 1).onChange(ctrls.redraw);
gui.add(ctrls, 'vertexColors').onChange(ctrls.redraw);
gui.addColor(ctrls, 'color').onChange(ctrls.redraw);
gui.addColor(ctrls, 'vertexColor').onChange(ctrls.redraw);
gui.add(ctrls, 'sizeAttenuation').onChange(ctrls.redraw);
gui.hide();

const methods3 = () => {
  ctrls.redraw();
  gui.show();
}

methods3();
