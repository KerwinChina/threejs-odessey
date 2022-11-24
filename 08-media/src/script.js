import './style.css';
import * as THREE from 'three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

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
renderer.autoClear = false;
renderer.setClearAlpha(0);
renderer.physicallyCorrectLights = true;
renderer.toneMapping = THREE.CineonToneMapping;
renderer.toneMappingExposure = 2;

// 初始化场景
const scene = new THREE.Scene();
// 初始化相机
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 10000)
camera.position.set(0, 1, 5);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;

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

// 光照
const ambientLight = new THREE.AmbientLight(0xffffff, 5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight('#ffffff', 5);
directionalLight.castShadow = true;
directionalLight.shadow.camera.far = 20;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.normalBias = 0.05;
directionalLight.position.set(1, 3, 5);
scene.add(directionalLight);

// 加载管理
const loadingManager = new THREE.LoadingManager();
loadingManager.onLoad = () => {}

// 使用 dracoLoader 加载用blender压缩过的模型
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');
dracoLoader.setDecoderConfig({ type: 'js' });
const loader = new GLTFLoader(loadingManager);
loader.setDRACOLoader(dracoLoader);

// 加载模型
const video = document.getElementById('video');
const videoTexture = new THREE.VideoTexture(video);

const screen = {
  mesh: null,
  material: null,
  videoMaterial: null
};

loader.load('/models/iphone.glb', mesh => {
  if (mesh.scene) {
    mesh.scene.traverse(item => {
      if (item.isMesh) {
        if (item.name === '屏幕') {

          // item.material.metalness = .5
          screen.mesh = item;
          screen.material = item.material;
          screen.videoMaterial = new THREE.MeshPhysicalMaterial({
            map: videoTexture
          });
        }
        if (item.name.includes('边框')) {
          console.log(item)
          item.material.metalness = .7
        }
        if (item.name.includes('logo')) {
          console.log(item)
          item.material.metalness = 1
        }
      }
    })
    mesh.scene.scale.set(36, 36, 36);
    mesh.scene.position.y = -3;
    mesh.scene.rotation.y= -Math.PI;
    mesh.scene.layers.set(0);
    scene.add(mesh.scene);
  }
});

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
window.addEventListener('click', event => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects([screen.mesh]);
  if (intersects.length > 0) {
    const mesh = intersects[0].object;
    if (mesh.material.type === 'MeshStandardMaterial') {
      mesh.material = screen.videoMaterial;
    } else {
      mesh.material = screen.material;
    }
  }
}, false);

// 动画
const tick = () => {
  renderer.render(scene, camera);
  // 页面重绘时调用自身
  controls && controls.update();
  window.requestAnimationFrame(tick);
}
tick();