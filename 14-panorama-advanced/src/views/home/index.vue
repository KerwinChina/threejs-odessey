<template>
  <div class="family">
    <canvas class="webgl-family"></canvas>

    <!-- 返回按钮 -->
    <div class="back" @click="handleBackClick">
      <span class="button" title="返回" role="button">
        <b class="text">全景漫游</b>
      </span>
    </div>

    <!-- 页面logo -->
    <div class="logo">
      <i class="icon"></i>
    </div>

    <!-- 小地图 -->
    <TinyMap class="tiny-map" :rotate="data.tinyMapRotate" :position="data.tinyMapPosition" />

    <div class="mascot-and-slider" :class="{'is-relative': ['living-room', 'living-room-out', 'kitchen', 'bed-room'].includes(data.currentRoom), 'more-slider': data.sliders && data.sliders.length > 5}">
      <!-- 底部滑动横幅 -->
      <Slider v-if="['living-room', 'living-room-out', 'kitchen', 'bed-room'].includes(data.currentRoom)" :sliders="data.sliders" ref="sliderRef" />
    </div>

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
            <p class="p1">{{ point.name }}</p>
            <p class="p2">{{ point.description }}</p>
          </div>
        </label>
      </div>
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

    <!-- 房间名标签 -->
    <div class="room-label" v-for="(label, index) in roomLabels" :key="index" :class="`room-label-${index}`"   @click="handleSwitchButtonClick(label.key)">
      <div class="room-label-box">
        {{ label.name }}
      </div>
    </div>
  </div>
</template>

<script setup>
/* eslint-disable */
import { computed, onMounted, reactive, onBeforeUnmount, ref } from 'vue';
import { useRouter } from 'vue-router';
import * as THREE from 'three';
import { OrbitControls } from '@/utils/OrbitControls.js';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import gsap from 'gsap';
import Slider from '@/views/home/components/Slider.vue';
import TinyMap from '@/components/TinyMap.vue';
import fragment from '@/shaders/cross/fragment.js';
import vertex from '@/shaders/cross/vertex.js';
import { Bus, sleep } from '@/utils';
import Animations from '@/utils/animations';
import { rooms, markers, roomLabels } from '@/views/home/data';
import useShowCard from '@/hooks/use-show-card.js';

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
  currentRoom: 'hall-0',
  // 当前滑动横幅
  sliders: rooms[0].sliders,
  // 用于显示固定侧边栏的房屋
  filtederRooms: rooms.filter((item) => item.showSwitch === true),
  // 当前吉祥物动画帧类型
  currentKeyframe: 'hi',
  keyframeTimeout: null,
  showMascot: false,
  rotate: 0,
  tinyMapPosition: {
    left: 0,
    top: 0
  }
});
const {showCard} = useShowCard()
const sliderRef = ref(null)
data.filtederRooms.forEach((item) => item.visible = true);

