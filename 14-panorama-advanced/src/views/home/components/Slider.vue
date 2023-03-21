<template>
  <div class="slider js-slider" :key="Math.random()" v-show="isShow">
    <div class="slides js-slides">
      <div class="slide js-slide" v-for="(slider, index) in sliders" :key="index" @click="handleProductClick(slider)">
        <div class="content">
          <div class="top">
            <div class="left">
              <i class="dot"></i>
            </div>
            <div class="right">
              <i
                class="cover"
                :style="{
                  'background': `url(${slider.cover}) no-repeat center`,
                  'background-size': '100% 100%',
                }"
              ></i>
            </div>
          </div>
          <div class="bottom">
            <p class="p1">{{ slider.name }}</p>
            <p class="p2">智能设备</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/* eslint-disable */
import { ref } from 'vue';
import { Bus } from '@/utils';
import useShowCard from '@/hooks/use-show-card.js';

const props = defineProps({
  sliders: {
    type: Array,
    default: () => {
      return [];
    }
  }
});
const isShow = ref(true)
const {showCard} = useShowCard()
// 点击轮播卡片
const handleProductClick = (product) => {
  Bus.emit("toggleMascot", false);
  isShow.value = false;
  showCard(product, props.sliders).then(() =>{
    isShow.value = true;
    Bus.emit("toggleMascot", true);
  })
}
const sliderShow =(val)=>{
  isShow.value = val;
}
defineExpose({
  sliderShow
})
</script>

<style lang="stylus" scoped>
.slider
  cursor -webkit-grab
  cursor grab
  -webkit-user-select none
  -moz-user-select none
  -ms-user-select none
  user-select none
  width calc(100vw - 48px)
  // height 250px
  display flex
  align-items center
  margin-left auto
  margin-right auto
  position fixed
  bottom 0
  left 24px
  z-index 13
  justify-content center
  margin-bottom 20px
  .slides
    display flex
    align-items flex-end
  .slide
    width 244px
    height 210px
    display flex
    flex-direction column
    margin-right 16px
    background-image: linear-gradient(0deg, rgba(4,12,51,0.60) 30%, rgba(18,35,116,0.40) 100%)
    background-image: transparent
    border-radius: 24px
    position relative
    transition all 0.3s
    -webkit-backdrop-filter blur(6px)
    -moz-backdrop-filter blur(6px)
    backdrop-filter blur(6px)
    box-shadow 1px 1px 2px rgba(18,35,116,0.40)
    &:hover
      height 260px
      background-image: radial-gradient(circle at 14% 90%, rgba(214,99,255,0.50) 0%, rgba(255,255,255,0.00) 76%), linear-gradient(180deg, rgba(0,69,234,0.90) 1%, rgba(0,96,234,0.90) 12%, rgba(98,199,255,0.90) 87%) !important
      -webkit-backdrop-filter blur(6px)
      -moz-backdrop-filter blur(6px)
      backdrop-filter blur(6px)
      box-shadow 1px 1px 2px linear-gradient(0deg, rgba(4,12,51,0.60) 30%, rgba(18,35,116,0.40) 100%) 
      .dot
        background #00E4FB !important
      .p1
        margin-top 48px !important
      .p2
        color #00E4FB !important
    .content
      padding 8px 8px 16px 24px
      position relative
      z-index 4
      .top
        height 100px
        display flex
        justify-content space-between
        .left
          position relative
          .dot
            display inline-block
            height 13px
            width 13px
            background: #B5B5B5
            border-radius 50%
            position absolute
            top 16px
            left 0
        .right
          .cover
            display inline-block
            height 100px
            width 100px
      .bottom
        .p1
          font-size: 26px
          color #FFFFFF
          font-weight 700
          margin-bottom 18px
          transition all 0.3s
        .p2
          font-size 16px
          color #0096FD
          font-weight 700
</style>
<style lang="stylus">
.modal.myCardAnimation
  .animation-modal
    animation modalCardAnimation 0.4s
    z-index 3
  .modal-close-animation
    animation modalCardCloseAnimation 0.4s

@keyframes modalCardAnimation {
  0% {
    opacity: 0;
    transform: translateX(100%);
  }

  100% {
    opacity: 1;
    transform: translateX(0);
  }
}
@keyframes modalCardCloseAnimation {
  0% {
    opacity: 1;
    transform: translateX(0);
  }

  100% {
    opacity: 0;
    transform: translateX(100%);
  }
}   
</style>
