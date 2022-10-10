import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

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
        veticsFloat32Array.push(x * 4, y * 4, 0)
        const randomColor = new THREE.Color(Math.random() * 0xffffff)
        veticsColors.push(randomColor.r, randomColor.g, randomColor.b)
    }
  }
  const vertices = new THREE.Float32BufferAttribute(veticsFloat32Array, 3)
  const colors = new THREE.Float32BufferAttribute(veticsColors, 3)
  geom.attributes.position = vertices
  geom.attributes.color = colors
  const cloud = new THREE.Points(geom, material)
  scene.add(cloud)
}

createParticlesByPoints();