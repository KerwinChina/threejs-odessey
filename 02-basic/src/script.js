import './style.css';
import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

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
scene.background = new THREE.Color(0x1A1A1A);
scene.fog = new THREE.Fog(0x1A1A1A, 1, 1000);

// 初始化相机
const camera = new THREE.PerspectiveCamera(40, sizes.width / sizes.height)
scene.add(camera);

camera.position.set(20, 100, 450);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const light = new THREE.AmbientLight(0xdeedff, 1.5);
scene.add(light);

// 创建网格对象
const SphereMaterial = new THREE.MeshLambertMaterial({
  color: 0x03c03c,
  wireframe: true,
});
const SphereGeometry = new THREE.SphereGeometry(80, 32, 32);
const planet = new THREE.Mesh(SphereGeometry, SphereMaterial);
scene.add(planet);

const TorusGeometry = new THREE.TorusBufferGeometry(150, 8, 2, 120);
const TorusMaterial = new THREE.MeshLambertMaterial({
  color: 0x40a9ff,
  wireframe: true
});
const ring = new THREE.Mesh(TorusGeometry, TorusMaterial);
ring.rotation.x = Math.PI / 2;
ring.rotation.y = -0.1 * (Math.PI / 2);
scene.add(ring);

const meshList = [];
const IcoGeometry = new THREE.IcosahedronGeometry(16, 0);
const IcoMaterial = new THREE.MeshToonMaterial({ color: 0xfffc00 });
const IcoMesh = new THREE.Mesh(IcoGeometry, IcoMaterial);
scene.add(IcoMesh);
meshList.push(IcoMesh);

const stars = new THREE.Object3D();
for (let i = 0; i < 500; i++) {
  const geometry = new THREE.IcosahedronGeometry(Math.random() * 2, 0);
  const material = new THREE.MeshToonMaterial({ color: 0xeeeeee });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.x = (Math.random() - 0.5) * 700;
  mesh.position.y = (Math.random() - 0.5) * 700;
  mesh.position.z = (Math.random() - 0.5) * 700;
  mesh.rotation.x = Math.random() * 2 * Math.PI;
  mesh.rotation.y = Math.random() * 2 * Math.PI;
  mesh.rotation.z = Math.random() * 2 * Math.PI;
  stars.add(mesh);
}

scene.add(stars);

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

let rot = 0;

// 动画
const axis = new THREE.Vector3(0, 0, 1);
const tick = () => {
  // 更新渲染器
  renderer.render(scene, camera);
  // 给网格模型添加一个转动动画
  rot += Math.random() * 0.8;
  const radian = (rot * Math.PI) / 180;
  IcoMesh.position.x = 250 * Math.sin(radian);
  IcoMesh.position.y = 100 * Math.cos(radian);
  IcoMesh.position.z = -100 * Math.cos(radian);
  IcoMesh.rotation.x += 0.005;
  IcoMesh.rotation.y += 0.005;
  IcoMesh.rotation.z -= 0.005;
  controls.update();
  stars.rotation.y += 0.0009;
  stars.rotation.z -= 0.0003;
  planet && (planet.rotation.y += .005)
  ring && ring.rotateOnAxis(axis, Math.PI / 400);
  // 页面重绘时调用自身
  window.requestAnimationFrame(tick);
}
tick();