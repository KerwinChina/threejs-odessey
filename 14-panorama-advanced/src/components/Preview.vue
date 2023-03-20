<template>
  <div class="preview" v-if="data.visible && data.src !== ''">
    <i class="close" @click="handleClose"></i>
    <div class="image-container">
      <img class="image" :src="data.src" />
    </div>
  </div>
</template>

<script setup>
/* eslint-disable */
import { onBeforeUnmount, onMounted, reactive } from 'vue';
import { Bus } from '@/utils';

const data = reactive({
  visible: false,
  src: '',
});

const handleClose = () => {
  data.src = '';
  data.visible = false;
}

onMounted(() => {
  Bus.on('preview-image', (src) => {
    data.src = src;
    data.visible = true;
  });
});

onBeforeUnmount(() => {
  Bus.off('preview-image');
});
</script>

<sstyle lang="stylus" scoped>
.preview
  height 100vh
  width 100vw
  background rgba(0, 0, 0, .5)
  position fixed
  left 0
  top 0
  -webkit-backdrop-filter blur(4px)
  backdrop-filter blur(4px)
  z-index 111
  .close
    display inline-block
    height 32px
    width 32px
    background url('@/assets/images/family/icon_close.png') no-repeat center
    background-size 100% 100%
    position absolute
    top 28px
    right 28px
    cursor pointer
    transition all .25s ease-in-out
    &:hover
      opacity .75
  .image-container
    height 100%
    width 100%
    display flex
    justify-content space-around
    align-items center
    .image
      height 100%
      width 80%
      object-fit contain
</sstyle>
