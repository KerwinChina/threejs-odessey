<template>
  <div class="mascot">
    <span class="close" @click="handleCloseClick" v-if="type === 'intro'"><i class="arrow"></i></span>
    <i class="icon float" v-if="type === 'float'" :style="{...position}"></i>
    <i class="icon talk" v-if="type === 'talk'" :style="{...position}"></i>
    <i class="icon intro" v-if="type === 'intro'" :style="{...position}">
      <span class="bubble" v-if="data.showBubble">
        <i class="bg"></i>
        <b class="text">
          <span>HI～我是小翼，<br />点击地面标记物<br />进行室内漫游</span>
        </b>
      </span>
    </i>
    <i class="icon hi" v-if="type === 'hi'" :style="{...position}"></i>
    <i class="icon bye" v-if="type === 'bye'" :style="{...position}"></i>
  </div>
</template>

<script setup>
import { reactive } from 'vue';

const data = reactive({
  showMascot: true,
  showBubble: true,
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

const handleCloseClick = () => {
  data.showBubble = !data.showBubble;
};
</script>

<style lang="stylus" scoped>
.mascot
  position absolute
  left -20px
  bottom 60px
  z-index 11
  .close
    display inline-block
    height 32px
    width 32px
    background rgba(10, 10, 80, .4)
    position absolute
    bottom 0
    left 24px
    border-radius 50%
    overflow hidden
    backdrop-filter blur(4px)
    cursor pointer
    z-index 111
    display flex
    justify-content space-around
    align-items center
    .arrow
      display inline-block
      height 100%
      width 100%
      background url('@/assets/images/family/icon_down.png') no-repeat center
      background-size 80% 80%
      transform rotate(90deg)
  .icon
    display inline-block
    transform scale(.9)
    position relative
    &.float
      height 618PX
      width 300PX
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
      height 618PX
      width 300PX
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
      height 618PX
      width 300PX
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
      .bubble
        height 398PX
        width 398PX
        color rgba(255, 255, 255, 1)
        position absolute
        right -360PX
        top 0
        .bg
          display inline-block
          height 100%
          width 100%
          background url('@/assets/images/family/bubble.png') no-repeat center
          background-size contain
          display flex
          justify-content space-around
          align-items center
          transition all .25s ease-in-out
          animation bubbleAnimate 16s linear infinite
          position absolute
          left 0
          top 0
        .text
          display inline-block
          height 100%
          width 100%
          font-size 24PX
          font-style normal
          line-height 2
          font-weight 500
          text-shadow 1px 1px 1px rgba(0, 0, 0, .2)
          position absolute
          left 0
          top 0
          display flex
          align-items center
          justify-content space-around
    &.hi
      height 618PX
      width 300PX
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
    background-position: 0 -29664PX;
  }
}
@keyframes floatAnimation {
  0% {
    background-position: 0 0
  }
  to {
    background-position: 0 -29664PX;
  }
}

@-webkit-keyframes hiAnimation {
  0% {
    background-position: 0 0;
  }
  to {
    background-position: 0 -17922PX;
  }
}
@keyframes hiAnimation {
  0% {
    background-position: 0 0
  }
  to {
    background-position: 0 -17922PX;
  }
}

@-webkit-keyframes bubbleAnimate {
  0% {
    filter brightness(1)
    transform rotate(0)
  }
  50% {
    filter brightness(1.5)
  }
  100% {
    filter brightness(1)
    transform rotate(0)
  }
}
@keyframes bubbleAnimate {
  0% {
    filter brightness(1)
    transform rotate(0)
  }
  50% {
    filter brightness(1.5)
  }
  100% {
    filter brightness(1)
    transform rotate(360deg)
  }
}
</style>
