<template>
  <div class="home">
    <canvas class="webgl"></canvas>
    <div class="back" @click="handleBackClick">
      <span class="button" title="返回" role="button">
        <i class="icon"></i>
        <b class="text">回到主页</b>
      </span>
    </div>
    <Mascot type="hi" v-if="data.currentKeyframe === 'hi'" />
    <Mascot type="float" v-if="data.currentKeyframe === 'float'" />
    <Slider :sliders="data.sliders" />
    <Card />
    <!-- 场景切换点 -->
    <div class="switch">
      <span class="button" v-for="(room, index) in rooms" :key="index" @click="handleSwitchButtonClick(room.key)" v-show="room.key !== data.currentRoom">
        <b class="text">{{ room.name }}</b>
        <i class="icon"></i>
      </span>
    </div>
    <!-- 交互点 -->
    <div class="point" v-for="(point, index) in pointInfos" :key="index" :class="[`point-${index}`, `point-${point.key}`]" @click="handleReactivePointClick(point)">
      <div class="label" :class="[`label-${index}`, `label-${point.key}`]">
        <label class="label-tips">
          <div class="cover">
            <i class="icon" :style="{
              'background': `url(${point.cover}) no-repeat center`,
              'background-size': 'contain',
            }"></i>
          </div>
          <div class="info">
            <p class="p1">{{ point.name }}</p>
            <p class="p2">{{ point.description }}</p>
          </div>
        </label>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  computed,
  onMounted,
  reactive,
  onBeforeUnmount,
} from 'vue';
import { useRouter } from 'vue-router';
import * as THREE from 'three';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import { OrbitControls } from '@/utils/OrbitControls.js';
import Slider from '@/views/family/components/Slider.vue';
import Mascot from '@/views/family/components/Mascot.vue';
import Card from '@/views/family/components/Card.vue';
import Animations from '@/utils/animations';
import { Bus, sleep } from '@/utils';
import rooms from '@/views/family/roomConfig';

const router = useRouter();

const data = reactive({
  renderer: null,
  camera: null,
  scene: null,
  controls: null,
  cameraZAxis: 6,
  currentRoom: 'living-room',
  sliders: rooms[0].sliders,
  currentKeyframe: 'hi',
  keyframeTimeout: null,
});

// 获取交互点的信息
const pointInfos = computed(() => {
  const targets = [
    {
      key: 'tyyh',
      value: 'xxxx',
      description: 'xxxx',
    },
    {
      key: 'tyzp',
      value: 'xxx',
      description: 'xxxx',
    },
    {
      key: 'tykj',
      value: 'xxx',
      description: 'xxx',
    },
    {
      key: 'fire',
      value: 'xxxx',
      description: 'xxxx',
    },
    {
      key: 'water',
      value: 'xxxx',
      description: 'xxxx',
    },
  ];
  const result = [];
  rooms.forEach((room) => {
    if (room.sliders) {
      room.sliders.forEach((item) => {
        const target = targets.filter((_item) => _item.value === item.name)[0];
        if (target) {
          if (item.name === 'xxxx') {
            result.push({
              ...target,
              ...item,
              name: 'xxx',
            });
          } else if (item.name === 'xxxx') {
            result.push({
              ...target,
              ...item,
              name: 'xxxx',
            });
          } else {
            result.push({
              ...target,
              ...item,
            });
          }
        }
      });
    }
  });
  return result;
});

// 点击返回
const handleBackClick = () => {
  router.push({ path: '/home' });
};

