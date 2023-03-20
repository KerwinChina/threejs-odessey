<template>
  <div class="home">
    <canvas class="webgl-home"></canvas>
    <div class="logo"></div>
    <div class="button-zone">
      <div class="buttons">
        <div class="button" role="button" v-for="(menu, index) in menus" :key="index" @click="handleMenuClick(menu)">
          <p class="p1">{{ menu.name.slice(0, 2) }}</p>
          <p class="p2">{{ menu.name.slice(2) }}</p>
          <i class="icon" :class="menu.key"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import * as THREE from 'three';
import { OrbitControls } from '@/utils/OrbitControls.js';
import { toast } from '@/utils';

const homeMap = new URL('@/assets/images/map/map_home.png', import.meta.url).href;

const router = useRouter();

const menus = [
  {
    key: 'family',
    name: 'xxxx',
  },
  {
    key: 'country',
    name: 'xxxx',
  },
  {
    key: 'community',
    name: 'xxxx',
  },
  {
    key: 'video',
    name: 'xxxx',
  },
];

// 点击菜单
const handleMenuClick = (menu) => {
  if (menu.key === 'family') {
    router.push({ path: `/${menu.key}` });
  } else {
    toast('敬请期待');
  }
};

const initScene = () => {
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };
  // 初始化渲染器
  const canvas = document.querySelector('canvas.webgl-home');
  const renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  // 初始化场景
  const scene = new THREE.Scene();

  // 初始化相机
  const camera = new THREE.PerspectiveCamera(
    45,
    sizes.width / sizes.height,
    0.1,
    1000,
  );
  camera.position.z = 16;
  scene.add(camera);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0, 0);
  controls.enableDamping = true;
  controls.enablePan = false;
  // // 缩放限制
  controls.maxDistance = 16;
  // // 垂直旋转限制
  controls.minPolarAngle = Math.PI / 2;
  controls.maxPolarAngle = Math.PI / 2;
  // // 限制水平移动
  // controls.maxAzimuthAngle = Math.PI - 1.8;
  // controls.minAzimuthAngle = -Math.PI + 1.8;

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

  // 创建网格对象
  const geometry = new THREE.SphereGeometry(16, 64, 64);
  geometry.scale(1, 1, -1);
  const material = new THREE.MeshBasicMaterial({
    map: textLoader.load(homeMap),
    side: THREE.DoubleSide,
  });
  const room = new THREE.Mesh(geometry, material);
  room.position.set(0, 0, 0);
  room.rotation.y = -Math.PI / 4;
  scene.add(room);

  // 动画
  const tick = () => {
    room && (room.rotation.y += 0.0024);
    controls && controls.update();
    // 更新渲染器
    renderer.render(scene, camera);
    // 页面重绘时调用自身
    window.requestAnimationFrame(tick);
  };
  tick();
};

onMounted(() => {
  initScene();
});
</script>

<style lang="stylus" scoped>
@import url('@/assets/styles/keyframes.styl');

.home
  height 100vh
  width 100vw
  overflow hidden
  .webgl-home
    position fixed
    top 0
    left 0
    outline none
  .logo
    position fixed
    top 0
    left 50%
    height 70.4px
    width 522.4px
    background url('@/assets/images/home/logo.png') no-repeat center
    background-size contain
    margin-left -261.2px
    -webkit-animation slideInDown 1s .15s
    animation slideInDown 1s .15s
    -webkit-animation-fill-mode both
    animation-fill-mode both
  .button-zone
    position fixed
    bottom 0
    left 0
    -webkit-animation slideInUp 1s .25s
    animation slideInUp 1s .25s
    -webkit-animation-fill-mode both
    animation-fill-mode both
    .buttons
      width 100vw
      padding 24px
      display flex
      justify-content space-around
      .button
        height 314px
        width 23.5%
        background: linear-gradient(180deg, rgba(0, 69, 234, 0.90) 1%, rgba(0, 96, 234, 0.90) 12%, rgba(98, 199, 255, 0.90) 87%);
        border-radius: 16px;
        text-align center
        overflow hidden
        .p1, .p2
          font-size 42px
          color #ffffff
          text-align center
          &.p1
            margin 40px 0 0
          &.p2
            margin-bottom 40px
        .icon
          display inline-block
          height 64px
          width 64px
          &.family
            background url('@/assets/images/home/icon_family.png') no-repeat center
            background-size 100% 100%
          &.country
            background url('@/assets/images/home/icon_country.png') no-repeat center
            background-size 100% 100%
          &.community
            background url('@/assets/images/home/icon_community.png') no-repeat center
            background-size 100% 100%
          &.video
            background url('@/assets/images/home/icon_video.png') no-repeat center
            background-size 100% 100%
</style>