// 获取交互点的信息
const interactivePoints = computed(() => {
  const res = [];
  rooms.forEach((room) => {
    if (room.interactivePoints && room.interactivePoints.length > 0) {
      room.interactivePoints.forEach((point) => {
        if (room.sliders) {
          const slider = room.sliders.filter((slider) => slider.name === point.value)[0];
          point = {
            ...point,
            ...slider
          }
          res.push(point);
        }
      })
    }
  });
  return res;
});

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
  camera.position.set(0, 8, 16);
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

  // 房屋名称标记物
  const _roomLabels = roomLabels.map((item, index) => {
    return {
      ...item,
      element: document.querySelector(`.room-label-${index}`),
    };
  });

  // 室内悬浮标记物
  const _points = interactivePoints.value.map((item, index) => {
    return {
      ...item,
      element: document.querySelector(`.point-${index}`),
    }
  })

  // 页面重绘动画效果
  const tick = () => {
    // 产品介绍标记物显隐
    if (_points) {
      for (const point of _points) {
        // 获取2D屏幕位置
        const screenPosition = point.position.clone();
        const pos = screenPosition.project(camera);
        raycaster.setFromCamera(screenPosition, camera);
        const intersects = raycaster.intersectObjects(
          sceneFinal.children,
          true
        );
        if (intersects.length === 0) {
          // 未找到相交点，显示
          point.element.classList.add("visible");
        } else {
          // 获取相交点的距离和点的距离
          const intersectionDistance = intersects[0].distance;
          const pointDistance = point.position.distanceTo(camera.position);
          // 相交点距离比点距离近，隐藏；相交点距离比点距离远，显示
          intersectionDistance < pointDistance
            ? point.element.classList.remove("visible")
            : point.element.classList.add("visible");
        }
        pos.z > 1
          ? point.element.classList.remove("visible")
          : point.element.classList.add("visible");
        const translateX = screenPosition.x * sizes.width * 0.5;
        const translateY = -screenPosition.y * sizes.height * 0.5;
        point.element.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`;
      }
    }
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
    // 房屋名称标记物显隐
    if (_roomLabels) {
      for (const label of _roomLabels) {
        const currentRoomInfo = label.visibleRooms.filter((item) => item.key === data.currentRoom)[0];
        if (currentRoomInfo) {
          const screenPosition = currentRoomInfo.position.clone();
          const pos = screenPosition.project(camera);
          raycaster.setFromCamera(screenPosition, camera);
          const intersects = raycaster.intersectObjects(
            sceneFinal.children,
            true
          );
          if (intersects.length === 0) {
            label.element.classList.add("visible");
          } else {
            const intersectionDistance = intersects[0].distance;
            const markerDistance = currentRoomInfo.position.distanceTo(camera.position);
            intersectionDistance < markerDistance
              ? label.element.classList.remove("visible")
              : label.element.classList.add("visible");
          }
          pos.z > 1 ? label.element.classList.remove("visible") : label.element.classList.add("visible");
          // 标记物旋转出屏幕时显示侧边贴靠导航，标记物出现在屏幕时隐藏侧边贴靠导航
          if (Math.abs(pos.x) < 1.2 && pos.z < 1) {
            data.filtederRooms.forEach((item) => {
              if (item.key === label.key) {
                item.visible = false;
              }
            });
          } else {
            data.filtederRooms.forEach((item) => {
              if (item.key === label.key) {
                item.visible = true;
              }
            });
          }
          const translateX = screenPosition.x * sizes.width * 0.5;
          const translateY = -screenPosition.y * sizes.height * 0.5;
          label.element.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`;
        } else {
          label.element.classList.remove("visible");
        }
      }
    }

    // 更新小地图
    if (camera && controls) {
      const dirx = camera.position.x - controls.target.x
      const dirz = camera.position.z - controls.target.z
      const theta = Math.atan2(dirx, dirz) * 180 / Math.PI;
      data.tinyMapRotate = -theta;
      const room = rooms.filter((item) => item.key === data.currentRoom)[0];
      data.tinyMapPosition = room.tinyMapPosition;
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
  gsap.killTweensOf(data, 'progress');
  gsap.to(data, { duration: 2, progress: 1 });
  await sleep(500);
  data.currentRoom = destinationRoom.currentRoom;
  data.sliders = rooms.filter((item) => item.key === data.currentRoom)[0].sliders || [];
  data.showMascot = data.filtederRooms.some((item) => item.key === data.currentRoom && item.sliders);
};

// 点击地面方位点
const handleRouteButtonClick = async (marker) => {
  data.sceneOrigin.children[0].material.map = marker.origin;
  data.sceneDestination.children[0].material.map = marker.destination;
  data.progress = 0;
  gsap.killTweensOf(data, 'progress');
  gsap.to(data, { duration: 2, progress: 1 });
  await sleep(500);
  data.currentRoom = marker.destinationRoom;
  data.sliders = rooms.filter((item) => item.key === data.currentRoom)[0].sliders || [];
  data.showMascot = data.filtederRooms.some((item) => item.key === data.currentRoom && item.sliders);
  if (data.currentRoom === 'hall-0') {
    Animations.animateCamera(data.camera, data.controls, { x: 0, y: 0, z: data.cameraZAxis }, { x: 0, y: 0, z: 0 }, 3200, () => {});
  }
};

// 点击交互点
const handleReactivePointClick = (point) => {
  Bus.emit("toggleMascot", false);
  sliderRef.value && (sliderRef.value.sliderShow(false));
  showCard(point).then(() => {
    Bus.emit("toggleMascot", true);
    sliderRef.value && (sliderRef.value.sliderShow(true));
  })
};