const initScene = () => {
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };
  // 初始化渲染器
  const canvas = document.querySelector('canvas.webgl');
  const renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  data.renderer = renderer;
  // 初始化场景
  const scene = new THREE.Scene();
  data.scene = scene;

  // 初始化相机
  const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    1000,
  );
  camera.position.z = data.cameraZAxis;
  scene.add(camera);
  data.camera = camera;

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0, 0);
  controls.enableDamping = true;
  controls.enablePan = false;
  // 缩放限制
  controls.maxDistance = 12;
  // 垂直旋转限制
  controls.minPolarAngle = Math.PI / 2;
  controls.maxPolarAngle = Math.PI / 2;
  // 限制水平移动
  controls.maxAzimuthAngle = Math.PI - 1.8;
  controls.minAzimuthAngle = -Math.PI + 1.8;
  data.controls = controls;

  // 环境光
  const light = new THREE.AmbientLight(0xffffff, 2);
  scene.add(light);

  // 页面缩放事件监听
  window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    // 更新渲染
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    // 更新相机
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
  });

  const textLoader = new THREE.TextureLoader();

  // 创建空间
  const createRoom = (name, position, map) => {
    const geometry = new THREE.SphereGeometry(16, 64, 64);
    geometry.scale(1, 1, -1);
    const material = new THREE.MeshBasicMaterial({
      map: textLoader.load(map),
      side: THREE.DoubleSide,
    });
    const room = new THREE.Mesh(geometry, material);
    room.name = name;
    room.position.set(position.x, position.y, position.z);
    room.rotation.y = Math.PI / 2;
    scene.add(room);
    return room;
  };

  // 创建网格对象
  rooms.map((item) => {
    const room = createRoom(item.key, item.position, item.map);
    return room;
  });

  // 添加交互点
  const raycaster = new THREE.Raycaster();
  const points = [
    {
      position: new THREE.Vector3(5.5, -2, -14),
      element: document.querySelector('.point-0'),
    },
    {
      position: new THREE.Vector3(-1, -2.7, -15),
      element: document.querySelector('.point-1'),
    },
    {
      position: new THREE.Vector3(-2.8, 4, -15),
      element: document.querySelector('.point-2'),
    },
    {
      position: new THREE.Vector3(29.4, 7.8, -13),
      element: document.querySelector('.point-3'),
    },
    {
      position: new THREE.Vector3(24, 0, -10),
      element: document.querySelector('.point-4'),
    },
  ];

  // 动画
  const tick = () => {
    if (renderer) {
      for (const point of points) {
        // 获取2D屏幕位置
        const screenPosition = point.position.clone();
        screenPosition.project(camera);
        raycaster.setFromCamera(screenPosition, camera);
        const intersects = raycaster.intersectObjects(scene.children, true);
        if (intersects.length === 0) {
          // 未找到相交点，显示
          point.element.classList.add('visible');
        } else {
          // 找到相交点
          // 获取相交点的距离和点的距离
          const intersectionDistance = intersects[0].distance;
          const pointDistance = point.position.distanceTo(camera.position);
          // 相交点距离比点距离近，隐藏；相交点距离比点距离远，显示
          intersectionDistance < pointDistance
            ? point.element.classList.remove('visible')
            : point.element.classList.add('visible');
        }
        const translateX = screenPosition.x * sizes.width * 0.5;
        const translateY = -screenPosition.y * sizes.height * 0.5;
        point.element.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`;
      }
    }

    controls && controls.update();
    TWEEN && TWEEN.update();
    // 更新渲染器
    renderer.render(scene, camera);
    // 页面重绘时调用自身
    window.requestAnimationFrame(tick);
  };
  tick();
};

// 点击切换场景
const handleSwitchButtonClick = async (key) => {
  const room = rooms.filter((item) => item.key === key)[0];
  if (data.camera) {
    const x = room.position.x;
    const y = room.position.y;
    const z = room.position.z;
    Animations.animateCamera(data.camera, data.controls, { x, y, z: data.cameraZAxis }, { x, y, z }, 2400, () => {});
    data.controls.update();
  }
  await sleep(1600);
  data.currentRoom = room.key;
  data.sliders = room.sliders;
};

// 点击交互点
const handleReactivePointClick = (point) => {
  Bus.emit('toggleMascot', false);
  Bus.emit('show-card', point);
};

onMounted(() => {
  initScene();
  data.keyframeTimeout = setTimeout(() => {
    data.currentKeyframe = 'float';
  }, 2400);
});

onBeforeUnmount(() => {
  data.keyframeTimeout && clearTimeout(data.keyframeTimeout);
});
</script>

<style lang="stylus" scoped>
@import url('@/assets/styles/keyframes.styl');
.home
  .webgl
    position fixed
    top 0
    left 0
    outline none
  .back
    position fixed
    top 0
    left 0
    z-index 11
    -webkit-animation slideInLeft 1s .15s
    animation slideInLeft 1s .15s
    -webkit-animation-fill-mode both
    animation-fill-mode both
    .button
      display inline-block
      height 78px
      width 335px
      background url('@/assets/images/family/back_button_bg.png') no-repeat center
      background-size 100% 100%
      display flex
      align-items center
      padding-left 38px
      overflow hidden
      .icon
        display inline-block
        height 56px
        width 56px
        background url('@/assets/images/family/back_button_icon.png') no-repeat center
        background-size 100% 100%
      .text
        font-size 30px
        color #ffffff
        font-weight 600
        display inline-block
        padding-left 24px
  .switch
    position fixed
    right 24px
    top 22%
    z-index 11
    -webkit-animation slideInRight 1s .3s
    animation slideInRight 1s .3s
    -webkit-animation-fill-mode both
    animation-fill-mode both
    .button
      display block
      background rgba(27, 25, 24, 0.60)
      border-radius 4px
      display flex
      align-items center
      padding 12px 8px 12px 24px
      -webkit-backdrop-filter blur(4px)
      -moz-backdrop-filter blur(4px)
      backdrop-filter blur(4px)
      .text
        color rgba(255, 255, 255, 1)
        font-size 32px
        font-weight 800
      &:not(last-child)
        margin-bottom 48px
      .icon
        display inline-block
        height 30px
        width 30px
        background url('@/assets/images/family/icon_arrow.png') no-repeat center
        background-size 100% 100%
        transform rotate(180deg)
        margin-left 8px
  .point
    position: fixed;
    top: 50%;
    left: 50%;
    z-index 10
    .label
      position: absolute;
      top: -16px;
      left: -16px;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: rgba(255, 255, 255, .8);
      color: #ffffff;
      font-family: Helvetica, Arial, sans-serif;
      text-align: center;
      line-height: 32px;
      font-weight: 100;
      font-size: 14px;
      cursor: help;
      transform: scale(0, 0);
      transition: transform 0.3s;
      &::before, &::after
        display inline-block
        content ''
        background rgba(255, 255, 255, 1);
        height 100%
        width 100%
        border-radius 50%
        position absolute
        left 50%
        top 50%
        margin-left -14px
        margin-top -14px
      &::before
        animation: bounce-wave 1.5s infinite
      &::after
        animation: bounce-wave 1.5s -0.4s infinite
      .label-tips
        height 88px
        width 200px
        overflow hidden
        position absolute
        top -32px
        right -220px
        font-size 32px
        background rgba(255, 255, 255, .6)
        border-radius 10px
        border 1px solid rgba(255, 255, 255, .5)
        -webkit-backdrop-filter blur(4px)
        -moz-backdrop-filter blur(4px)
        backdrop-filter blur(4px)
        text-shadow 1px 1px 1px rgba(0, 0, 0, .15)
        display flex
        justify-content space-between
        align-content center
        .cover
          width 80px
          height 100%
          .icon
            display inline-block
            height 100%
            width 100%
            filter drop-shadow(1px 1px 4px rgba(0, 0, 0, .1))
        .info
          width calc(100% - 80px)
          height 100%
          overflow hidden
          p
            overflow hidden
            text-overflow ellipsis
            text-align left
            &.p1
              font-size 24px
              color #1D1F24
              font-weight 800
              margin 12px 0 2px
            &.p2
              font-size 18px
              color #0096FD
              font-weight 500
      &.label-tyyh
        .label-tips
          left -220px
          flex-direction row-reverse
          .info
            p
              text-align right
    .text
      position: absolute;
      top: 30px;
      left: -120px;
      width: 200px;
      padding: 20px;
      border-radius: 4px;
      background: rgba(0, 0, 0, .6);
      border: 1px solid #ffffff;
      color: #ffffff;
      line-height: 1.3em;
      font-weight: 100;
      font-size: 14px;
      opacity: 0;
      transition: opacity 0.3s;
      pointer-events: none;
      text-align justify
      text-align-last left
    &:hover .text
      opacity: 1;
    &.visible .label
      transform: scale(1, 1);

.animate-point-wave::before {
  content: '';
  animation: bounce-wave 1.5s infinite;
}
.animate-point-wave::after {
  content: '';
  animation: bounce-wave 1.5s -0.4s infinite;
}

@keyframes bounce-wave {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2.2);
    opacity: 0;
  }
}
</style>
