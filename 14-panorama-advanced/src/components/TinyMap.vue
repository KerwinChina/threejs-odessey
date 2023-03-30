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
  background rgba(0, 0, 0, .3)
  border-radius 8px
  border 1px groove rgba(255, 255, 255, .1)
  -webkit-backdrop-filter blur(4px)
  backdrop-filter blur(4px)
  z-index 11
  overflow hidden
  box-shadow 1px 1px 1px rgba(0, 0, 0, .1)
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