onMounted(() => {
  initScene();
  Animations.animateCamera(data.camera, data.controls, { x: 0, y: 0, z: data.cameraZAxis }, { x: 0, y: 0, z: 0 }, 1600, () => {});
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
      height 77px
      width 272.5px
      background url('@/assets/images/family/back_button_bg.png') no-repeat center
      background-size 100% 100%
      display flex
      align-items center
      padding-left 38px
      overflow hidden
      cursor pointer
      transition filter .25s ease-out
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
      &:hover
        filter brightness(1.2)
  .logo
    position fixed
    right 24px
    top 24px
    .icon
      display inline-block
      height 56px
      width 256px
      background url('@/assets/images/common/logo.png') no-repeat center
      background-size 100% 100%
  .tiny-map
    top 110px
    right 24px
  .switch
    position fixed
    right 24px
    top calc(180PX + 200px)
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
      padding 8px 8px 8px 24px
      -webkit-backdrop-filter blur(4px)
      -moz-backdrop-filter blur(4px)
      backdrop-filter blur(4px)
      cursor pointer
      transition all .25s ease-out
      .text
        color rgba(255, 255, 255, 1)
        font-size 28px
        font-weight 800
      &:not(last-child)
        margin-bottom 32px
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
      cursor: help;
      transition all .3s ease-in-out;
      display flex
      align-items center
      transform: scale(0, 0);
      &::before
        display inline-block
        content ''
        width: 64PX;
        height: 64PX;
        background-image url('@/assets/images/sprites/interactive.png')
        background-repeat: no-repeat
        background-position: 0 0
        background-size: 100%
        background-position-y: 0
        -webkit-animation: interactivePointAnimation 2s steps(24) forwards infinite;
        animation: interactivePointAnimation 2s steps(24) forwards infinite
        -webkit-animation-fill-mode both;
        animation-fill-mode both;
      .label-tips
        height 88px
        width 200px
        overflow hidden
        font-size 32px
        background rgba(255, 255, 255, .6)
        border-radius 10px
        border 1px solid rgba(255, 255, 255, .5)
        -webkit-backdrop-filter blur(4px)
        -moz-backdrop-filter blur(4px)
        backdrop-filter blur(4px)
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
        flex-direction row-reverse
        .label-tips
          left -200px
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
      transform: scale(.8, .8);

  .room-label
    position: fixed;
    top: 50%;
    left: 50%;
    z-index 10
    &-box
      background rgba(0, 0, 0, .4)
      color rgba(255, 255, 255, 1)
      font-size 28px
      font-weight 600
      padding 12px 24px
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
  display none
  &::after
    display inline-block
    content ''
    height 200px
    width 240px
    background-image url('@/assets/images/sprites/marker.png')
    background-repeat: no-repeat
    background-position: 0 0
    background-size: 100%
    background-position-y: 0
    -webkit-animation: markerAnimation 4s steps(24) forwards infinite;
    animation: markerAnimation 2.4s steps(24) forwards infinite
    -webkit-animation-fill-mode both;
    animation-fill-mode both;
    cursor pointer
    transform: scale(0, 0);
  &:hover
    &::after
      filter brightness(1.2)
  &.visible
    display block
    &::after
      transform: scale(.8, .8);

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

@-webkit-keyframes markerAnimation {
  0% {
    background-position: 0 0;
  }
  to {
    background-position: 0 -4800px;
  }
}
@keyframes markerAnimation {
  0% {
    background-position: 0 0
  }
  to {
    background-position: 0 -4800px;
  }
}

@-webkit-keyframes interactivePointAnimation {
  0% {
    background-position: 0 0;
  }
  50% {
    background-position: 0 -1536PX;
  }
}
@keyframes interactivePointAnimation {
  0% {
    background-position: 0 0
  }
  to {
    background-position: 0 -1536PX;
  }
}

.mascot-and-slider
  &.is-relative
    position absolute
    display flex
    bottom 0
    align-items flex-end
    width 100%
    :deep(.mascot)
      position absolute
      left 0 !important
      bottom 0 !important
      transform translateY(25%)
    :deep(.slider)
      position relative
      left 0 !important
      bottom 0 !important
      margin-left 20px !important
      width auto !important
      flex 1
      display flex
      justify-content center
  &.more-slider
    :deep(.slider)
      margin-left 316px !important
</style>
