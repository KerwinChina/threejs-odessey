import './style.css';
import * as THREE from 'three';
import { PerspectiveCamera, sRGBEncoding, WebGLRenderer } from 'three';

// 定义渲染尺寸
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

const section = document.getElementsByClassName('section')[0];
let oldMaterial;
let width = section.clientWidth;
let height = section.clientHeight;

// 初始化渲染器
const canvas = document.querySelector('canvas.webgl');
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#canvas-container'),
  antialias: true,
  alpha: true,
  powerPreference: 'high-performance'
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.autoClear= true;
renderer.outputEncoding = sRGBEncoding;

const renderer2 = new WebGLRenderer({
  canvas: document.querySelector('#canvas-container-details'),
  antialias: false
});
renderer2.setPixelRatio(Math.min(window.devicePixelRatio, 1));
renderer2.setSize(width, height);
renderer2.outputEncoding = sRGBEncoding;

// 初始化场景
const scene = new THREE.Scene();

// 初始化相机
const cameraGroup = new THREE.Group();
scene.add(cameraGroup);
const camera = new THREE.PerspectiveCamera(35, width / height, 1, 100)
camera.position.set(19, 1.54, -.1);
cameraGroup.add(camera);

const camera2 = new THREE.PerspectiveCamera(35, section.clientWidth / section.clientWidth, 1, 100);
camera2.position.set(3.2, 2.8, 3.2);
camera2.rotation.set(0, 1, 0);
scene.add(camera2);

// 页面缩放事件监听
window.addEventListener('resize', () => {
  camera.aspect = section.clientWidth / section.clientHeight
  camera.updateProjectionMatrix();

  camera2.aspect = section.clientWidth / section.clientHeight;
  camera2.updateProjectionMatrix();

  renderer.setSize(section.clientWidth, section.clientHeight);
  renderer2.setSize(section.clientWidth, section.clientHeight);

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));
  renderer2.setPixelRatio(Math.min(window.devicePixelRatio, 1));
});

// 直射光
const sunLight = new THREE.DirectionalLight(0x435c72, .08);
sunLight.position.set(-100, 0, -100);
scene.add(sunLight);

// 点光源
const fillLight = new THREE.PointLight(0x88b2d9, 2.7, 4, 3);
fillLight.position.set(30, 3, 1.8);
scene.add(fillLight);

// 加载管理
const ftsLoader = document.querySelector('.lds-roller');
const loadingCover = document.getElementById('loading-text-intro');
const loadingManager = new THREE.LoadingManager();
loadingManager.onLoad = () => {
  document.querySelector('content').style.visibility = 'visible';
  const yPosition = { y: 0 };
}

// 动画
const tick = () => {
  // 更新渲染器
  renderer.render(scene, camera);
  // 页面重绘时调用自身
  window.requestAnimationFrame(tick);
}
tick();