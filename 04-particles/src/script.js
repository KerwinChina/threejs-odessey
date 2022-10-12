import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

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
// tick();

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
// methods3();

// 04 canvasRenderer
function createCanvasSprites () {
  const createGhostTexture = () => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    // the body
    ctx.translate(-81, -84)
    ctx.fillStyle = 'orange'
    ctx.beginPath()
    ctx.moveTo(83, 116)
    ctx.lineTo(83, 102)
    ctx.bezierCurveTo(83, 94, 89, 88, 97, 88)
    ctx.bezierCurveTo(105, 88, 111, 94, 111, 102)
    ctx.lineTo(111, 116)
    ctx.lineTo(106.333, 111.333)
    ctx.lineTo(101.666, 116)
    ctx.lineTo(97, 111.333)
    ctx.lineTo(92.333, 116)
    ctx.lineTo(87.666, 111.333)
    ctx.lineTo(83, 116)
    ctx.fill()
    // the eyes
    ctx.fillStyle = 'white'
    ctx.beginPath()
    ctx.moveTo(91, 96)
    ctx.bezierCurveTo(88, 96, 87, 99, 87, 101)
    ctx.bezierCurveTo(87, 103, 88, 106, 91, 106)
    ctx.bezierCurveTo(94, 106, 95, 103, 95, 101)
    ctx.bezierCurveTo(95, 99, 94, 96, 91, 96)
    ctx.moveTo(103, 96)
    ctx.bezierCurveTo(100, 96, 99, 99, 99, 101)
    ctx.bezierCurveTo(99, 103, 100, 106, 103, 106)
    ctx.bezierCurveTo(106, 106, 107, 103, 107, 101)
    ctx.bezierCurveTo(107, 99, 106, 96, 103, 96)
    ctx.fill()
    // the pupils
    ctx.fillStyle = 'blue'
    ctx.beginPath()
    ctx.arc(101, 102, 2, 0, Math.PI * 2, true)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(89, 102, 2, 0, Math.PI * 2, true)
    ctx.fill()
    const texture = new THREE.Texture(canvas)
    texture.needsUpdate = true
    return texture
  }

  // 05 使用纹理样式化粒子
  const texture = new THREE.TextureLoader().load('/images/heart.png');
  console.log(texture)

  const createCloud = (size, transparent, opacity, sizeAttenuation, color) => {
    const geom = new THREE.BufferGeometry()
    const material = new THREE.PointsMaterial({
      'size': size,
      'transparent': transparent,
      'opacity': opacity,
      // 'map': createGhostTexture(),
      'map': texture,
      'sizeAttenuation': sizeAttenuation,
      'color': color
    })
    let veticsFloat32Array = []
    const range = 500
    for (let i = 0; i < 1000; i++) {
      const particle = new THREE.Vector3(Math.random() * range - range / 2, Math.random() * range - range / 2, Math.random() * range - range / 2)
      veticsFloat32Array.push(particle.x, particle.y, particle.z)
    }
    const vertices = new THREE.Float32BufferAttribute(veticsFloat32Array, 3)
    geom.attributes.position = vertices
    const cloud = new THREE.Points(geom, material)
    console.log(cloud)
    scene.add(cloud)
  }
  createCloud(20, true, 0.6, true, 0xffffff)
}
// createCanvasSprites()


// 从高级几何体创建 THREE.Points
// 创建canvas纹理
function generateSprite() {
  const canvas = document.createElement('canvas')
  canvas.width = 16
  canvas.height = 16

  const context = canvas.getContext('2d')
  const gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2)
  gradient.addColorStop(0, 'rgba(255,255,255,1)')
  gradient.addColorStop(0.2, 'rgba(0,255,255,1)')
  gradient.addColorStop(0.4, 'rgba(0,0,64,1)')
  gradient.addColorStop(1, 'rgba(0,0,0,1)')

  context.fillStyle = gradient
  context.fillRect(0, 0, canvas.width, canvas.height)

  const texture = new THREE.Texture(canvas)
  texture.needsUpdate = true
  return texture
}
// 创建立方体
const boxGeometry = new THREE.SphereGeometry( 15, 32, 16 );
// 创建粒子材质
const material = new THREE.PointsMaterial({
  'color': 0xffffff,
  'size': 3,
  'transparent': true,
  'blending': THREE.AdditiveBlending,
  'map': generateSprite(),
  'depthWrite': false
})
// 创建粒子
const cloud = new THREE.Points(boxGeometry, material)
// scene.add(cloud)


