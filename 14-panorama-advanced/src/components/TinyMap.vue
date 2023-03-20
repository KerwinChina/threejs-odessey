<template>
  <div class="tiny-map">
    <div class="map">
      <i class="rotate"
        :style="{
          'transform': `rotate(${rotate}deg)`,
          'left': `${position.left}px`,
          'top': `${position.top}px`
        }"
      ></i>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  rotate: {
    type: Number,
    default: 0,
  },
  position: {
    type: Object,
    default: () => ({ left: 0, top: 0 }),
  },
});
</script>

<style lang="stylus" scoped>
.tiny-map
  position fixed
  background-image linear-gradient(270deg, rgba(4,12,51,0.70) 0%, rgba(3,11,51,0.20) 100%)
  border-radius 10px
  -webkit-backdrop-filter blur(4px)
  backdrop-filter blur(4px)
  z-index 11
  .map
    height 220PX
    width 180PX
    background url('@/assets/images/tinyMap/tiny_map_home.png') no-repeat center
    background-size 100% 100%
    position relative
    .rotate
      display inline-block
      height 38PX
      width 38PX
      background url('@/assets/images/tinyMap/rotate.png') no-repeat center
      background-size 100% 100%
      transition left .5s ease-in-out, top .5s ease-in-out, transform ease-in-out
      position absolute
      transform-origin: center bottom
</style>
