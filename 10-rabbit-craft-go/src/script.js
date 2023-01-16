import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// 地面
import Floor from './environment/scenefloor';
// 胡罗卜
import Carrot from './environment/carrot';
// 兔子
import Rabbit from './environment/rabbit';
// 瀑布
import Waterfall from './environment/waterfall';

import gsap from 'gsap'

console.log(gsap)

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
// renderer.toneMapping = THREE.ACESFilmicToneMapping;
// renderer.toneMappingExposure = 2;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.shadowMapEnabled = true;
renderer.shadowMap.enabled = true;
renderer.shadowMap.needsUpdate = true;

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

// 光照
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight.castShadow = true;
directionalLight.shadow.camera.far = 20000;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.normalBias = 0.05;
directionalLight.shadow.camera.top = 800;
directionalLight.shadow.camera.bottom = -800;
directionalLight.shadow.camera.left = -800;
directionalLight.shadow.camera.right = 800;
directionalLight.position.set(600, 1200, 800);
scene.add(directionalLight);

const cubeGeometry = new THREE.BoxGeometry(0.001, 0.001, 0.001);
const cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.set(0, 0, 0);

directionalLight.target = cube;


var helper = new THREE.DirectionalLightHelper(directionalLight, 500, 0xff0000);
scene.add(helper)

// const grid = new THREE.GridHelper(2000, 2000, 0x000000, 0x000000);
// grid.position.set(0, 0, 0);
// grid.material.transparent = true;
// grid.material.opacity = 0.1;
// scene.add(grid);

// 创建场景
var floor = null;
var rabbit = null;
var carrot = [];
var waterfall = null;
const createWorld = () => {
  // 创建地面
  floor = new Floor();
  scene.add(floor.floorMesh);
  // 创建兔子
  rabbit = new Rabbit();
  scene.add(rabbit.rabbitMesh);
  rabbit.nod();

  // 创建胡罗卜
  for (let i = 0; i < 25; i++) {
    carrot[i] = new Carrot();
    scene.add(carrot[i].carrotMesh);
  }

  // 创建瀑布
  waterfall = new Waterfall(scene);
  scene.add(waterfall.drop);
}

createWorld();

var clock = new THREE.Clock();

var rabbitRunning = false;
var rabbitMoving = false;
var rabbitJumping = false;

const rabbitControl = {
  tureLeft: () => {
    rabbit && (rabbit.rabbitMesh.rotation.y -= Math.PI / 2);
  },
  turnRight: () => {
    rabbit && (rabbit.rabbitMesh.rotation.y += Math.PI / 2);
  },
  stopMove: () => {
    rabbitMoving = false;
    rabbit.killMove();
    rabbit.nod();
  },
}


// 键盘监听
document.addEventListener('keydown', e => {
  if (e && e.keyCode) {
    console.log(e.keyCode)
    switch(e.keyCode) {
      // 左
      case 65:
      case 37:
        rabbitControl.tureLeft();
        break;
      // 右
      case 68:
      case 39:
        rabbitControl.turnRight();
        break;
      // 前
      case 87:
      case 38:
        rabbitMoving = true;
        break;
      // 空格键
      case 32:
        !rabbitJumping && rabbit.jump() && (rabbitJumping = true);
        break;
      default:
        break;
    }
  }
});

document.addEventListener('keyup', e => {
  if (e && e.keyCode) {
    switch(e.keyCode) {
      case 83:
      case 40:
      case 87:
      case 38:
        rabbitMoving = false;
        rabbit.killMove();
        rabbit.nod();
        break;
      case 32:
        setTimeout(() => {
          rabbitJumping = false;
        }, 800);
        break;
    }
  }
})

var isGetCarrot = false;
var toggleSetCarrot = true;

const setCarrot = () => {
  if (toggleSetCarrot === true) {
    setTimeout(() => {
      carrot.forEach(carrot => {
        carrot.carrotMesh.position.set(
          170 * Math.random() * 3 + 300,
          -12,
          1400 * Math.random() * 1.2 - 900
        );
      });
    }, 500);
  }
}

setCarrot();

const getCarrot = (i, x) => {
  setTimeout(() => {
    rabbit.jump();
  }, 500);
  carrot[i].carrotMesh.position.set(0 + x, -10, 910);
}

var carrots = [];
var roundCount = 0;


// 检查边界
const checkCollision = () => {
  for (let i = 0; i < 25; i++) {
    var rabbCarr = rabbit.rabbitMesh.position
      .clone()
      .sub(carrot[i].carrotMesh.position.clone());
    if (rabbCarr.length() <= 25) {
      getCarrot(i, i * 20);
      carrots.push(carrot[i].carrotMesh);
    }
  }

  // 检查是否是地面的边界
  var rabbFloor = floor.floorMesh.position
    .clone()
    .sub(rabbit.rabbitMesh.position.clone());
  if (
    rabbFloor.x <= -900 ||
    rabbFloor.x >= 900 ||
    rabbFloor.z <= -900 ||
    rabbFloor.z >= 900
  ) {
    rabbit.fall();
  }
  //IF END OF STREAM
  var rabbStream = rabbit.rabbitMesh.position
    .clone()
    .sub(floor.streamMesh.position.clone());
  if (
    (rabbStream.x >= -97 &&
      rabbStream.x <= 97 &&
      rabbStream.z >= -900 &&
      rabbStream.z <= 688) ||
    (rabbStream.x >= -97 && rabbStream.x <= 97 && rabbStream.z >= 712)
  ) {
    rabbit.fall();
  }
}

const checkPlay = arr => {
  let count = roundCount;
  if (arr.length === 2) {
    roundCount++;
    for (let i = 0; i <= 2; i++) {
      arr.shift(arr[i]);
    }
  }
  if (roundCount > count) {
    return (toggleSetCarrot = true);
  }
  if ((toggleSetCarrot = true)) {
    setTimeout(() => {
      count++;
    }, 1200);
  }
  return (toggleSetCarrot = false);
}

var drops = [];
var count = 0;


// 动画
const tick = () => {
  // 兔子动画
  if (rabbitMoving === true) {
    checkCollision();
    rabbit.killNod();
    rabbit.move();
  }
  if (rabbitRunning === true) {
    rabbit.killNod();
    rabbit.run();
  }

  // 瀑布动画
  if (count % 3 == 0) {
    for (let i = 0; i < 7; i++) {
      drops.push(new Waterfall(scene));
    }
  }
  count++;
  for (var i = 0; i < drops.length; i++) {
    drops[i].update();
    if (drops[i].lifespan < 0) {
      scene.remove(scene.getObjectById(drops[i].drop.id));
      drops.splice(i, 1);
    }
  }

  checkPlay(carrots);

  controls && controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
}
tick();