// final
const final = () => {
  document.querySelector('.title-zone').style.display = 'block';
  controls.dispose();
  const rand = (min, max) => min + Math.random() * (max - min);
  const P_COUNT = 1000;
  let astronaut = null, t = 0;
  // 雾化效果
  scene.fog = new THREE.FogExp2(0x000000, 0.005);
  // 初始化粒子系统
  const geom = new THREE.BufferGeometry();
  const material = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 10,
    alphaTest: .8,
    map: new THREE.TextureLoader().load('/images/particle.png')
  });
  let veticsFloat32Array = []
  let veticsColors = []
  for (let p = 0; p < P_COUNT; p++) {
    veticsFloat32Array.push(
      rand(20, 30) * Math.cos(p),
      rand(20, 30) * Math.sin(p),
      rand(-1500, 0)
    );
    const randomColor = new THREE.Color(Math.random() * 0xffffff);
    veticsColors.push(randomColor.r, randomColor.g, randomColor.b);
  }
  const vertices = new THREE.Float32BufferAttribute(veticsFloat32Array, 3);
  const colors = new THREE.Float32BufferAttribute(veticsColors, 3);
  geom.attributes.position = vertices;
  geom.attributes.color = colors;
  const particleSystem = new THREE.Points(geom, material);
  scene.add(particleSystem);

  // 宇航员模型
  const loader = new GLTFLoader();
  loader.load('/models/astronaut.glb', mesh => {
    astronaut = mesh.scene;
    astronaut.material = new THREE.MeshLambertMaterial();
    astronaut.scale.set(.0005, .0005, .0005);
    astronaut.position.z = -10;
    scene.add(astronaut);
  });

  // 设置光照
  let light = new THREE.PointLight(0xFFFFFF, 0.5);
  light.position.x = -50;
  light.position.y = -50;
  light.position.z = 75;
  scene.add(light);

  light = new THREE.PointLight(0xFFFFFF, 0.5);
  light.position.x = 50;
  light.position.y = 50;
  light.position.z = 75;
  scene.add(light);

  light = new THREE.PointLight(0xFFFFFF, 0.3);
  light.position.x = 25;
  light.position.y = 50;
  light.position.z = 200;
  scene.add(light);

  light = new THREE.AmbientLight(0xFFFFFF, 0.02);
  scene.add(light);

  function updateParticles() {
    particleSystem.position.x = 0.2 * Math.cos(t);
    particleSystem.position.y = 0.2 * Math.cos(t);
    particleSystem.rotation.z += 0.015;
    camera.lookAt(particleSystem.position);

    for (let i=0; i<veticsFloat32Array.length; i++) {
      if ((i+1) % 3 === 0) {
        const dist = veticsFloat32Array[i] -camera.position.z;
        if (dist >= 0) veticsFloat32Array[i] = rand(-1000, -500);
        veticsFloat32Array[i] += 2.5;
        const _vertices = new THREE.Float32BufferAttribute(veticsFloat32Array, 3);
        geom.attributes.position = _vertices;
      }
    }

    particleSystem.geometry.verticesNeedUpdate = true;
  }

  function updateMeshes() {
    if (astronaut) {
      astronaut.position.z = 0.08 * Math.sin(t) + (camera.position.z - 0.2);
      astronaut.rotation.x += 0.015;
      astronaut.rotation.y += 0.015;
      astronaut.rotation.z += 0.01;
    }
  }

  function updateRendererDim() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }
  }

  function render() {
    updateParticles();
    updateMeshes();
    updateRendererDim();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
    t += 0.01;
  }

  window.addEventListener('mousemove', e => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = -1 * ((cx - e.clientX) / cx);
    const dy = -1 * ((cy - e.clientY) / cy);
    camera.position.x = dx * 5;
    camera.position.y = dy * 5;
    astronaut.position.x = dx * 5;
    astronaut.position.y = dy * 5;
  });
  render();
}

final();
