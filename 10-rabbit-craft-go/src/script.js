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
// 苹果
import Apple from './environment/apples';


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



// 光照
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight('#ffffff', 1);
directionalLight.castShadow = true;
directionalLight.shadow.camera.far = 20;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.normalBias = 0.05;
directionalLight.position.set(1, 3, 5);
scene.add(directionalLight);

// 创建场景
var floor = null;
var rabbit = null;
var carrot = [];
var apples = [];
var apple = [];
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

  // 创建苹果
  for (let i = 0; i < 25; i++) {
    apple[i] = new Apple();
    scene.add(apple[i].appleMesh);
    apples.push(apple[i].appleMesh);
  }

  // 创建瀑布
  waterfall = new Waterfall();
  scene.add(waterfall.waterfallMesh);
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

const getCarrot = (i, x) => {
  setTimeout(() => {
    rabbit.jump();
  }, 500);
  carrot[i].carrotMesh.position.set(0 + x, -10, 910);
}

const getApple = (i, x) => {
  setTimeout(() => {
    rabbit.jump();
  }, 500);
  apple[i].appleMesh.position.set(-20 + x, -10, 910);
  apple[i].appleMesh.rotation.set(0, 0, 0.1);
}


// 检查边界
const checkCollision = () => {
  //COLLISION WITH CARROTS
  for (let i = 0; i < 25; i++) {
    var rabbCarr = rabbit.rabbitMesh.position
      .clone()
      .sub(carrot[i].carrotMesh.position.clone());
    if (rabbCarr.length() <= 25) {
      getCarrot(i, i * 20);
      carrots.push(carrot[i].carrotMesh);
    }
  }
  //COLLISION WITH APPLES
  for (let i = 0; i < apples.length; i++) {
    var rabbApple = rabbit.rabbitMesh.position
      .clone()
      .sub(apple[i].appleMesh.position.clone());
    if (rabbApple.length() <= 25) {
      getApple(i, -i * 20);
    }
  }
  //IF END OF FLOOR
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
      drops.push(new Waterfall());
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


  controls && controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
}
tick();