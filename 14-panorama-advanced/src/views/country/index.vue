<template>
  <div class="family">
    <canvas class="webgl-family"></canvas>

    <!-- 返回按钮 -->
    <div class="back" @click="handleBackClick">
      <span class="button" title="返回" role="button">
        <i class="icon"></i>
        <b class="text">回到主页</b>
      </span>
    </div>

    <!-- IP吉祥物 -->
    <Mascot type="hi" v-if="data.showMascot && data.currentKeyframe === 'hi'" />
    <Mascot type="float" v-if="data.showMascot && data.currentKeyframe === 'float'" />
    <!-- <Mascot type="intro" v-if="data.currentRoom === 'road-0'" :position="{'bottom': '-100px'}" /> -->

    <!-- 底部滑动横幅 -->
    <Slider v-if="['living-room', 'living-room-out', 'kitchen', 'bed-room'].includes(data.currentRoom)" :sliders="data.sliders" />

    <!-- 弹窗卡片 -->
    <Card />

    <!-- 场景切换点 -->
    <div class="switch">
      <span
        class="button"
        v-for="(room, index) in data.filtederRooms"
        :key="index"
        @click="handleSwitchButtonClick(room.key)"
        v-show="room.key !== data.currentRoom && room.visible === true"
      >
        <b class="text">{{ room.name }}</b>
        <i class="icon"></i>
      </span>
    </div>

    <!-- 方位点 -->
    <div
      class="marker"
      v-for="(marker, index) in markers"
      :key="index"
      v-show="data.currentRoom === marker.currentRoom"
      :class="`marker-${index}`"
      @click="handleRouteButtonClick(marker)"
    ></div>
  </div>
</template>

