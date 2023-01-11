import './style.css';
import * as THREE from 'three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// 地面
import Floor from './environment/scenefloor';
// 胡罗卜
import Carrot from './environment/carrot';

// 定义渲染尺寸
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

// 初始化渲染器
const canvas = document.querySelector('canvas.webgl');
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  alpha: true
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.physicallyCorrectLights = true;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 2;
renderer.outputEncoding = THREE.sRGBEncoding

// 初始化场景
const scene = new THREE.Scene();
// 初始化相机
const camera = new THREE.PerspectiveCamera(60, sizes.width / sizes.height, 1, 3000)
camera.position.set(0, 250, 2000);
camera.lookAt(new THREE.Vector3(0 , 0, 0));
// 镜头控制器
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.dampingFactor = 0.15;

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
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
}
tick();


// 创建地面
var floor;
const createFloor = () => {
  floor = new Floor();
  scene.add(floor.floorMesh);
}

createFloor();

// 创建胡罗卜
var carrot = [];
const createCarrot = () => {
  for (let i = 0; i < 25; i++) {
    carrot[i] = new Carrot();
    scene.add(carrot[i].carrotMesh);
  }
}

// createCarrot();
