<template>
  <div class="home">
    <canvas class="webgl"></canvas>
    <div class="vr">
      <span class="box">
        <i class="icon"></i>
        <b class="text">全景漫游</b>
      </span>
    </div>
    <!-- 场景切换点 -->
    <div class="switch">
      <span class="button" v-for="(room, index) in rooms" :key="index" @click="handleSwitchButtonClick(room.key)" v-show="room.key !== data.currentRoom">
        <b class="text">{{ room.name }}</b>
        <i class="icon"></i>
      </span>
    </div>
    <!-- 交互点 -->
    <div
      class="point"
      v-for="(point, index) in interactivePoints"
      :key="index"
      :class="[`point-${index}`, `point-${point.key}`]"
      @click="handleReactivePointClick(point)"
      v-show="point.room === data.currentRoom"
    >
      <div class="label" :class="[`label-${index}`, `label-${point.key}`]">
        <label class="label-tips">
          <div class="cover">
            <i
              class="icon"
              :style="{
                background: `url(${point.cover}) no-repeat center`,
                'background-size': 'contain',
              }"
            ></i>
          </div>
          <div class="info">
            <p class="p1">{{ point.value }}</p>
            <p class="p2">{{ point.description }}</p>
          </div>
        </label>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  onMounted,
  reactive,
  onBeforeUnmount,
  computed,
} from 'vue';
import { useRouter } from 'vue-router';
import * as THREE from 'three';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Animations from '@/utils/animations';
import { Bus, sleep } from '@/utils';
import { rooms } from '@/views/home/data';

const router = useRouter();

const data = reactive({
  renderer: null,
  camera: null,
  scene: null,
  controls: null,
  cameraZAxis: 6,
  currentRoom: 'living-room',
  keyframeTimeout: null,
});

// 获取交互点的信息
const interactivePoints = computed(() => {
  const res = [];
  rooms.forEach((room) => {
    if (room.interactivePoints && room.interactivePoints.length > 0) {
      room.interactivePoints.forEach((point) => {
        point = {
          room: room.key,
          ...point,
        };
        res.push(point);
      });
    }
  });
  return res;
});

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
  controls.rotateSpeed = -0.25;
  // 缩放限制
  controls.maxDistance = 12;
  // 垂直旋转限制
  controls.minPolarAngle = Math.PI / 2;
  controls.maxPolarAngle = Math.PI / 2;
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
    const geometry = new THREE.SphereGeometry(16, 256, 256);
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
  // 室内悬浮标记物
  const _points = interactivePoints.value.map((item, index) => ({
    ...item,
    element: document.querySelector(`.point-${index}`),
  }));

  // 动画
  const tick = () => {
    if (renderer) {
      for (const point of _points) {
        // 获取2D屏幕位置
        const screenPosition = point.position.clone();
        const pos = screenPosition.project(camera);
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
        pos.z > 1
          ? point.element.classList.remove('visible')
          : point.element.classList.add('visible');
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
  Bus.emit('show-card', point);
};

onMounted(() => {
  initScene();
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
  .vr
    position fixed
    top 0
    left 0
    z-index 11
    -webkit-animation slideInLeft 1s .15s
    animation slideInLeft 1s .15s
    -webkit-animation-fill-mode both
    animation-fill-mode both
    .box
      display inline-block
      background rgba(0, 0, 0, .3)
      -webkit-backdrop-filter rgba(0, 200, 50, .6)
      backdrop-filter blur(8px)
      display flex
      align-items center
      justify-content space-around
      overflow hidden
      padding 4px 20px
      border-radius 0 0 16px 0
      border 1px groove rgba(255, 255, 255, .3)
      border-top none
      border-left none
      box-shadow 0 1px 4px rgba(0, 0, 0, .1)
      .icon
        display inline-block
        height 64px
        width 64px
        background url('@/assets/images/home/vr.png') no-repeat center
        background-size contain
        margin-right 12px
      .text
        font-size 24px
        color #ffffff
        display inline-block
        font-weight 500
  .switch
    position fixed
    right 24px
    top 40%
    z-index 11
    -webkit-animation slideInRight 1s .3s
    animation slideInRight 1s .3s
    -webkit-animation-fill-mode both
    animation-fill-mode both
    .button
      display block
      background rgba(27, 25, 24, .5)
      border-radius 4px
      display flex
      align-items center
      padding 12px 8px 12px 24px
      -webkit-backdrop-filter blur(4px)
      -moz-backdrop-filter blur(4px)
      backdrop-filter blur(4px)
      cursor pointer
      transition all .25s ease-in-out
      .text
        color rgba(255, 255, 255, 1)
        font-size 24px
        font-weight 800
      &:not(last-child)
        margin-bottom 48px
      .icon
        display inline-block
        height 30px
        width 30px
        background url('@/assets/images/home/icon_arrow.png') no-repeat center
        background-size 100% 100%
        transform rotate(180deg)
        margin-left 8px
      &:hover
        background rgba(27, 25, 24, .2)
        box-shadow 1px 1px 2px rgba(0, 0, 0, .2)
  .point
    position: fixed;
    top: 50%;
    left: 50%;
    z-index 10
    .label
      position: absolute;
      top: -16px;
      left: -16px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 1);
      font-home: Helvetica, Arial, sans-serif;
      text-align: center;
      line-height: 32px;
      font-weight: 100;
      font-size: 14px;
      cursor: help;
      transform: scale(0, 0);
      transition: transform 0.3s;
      backdrop-filter blur(4px)
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
        margin-left -10px
        margin-top -10px
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
        border 1px groove rgba(255, 255, 255, .5)
        -webkit-backdrop-filter blur(4px)
        -moz-backdrop-filter blur(4px)
        backdrop-filter blur(4px)
        border-radius 10px
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
          padding-left 12px
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
              color #03c03c
              font-weight 500
      &.label-sofa
        .label-tips
          left -220px
          flex-direction row-reverse
          .info
            padding 0 12px 0 0
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
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(3.6);
    opacity: 0;
  }
}
</style>
