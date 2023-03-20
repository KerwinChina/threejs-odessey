<template>
  <div class="card" v-if="data.visible">
    <div class="box">
      <div class="top">
        <div class="left">
          <Mascot type="talk" :position="{'bottom': '-50px', 'left': 0}" />
        </div>
        <div class="right">
          <span class="name">
            <b class="text">{{ nameFormat(data.name) }}</b>
            <i class="icon" @click="handleClose"></i>
          </span>
        </div>
      </div>
      <div class="bottom">
        <div class="media" v-for="(item, index) in data.details" :key="index">
          <div class="bg">
            <p class="title">{{ item.title }}</p>
            <p class="text">{{ item.description }}</p>
            <div class="video-container" v-if="item.video">
              <video
                class="video"
                :src="item.video"
                :poster="data.poster"
                muted
                role="video"
                controlsList="nodownload"
                oncontextmenu="return false;"
                preload="auto"
                playsinline
                disablePictureInPicture
                loop="true"
                controls
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, reactive } from 'vue';
import { Bus } from '@/utils/index';
import Mascot from '@/views/family/components/Mascot.vue';

const data = reactive({
  visible: false,
  details: [],
  name: '',
  poster: new URL('@/assets/images/family/poster.png', import.meta.url).href,
});

const handleClose = () => {
  Bus.emit('toggleMascot', true);
  data.visible = false;
};

const nameFormat = (string) => {
  const str = string.trim().length > 4 ? string.slice(0, 4) : string;
  return str;
};

onMounted(() => {
  Bus.on('show-card', (params) => {
    data.name = params.name || 'xxx';
    data.details = params.details || [];
    data.visible = true;
  });
});

onBeforeUnmount(() => {
  Bus.off('show-card');
});

</script>

<style lang="stylus" scoped>
.card
  position fixed
  height 100vh
  width 100vw
  top 0
  left 0
  z-index 12
  .box
    height 80%
    width 100%
    position absolute
    bottom 0
    left 0
    background linear-gradient(to bottom, rgba(0, 0, 0, .6) 10%, rgba(0, 0, 0, .2))
    -webkit-backdrop-filter blur(8px)
    backdrop-filter blur(8px)
    border-radius 50px 50px 0 0
    box-shadow -1px -1px 1px rgba(200, 200, 200, .2)
    .top
      height 240px
      display flex
      justify-content space-between
      .left
        width 50%
        height 100%
        position relative
      .right
        width 50%
        height 100%
        display flex
        justify-content flex-end
        padding 30px
        .name
          display flex
          align-items center
          position relative
          top -40px
          .text
            font-size 40px
            color #ffffff
            font-weight 800
          .icon
            display inline-block
            height 68px
            width 68px
            background url('@/assets/images/family/icon_down.png') no-repeat center
            background-size 100% 100%
            margin-left 8px
    .bottom
      padding 0 24px 24px
      overflow hidden auto
      height calc(100% - 240px)
      .media
        background rgba(0, 80, 220, .5)
        border-radius 24px
        margin 20px auto
        -webkit-backdrop-filter blur(4px)
        backdrop-filter blur(4px)
        overflow hidden
        box-shadow 1px 1px 2px rgba(0, 212, 255, .4)
        &:first-child
          margin-top 0
        &:last-child
          margin-bottom 160px
        .bg
          padding 30px
          background radial-gradient(circle at 50% 120%, #00D4FF 0%, rgba(0, 138, 255, 0.00) 30%, rgba(0,138,255,0.00) 30%);
        .title
          font-size 36px
          color #ffffff
          font-weight 800
          &::before
            display inline-block
            content ''
            height 13px
            width 13px
            background #18C378
            border-radius 50%
            margin-right 20px
        .text
          font-size 30px
          color rgba(255, 255, 255, .8)
          margin-top 30px
          text-align justify
          text-align-last left
          line-height 1.5
        .video-container
          height 414px
          background #1e1e1e
          margin 24px auto 0
          overflow hidden
          .video
            height 100%
            width 100%
            object-fit contain
</style>
