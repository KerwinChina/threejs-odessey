<template>
  <div class="home">
    <canvas class="webgl-home"></canvas>
    <div class="render">
      <div
        class="cloudimage-360"
        id="renderer"
        data-folder="./frames/"
        data-filename-x="{index}.jpg"
        data-amount-x="200"
        data-ratio="2"
        data-keys="true"
        data-spin-reverse="false"
        data-speed="120"
        data-autoplay
        data-play-once
        data-drag-speed="150"
      ></div>
    </div>

    <div class="logo"></div>
    <div class="button-zone">
      <div class="buttons">
        <div class="button" role="button" v-for="(menu, index) in menus" :key="index" @click="handleMenuClick(menu)">
          <p class="name">{{ menu.name }}</p>
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
import 'js-cloudimage-360-view';
import { toast } from '@/utils';

const homeMap = new URL('@/assets/images/map/map_home.png', import.meta.url).href;

const router = useRouter();

const menus = [
  {
    key: 'family',
    name: '',
  },
  {
    key: 'country',
    name: '',
  },
  {
    key: 'community',
    name: '',
  },
  {
    key: 'video',
    name: '',
  },
];

// 点击菜单
const handleMenuClick = (menu) => {
  if (menu.key === 'family') {
    router.push({ path: `/${menu.key}` });
  } else if (menu.key === 'country') {
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
  // initScene();
  window.CI360.init();
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
    display none
  .logo
    position fixed
    top 0
    left 50%
    height 87px
    width 654px
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
    width 100vw
    -webkit-animation slideInUp 1s .25s
    animation slideInUp 1s .25s
    -webkit-animation-fill-mode both
    animation-fill-mode both
    .buttons
      width 90%
      margin 0 auto
      display flex
      justify-content space-around
      align-items flex-end
      .button
        height 185px
        width 23.5%
        background-image radial-gradient(circle at 14% 90%, rgba(214,99,255,0.50) 0%, rgba(255,255,255,0.00) 76%), linear-gradient(180deg, rgba(0,69,234,0.90) 1%, rgba(0,96,234,0.90) 12%, rgba(98,199,255,0.90) 87%)
        border-radius 16px 16px 0 0
        text-align center
        cursor pointer
        transition all .25s ease-out
        border-right 3px solid rgba(255, 255, 255, .2)
        border-top 3px solid rgba(255, 255, 255, .5)
        overflow hidden
        &:hover
          height 220px
        .name
          font-size 36px
          color rgba(255, 255, 255, 1)
          margin 46px 0 20px
          font-weight 500
        .icon
          display inline-block
          height 56px
          width 56px
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

.render
  height 100.8%
  width 100%
  .cloudimage-360
    height 100%
    object-fit cover
</style>

<style lang="stylus">
canvas
  object-fit cover !important
  height 100vh !important
  width 100vw !important
  filter contrast(1.2)
</style>