<script setup>
/* eslint-disable */
import { computed, onMounted, reactive, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import * as THREE from 'three';
import { OrbitControls } from '@/utils/OrbitControls.js';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import Slider from '@/views/country/components/Slider.vue';
import Mascot from '@/views/country/components/Mascot.vue';
import Card from '@/views/country/components/Card.vue';
import fragment from './shader/fragment.js';
import vertex from './shader/vertex.js';
import { Bus, sleep } from '@/utils';
import Animations from '@/utils/animations';
import { countrys, markers } from '@/views/country/data';

const router = useRouter();
const data = reactive({
  sceneOrigin: null,
  sceneDestination: null,
  sceneFinal: null,
  camera: null,
  controls: null,
  progress: 0,
  // 相机z轴坐标
  cameraZAxis: 2,
  // 当前房屋key值
  currentRoom: 'road-0',
  // 当前滑动横幅
  sliders: countrys[0].sliders,
  // 用于显示固定侧边栏的房屋
  filtederRooms: countrys.filter((item) => item.showSwitch === true),
  // 当前吉祥物动画帧类型
  currentKeyframe: 'hi',
  keyframeTimeout: null,
  showMascot: false,
});

data.filtederRooms.forEach((item) => item.visible = true);


// 点击返回
const handleBackClick = () => {
  router.push({ path: "/home" });
};

// 默认初始贴图和目标贴图
const mapOrigin = markers.filter((item) => item.currentRoom === data.currentRoom)[0].origin;
const mapDestination = markers.filter((item) => item.currentRoom === data.currentRoom)[0].destination;
const raycaster = new THREE.Raycaster();

// 初始化三维场景
const initScene = () => {
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };
  const sceneDestination = new THREE.Scene();
  const sceneOrigin = new THREE.Scene();
  const sceneFinal = new THREE.Scene();

  // 初始化渲染器
  const canvas = document.querySelector("canvas.webgl-family");
  const renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  data.renderer = renderer;

  const camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.001,
    1000
  );
  camera.position.set(0, 0, data.cameraZAxis);
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  data.camera = camera;

  let frustumSize = 1;
  const cameraFinal = new THREE.OrthographicCamera(
    frustumSize / -2,
    frustumSize / 2,
    frustumSize / 2,
    frustumSize / -2,
    -1000,
    1000
  );

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.maxDistance = 6;
  // 垂直旋转限制
  controls.minPolarAngle = Math.PI / 2;
  controls.maxPolarAngle = Math.PI / 2;
  data.controls = controls;

  // 页面缩放事件监听
  window.addEventListener("resize", () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    // 更新渲染
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    // 更新相机
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
  });

  // 创建原场景
  const sphereGeometry = new THREE.SphereGeometry(16, 128, 128);
  sphereGeometry.scale(1, 1, -1);
  const originMesh = new THREE.Mesh(
    sphereGeometry,
    new THREE.MeshBasicMaterial({
      map: mapOrigin,
      side: THREE.DoubleSide,
    })
  );
  originMesh.rotation.y = Math.PI / 2;
  sceneOrigin.add(originMesh);
  data.sceneOrigin = sceneOrigin;

  // 创建目标场景
  const destinationMesh = new THREE.Mesh(
    sphereGeometry,
    new THREE.MeshBasicMaterial({
      map: mapDestination,
      side: THREE.DoubleSide,
    })
  );
  destinationMesh.rotation.y = Math.PI / 2;
  sceneDestination.add(destinationMesh);
  data.sceneDestination = sceneDestination;

  // 创建渲染场景
  const textureDestination = new THREE.WebGLRenderTarget(
    sizes.width,
    sizes.height,
    {
      format: THREE.RGBAFormat,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
    }
  );

  const textureOrigin = new THREE.WebGLRenderTarget(
    sizes.width,
    sizes.height,
    {
      format: THREE.RGBAFormat,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
    }
  );

  const finalMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.ShaderMaterial({
      extensions: {
        derivatives: "#extension GL_OES_standard_derivatives : enable",
      },
      side: THREE.DoubleSide,
      uniforms: {
        progress: { value: 0 },
        sceneOrigin: { value: null },
        sceneDestination: { value: null },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
    })
  );
  sceneFinal.add(finalMesh);

  // 路径标记物
  const _markers = markers.map((item, index) => {
    return {
      ...item,
      element: document.querySelector(`.marker-${index}`),
    };
  });

  // 页面重绘动画效果
  const tick = () => {
    // 地面标记物显隐
    if (_markers) {
      for (const marker of _markers) {
        const screenPosition = marker.position.clone();
        const pos = screenPosition.project(camera);
        raycaster.setFromCamera(screenPosition, camera);
        const intersects = raycaster.intersectObjects(
          sceneFinal.children,
          true
        );
        if (intersects.length === 0) {
          marker.element.classList.add("visible");
        } else {
          const intersectionDistance = intersects[0].distance;
          const markerDistance = marker.position.distanceTo(camera.position);
          intersectionDistance < markerDistance
            ? marker.element.classList.remove("visible")
            : marker.element.classList.add("visible");
        }
        pos.z > 1
          ? marker.element.classList.remove("visible")
          : marker.element.classList.add("visible");
        const translateX = screenPosition.x * sizes.width * 0.5;
        const translateY = -screenPosition.y * sizes.height * 0.5;
        marker.element.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`;
      }
    }

    controls && controls.update();

    TWEEN && TWEEN.update();

    renderer.setRenderTarget(textureDestination);
    renderer.render(sceneDestination, camera);

    renderer.setRenderTarget(textureOrigin);
    renderer.render(sceneOrigin, camera);
    finalMesh.material.uniforms.sceneDestination.value = textureDestination.texture;
    finalMesh.material.uniforms.sceneOrigin.value = textureOrigin.texture;
    finalMesh.material.uniforms.progress.value = data.progress;
    renderer.setRenderTarget(null);
    renderer.render(sceneFinal, cameraFinal);
    requestAnimationFrame(tick);
  };
  tick();
};

// 点击切换点
const handleSwitchButtonClick = async (key) => {
  const originRoom = markers.filter((item) => item.currentRoom === data.currentRoom)[0];
  const destinationRoom = markers.filter((item) => item.currentRoom === key)[0];
  data.sceneOrigin.children[0].material.map = originRoom.origin;
  data.sceneDestination.children[0].material.map = destinationRoom.origin;
  data.progress = 0;
  const inter = setInterval(() => {
    if (data.progress < 1) {
      data.progress += 0.01;
    } else {
      clearInterval(inter);
    }
  }, 10);
  await sleep(500);
  data.currentRoom = destinationRoom.currentRoom;
  data.sliders = countrys.filter((item) => item.key === data.currentRoom)[0].sliders || [];
  data.showMascot = data.filtederRooms.some((item) => item.key === data.currentRoom);
};

// 点击地面方位点
const handleRouteButtonClick = async (marker) => {
  data.sceneOrigin.children[0].material.map = marker.origin;
  data.sceneDestination.children[0].material.map = marker.destination;
  data.progress = 0;
  // Animations.animateCamera(data.camera, data.controls, { x: 0, y: -4, z: data.cameraZAxis }, { x: 0, y: 0, z: 0 }, 1600, () => {});
  const inter = setInterval(() => {
    if (data.progress < 1) {
      data.progress += 0.01;
    } else {
      clearInterval(inter);
    }
  }, 10);
  await sleep(500);
  data.currentRoom = marker.destinationRoom;
  data.sliders = countrys.filter((item) => item.key === data.currentRoom)[0].sliders || [];
  data.showMascot = data.filtederRooms.some((item) => item.key === data.currentRoom);
};

onMounted(() => {
  initScene();
  data.keyframeTimeout = setTimeout(() => {
    data.currentKeyframe = "float";
  }, 2400);
  Bus.on("toggleMascot", (bool) => {
    data.showMascot = bool;
  });
});

onBeforeUnmount(() => {
  data.keyframeTimeout && clearTimeout(data.keyframeTimeout);
  Bus.off("toggleMascot");
});
</script>

<style lang="stylus" scoped>
@import url('@/assets/styles/keyframes.styl');
.family
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
      cursor pointer
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
      background rgba(27, 25, 24, .6)
      border-radius 4px
      display flex
      align-items center
      padding 12px 8px 12px 24px
      -webkit-backdrop-filter blur(4px)
      -moz-backdrop-filter blur(4px)
      backdrop-filter blur(4px)
      cursor pointer
      transition all .25s ease-out
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
      &:hover
        background rgba(27, 25, 24, .8)
        filter brightness(1.2)
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

  .room-label
    position: fixed;
    top: 50%;
    left: 50%;
    z-index 10
    &-box
      background rgba(0, 0, 0, .4)
      color rgba(255, 255, 255, 1)
      font-size 32px
      font-weight 600
      padding 16px 32px
      border-radius 4px
      display flex
      align-items center
      justify-content space-around
      transform: scale(0, 0);
      -webkit-backdrop-filter blur(4px);
      backdrop-filter blur(4px);
      cursor pointer
      transition all .5s ease-out
      position relative
      &::after
        display inline-block
        content ''
        height 40px
        width 40px
        background url('@/assets/images/family/icon_arrow.png') no-repeat center
        background-size 100% 100%
        position absolute
        left -48px
        transform rotate(360deg)
        animation arrowLeft 2.8s ease-in-out infinite

    &.visible
      .room-label-box
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

.marker
  position: fixed;
  top: 50%;
  left: 50%;
  z-index 12
  height 120px
  width 120px
  &::after
    display inline-block
    content ''
    height 100%
    width 100%
    -webkit-clip-path ellipse(45% 15% at 50% 50%)
    clip-path ellipse(50% 15% at 50% 50%)
    transform: scale(0, 0);
    background rgba(255, 255, 255, .3)
    backdrop-filter blur(4px)
    border-radius 50%
    cursor pointer
    transition all .25s ease-in-out
  &::before
    content ''
    height 100%
    width 100%
    -webkit-clip-path ellipse(45% 15% at 50% 50%)
    clip-path ellipse(50% 15% at 50% 50%)
    background rgba(0, 100, 200, .4)
    border-radius 50%
    cursor pointer
    position absolute
    display none
    animation markerBounce 2s ease-in-out infinite
  &:hover
    &::after
      background rgba(0, 100, 200, .2)
  &.visible
    &::after
      transform: scale(1, 1);
    &::before
      display inline-block

@keyframes markerBounce {
  0% {
    transform: scale(0.5);
    opacity: .8;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}


@keyframes arrowLeft {
  0% {
    transform: translateX(-2px);
    opacity: 0.8;
  }
  50% {
    transform: translateX(-10px);
    opacity: 0.8;
  }
  100% {
    transform: translateX(-2px);
    opacity: 0.8;
  }
}
</style>
