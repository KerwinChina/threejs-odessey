<template>
  <div class="slider js-slider" :key="Math.random()">
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
            <p class="p2">xxxx</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/* eslint-disable */
import { onMounted, onUpdated, watch } from 'vue';
import { Draggable } from '@/utils/index';
import { Bus } from '@/utils';

const props = defineProps({
  sliders: {
    type: Array,
    default: () => {
      return [];
    }
  }
});

// 点击轮播卡片
const handleProductClick = (product) => {
  Bus.emit('toggleMascot', false);
  Bus.emit('show-card', product);
}

const renderSlider = () => {
  new Draggable(document.querySelector('.js-slider'));
}

onMounted(() => {
  renderSlider();
});

onUpdated(() => {
  renderSlider();
});

watch(
  () => props.sliders, (newData) => {
    if (newData) {
      renderSlider();
    }
  },
  {
    deep: true,
    // immediate: true
  }
);
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
  height 250px
  display flex
  align-items center
  margin-left auto
  margin-right auto
  position fixed
  bottom 0
  left 24px
  z-index 11
  // border 1px solid red
  .slides
    display flex
  .slide
    width 244px
    height 210px
    display flex
    flex-direction column
    margin-right 16px
    overflow hidden
    background-image linear-gradient(180deg, rgba(0, 69, 234, 0.90) 1%, rgba(0, 96, 234, 0.90) 12%, rgba(98, 199, 255, 0.90) 87%)
    border-radius: 24px
    -webkit-backdrop-filter blur(4px)
    -moz-backdrop-filter blur(4px)
    backdrop-filter blur(4px)
    box-shadow 1px 1px 2px #7bd5ff
    .content
      padding 8px 8px 16px 24px
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
            background #18C378
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
          font-size 32px
          color #FFFFFF
          font-weight 700
          margin-bottom 8px
        .p2
          font-size 16px
          color #1957ED
</style>
