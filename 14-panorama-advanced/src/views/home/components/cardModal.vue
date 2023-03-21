<template>
  <div class="card">
    <div class="box card-box">
      <div class="icon-close" @click="handleClose"></div>
      <div class="card-item" v-for="(item, index) in data.details" :ref="setItemRef" :data-index="index" :key="index">
        <div class="card-item-title">{{ item.title }}</div>
        <div class="card-item-desc">{{ item.description }}</div>
        <div class="card-item-video" v-if="item.video">
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
        <div class="card-item-image" v-if="item.image" @click="handleImageClick(item.image)">
          <img class="image" :src="item.image" />
        </div>
      </div>
      <div class="catalogue">
        <div class="catalogue-list" v-if="data.showCatalogue">
          <div class="catalogue-item" :class="{active: data.currentCatalogue === index}" @click="goCardItem(index)" v-for="(item, index) in data.details" :key="index">
            <i class="point"></i>
            <p>{{ item.title }}</p>
          </div>
        </div>
        <i class="icon-catalogue" @click="goShowCatalog"></i>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  reactive, watch, ref, onMounted, onBeforeUnmount,
} from 'vue';
import { Bus } from '@/utils';

const data = reactive({
  showCatalogue: false,
  currentCatalogue: '',
  details: [],
  name: '',
  poster: new URL('@/assets/images/family/poster.png', import.meta.url).href,
});
const myObserver = new IntersectionObserver((entries, self) => {
  entries.forEach((entry) => {
    if (entry.intersectionRatio > 0) {
      const warpperDom = entry.target;
      const dataIndex = warpperDom.dataset.index;
      if (dataIndex) {
        data.currentCatalogue = +dataIndex;
      }
    }
  });
}, {
  threshold: [0, 1],
});
const emit = defineEmits(['cancel']);
const props = defineProps({
  product: {
    type: Object,
    default: () => {},
  },
});
const itemRefs = ref([]);
const setItemRef = (el) => {
  itemRefs.value.push(el);
};

const goShowCatalog = () => {
  data.showCatalogue = !data.showCatalogue;
};
const handleClose = () => {
  emit('cancel');
};
const goCardItem = (index) => {
  data.currentCatalogue = index;
  itemRefs?.value[index]?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
};

const nameFormat = (string) => {
  const str = string.trim().length > 4 ? string.slice(0, 4) : string;
  return str;
};

const handleImageClick = (src) => {
  if (src) {
    Bus.emit('preview-image', src);
  }
};

onMounted(function () {
  for (const itemRef of itemRefs.value) {
    myObserver.observe(itemRef);
  }
});

watch(() => props.product, function (obj) {
  if (obj) {
    data.name = obj.name || '';
    data.details = obj.details || [];
    data.visible = true;
  }
}, {
  immediate: true,
});
onBeforeUnmount(function () {
  myObserver.disconnect();
});
</script>

<style lang="stylus" scoped>
.card
  position fixed
  height 100vh
  width 920px
  top 0
  right 0
  background-image: linear-gradient(270deg, rgba(4,12,51,0.70) 34%, rgba(3,11,51,0.00) 100%)
  z-index 44
  .box
    width 100%
    position absolute
    top 0
    left 0
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
            cursor pointer
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
.card-box
  padding 104px 60px 0 60px
  height 100%
  overflow-x hidden
  overflow-y auto
  text-shadow 1px 1px 1px rgba(0, 0, 0, .2)
  .card-item
    margin-bottom 64px
    &-title
      font-size 36px
      color #FFFFFF
      font-weight 700
      margin-bottom 12px
    &-desc
      font-size 20px
      color #FFFFFF
      font-weight 400
      margin-top 4px
      line-height 1.75
    &-video
      width 800px
      height 450px
      margin-top 32px
      .video
        height 100%
        width 100%
        object-fit contain
    &-image
      width 800px
      height 400px
      margin-top 32px
      overflow hidden
      cursor pointer
      .image
        height 100%
        width 100%
        object-fit cover
        transition all .25s ease-out
        box-sizing border-box
      &:hover
        .image
          transform scale(1.2)
.icon-close
  width 30px
  height 30px
  background url('@/assets/images/family/icon_close.png')
  background-size 100%
  background-repeat no-repeat
  position absolute
  right 20px
  top 20px
  cursor pointer
.catalogue
  width 56px
  height 56px
  background-image linear-gradient(86deg, #0B25A1 2%, #1173EE 84%)
  position fixed
  right 32px
  bottom 32px
  border-radius 50%
  display flex
  align-items center
  justify-content center
  .catalogue-list
    position absolute
    background: #FFFFFF
    border-radius: 20px
    padding 33px 18px 33px 20px
    top: 0
    transform translateY(-105%)
    right 0
    min-width 142px
    .catalogue-item
      font-size: 18px
      color: #1D1F24
      font-weight: 500
      margin-bottom 26px
      display flex
      align-items center
      text-shadow none
      &.active
        color: #3573FE
        .point
          background: #3573FE
          width 6px
          height 14px
          border-radius 0
      &:last-child
        margin 0
      .point
        width 4px
        height 4px
        background: #1D1F24
        border-radius 50%
        margin-right 8px
  .icon-catalogue
    width 24px
    height 24px
    background url('@/assets/images/family/icon_catalogue.png')
    background-size 100%
    cursor pointer
    transition all .25s ease-out
    &:hover
      filter brightness(1.2)
</style>
