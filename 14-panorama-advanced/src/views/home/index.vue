<template>
  <div class="home">
    <canvas class="webgl"></canvas>

    <!-- logo -->
    <div class="vr">
      <span class="box">
        <i class="icon"></i>
        <b class="text">全景漫游</b>
      </span>
    </div>

    <!-- 小地图 -->
    <TinyMap class="tiny-map" :rotate="data.tinyMapRotate" :position="data.tinyMapPosition" />

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
            <p class="p1">{{ point.value }}</p>
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

    <a class='github' href='https://github.com/dragonir/threejs-odessey' target='_blank' rel='noreferrer'>
      <svg height='40' aria-hidden='true' viewBox='0 0 16 16' version='1.1' width='40' data-view-component='true'>
        <path fill='#000000' fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
      </svg>
      <span class='author'>three.js odessey</span>
    </a>
  </div>
</template>

<script setup>
/* eslint-disable */
import { computed, onMounted, reactive, onBeforeUnmount, ref } from 'vue';
import { useRouter } from 'vue-router';
import * as THREE from 'three';
import { Bus, sleep, toast } from '@/utils';
import { rooms, markers, roomLabels } from '@/views/home/data';
import { OrbitControls } from '@/utils/OrbitControls.js';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import gsap from 'gsap';
import fragment from '@/shaders/cross/fragment.js';
import vertex from '@/shaders/cross/vertex.js';
import Animations from '@/utils/animations';
import TinyMap from '@/components/TinyMap.vue';

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
  currentRoom: 'living-room',
  // 当前滑动横幅
  sliders: rooms[0].sliders,
  // 用于显示固定侧边栏的房屋
  filtederRooms: rooms.filter((item) => item.showSwitch === true),
  rotate: 0,
  tinyMapPosition: {
    left: 0,
    top: 0
  }
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
  const canvas = document.querySelector("canvas.webgl");
  const renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  data.renderer = renderer;

  const camera = new THREE.PerspectiveCamera(
    55,
    window.innerWidth / window.innerHeight,
    0.001,
    1000
  );
  camera.position.set(0, 16, 16);
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
    data.filtederRooms.forEach((item) => item.visible = true);
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

// 点击侧边固定切换点
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

// 点击空间交互点
const handleReactivePointClick = (point) => {
  toast(`您点击了${point.value}`);
};

onMounted(() => {
  initScene();
  Animations.animateCamera(data.camera, data.controls, { x: 0, y: 0, z: data.cameraZAxis }, { x: 0, y: 0, z: 0 }, 1600, () => {});
});

onBeforeUnmount(() => {
  data.keyframeTimeout && clearTimeout(data.keyframeTimeout);
});
</script>

<style lang="stylus" scoped>
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
      -webkit-backdrop-filter blur(8px)
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

  .tiny-map
    top 24px
    right 24px
  .switch
    position fixed
    right 24px
    top calc(180PX + 18%)
    z-index 11
    -webkit-animation slideInRight 1s .3s
    animation slideInRight 1s .3s
    -webkit-animation-fill-mode both
    animation-fill-mode both
    .button
      display block
      background rgba(0, 0, 0, .25)
      border-radius 8px
      display flex
      align-items center
      padding 8px 0 8px 24px
      -webkit-backdrop-filter blur(4px)
      -moz-backdrop-filter blur(4px)
      backdrop-filter blur(4px)
      cursor pointer
      transition all .25s ease-out
      border 1px groove rgba(255, 255, 255, .15)
      .text
        color rgba(255, 255, 255, 1)
        font-size 24px
        font-weight normal
      &:not(last-child)
        margin-bottom 24px
      .icon
        display inline-block
        height 30px
        width 30px
        background url('@/assets/images/home/icon_arrow.png') no-repeat center
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
        background rgba(255, 255, 255, .5)
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
              color #00452d
              font-weight 500
      &.label-tv
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
      background rgba(0, 0, 0, .2)
      color rgba(255, 255, 255, 1)
      font-size 24px
      padding 12px 24px
      border-radius 8px
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
        background url('@/assets/images/home/icon_arrow.png') no-repeat center
        background-size 100% 100%
        position absolute
        left -48px
        transform rotate(360deg)
        animation arrowLeft 2.8s ease-in-out infinite
    &.visible
      .room-label-box
        transform: scale(1, 1);

.github {
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 1;
  font-size: 18PX;
  color: rgba(0, 0, 0, 1);
  display: flex;
  align-items: center;
  padding: 16px;
  transition: all .25s ease-in-out;
  text-decoration: none;
  text-shadow: 0 1px 2px rgba(0, 0, 0, .2);
  opacity: .8;
}

.github:hover {
  opacity: .5;
}

.github .author {
  padding-left: 8px;
}

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
  display none
  &::after
    display inline-block
    content ''
    height 64PX
    width 64PX
    background-image url('@/assets/images/sprites/marker.png')
    background-repeat: no-repeat
    background-position: 0 0
    background-size: 100%
    background-position-y: 0
    -webkit-animation: markerAnimation 2s steps(20) forwards infinite
    animation: markerAnimation 2s steps(20) forwards infinite
    -webkit-animation-fill-mode both;
    animation-fill-mode both;
    transition all linear
    cursor pointer
    transform: scale(0, 0);
    opacity .5
  &:hover
    &::after
      filter brightness(1.2)
      opacity 1
  &.visible
    display block
    &::after
      transform: scale(.8, .8);


@-webkit-keyframes markerAnimation {
  0% {
    background-position: 0 0;
  }
  to {
    background-position: 0 -1280PX;
  }
}
@keyframes markerAnimation {
  0% {
    background-position: 0 0
  }
  to {
    background-position: 0 -1280PX;
  }
}

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
</style>
