<template>
  <div class="mascot" :style="{...position}">
    <i class="icon float" v-if="type === 'float'"></i>
    <i class="icon talk" v-if="type === 'talk'"></i>
    <i class="icon intro" v-if="type === 'intro'"></i>
    <i class="icon hi" v-if="type === 'hi'"></i>
    <i class="icon bye" v-if="type === 'bye'"></i>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, reactive } from 'vue';
import { Bus } from '@/utils';

const data = reactive({
  showMascot: true,
});

defineProps({
  type: {
    type: String,
    default: 'float',
  },
  position: {
    type: Object,
    default: () => {},
  },
});
</script>

<style lang="stylus" scoped>
.mascot
  position absolute
  left -20px
  bottom 60px
  z-index 11
  .icon
    display inline-block
    transform scale(.9)
    &.float
      height 618px
      width 300px
      background-image url('@/assets/images/sprites/mascot_float.png')
      background-repeat: no-repeat
      background-position: 0 0
      background-size: 100%
      background-position-y: 0
      -webkit-animation: floatAnimation 2s steps(48) forwards infinite;
      animation: floatAnimation 2s steps(48) forwards infinite
      -webkit-animation-fill-mode both;
      animation-fill-mode both;
    &.talk
      height 618px
      width 300px
      background-image url('@/assets/images/sprites/mascot_talk.png')
      background-repeat: no-repeat
      background-position: 0 0
      background-size: 100%
      background-position-y: 0
      -webkit-animation: floatAnimation 2s steps(48) forwards infinite;
      animation: floatAnimation 2s steps(48) forwards infinite
      -webkit-animation-fill-mode both;
      animation-fill-mode both;
    &.intro
      height 618px
      width 300px
      background-image url('@/assets/images/sprites/mascot_talk.png')
      background-repeat: no-repeat
      background-position: 0 0
      background-size: 100%
      background-position-y: 0
      -webkit-animation: floatAnimation 2s steps(48) forwards infinite;
      animation: floatAnimation 2s steps(48) forwards infinite
      -webkit-animation-fill-mode both;
      animation-fill-mode both;
      position relative
      &::after
        content '点击地面标记物进行室内漫游'
        display inline-block
        background rgba(0, 0, 0, .4)
        backdrop-filter blur(4px)
        font-size 24px
        color rgba(255, 255, 255, 1)
        position absolute
        padding 24px
        right -340px
        top 300px
        border-radius 8px
    &.hi
      height 618px
      width 300px
      background-image url('@/assets/images/sprites/mascot_hi.png')
      background-repeat: no-repeat
      background-position: 0 0
      background-size: 100%
      background-position-y: 0
      -webkit-animation: hiAnimation 3.2s steps(29) forwards infinite;
      animation: hiAnimation 3.2s steps(29) forwards infinite
      -webkit-animation-fill-mode both;
      animation-fill-mode both;

@-webkit-keyframes floatAnimation {
  0% {
    background-position: 0 0;
  }
  50% {
    background-position: 0 -29664px;
  }
}
@keyframes floatAnimation {
  0% {
    background-position: 0 0
  }
  to {
    background-position: 0 -29664px;
  }
}

@-webkit-keyframes hiAnimation {
  0% {
    background-position: 0 0;
  }
  to {
    background-position: 0 -17922px;
  }
}
@keyframes hiAnimation {
  0% {
    background-position: 0 0
  }
  to {
    background-position: 0 -17922px;
  }
}
</style>
