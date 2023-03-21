<template>
  <div class="layout">
    <div class="loading" v-if="!data.loadingComplete">
        <span class="progress">{{ `${data.percent}%` }}</span>
    </div>
    <router-view />
  </div>
</template>

<script setup>
/* eslint-disable */
import { onMounted, reactive } from 'vue';
import { resourceList } from '@/config';
import Loader from '@/utils/loader';

const data = reactive({
  loadingComplete: false,
  percentBefore: 0,
  percent: 0,
})

onMounted(() => {
  const resourceLoader = new Loader();
  resourceLoader.self.setData(resourceList);
  resourceLoader.load.start();
  resourceLoader.load.on('loading', function(event) {
    data.percentBefore = 0 + Math.floor((event.nowProgress / event.allProgress) * 100);
  });
  resourceLoader.load.on('complete', function() {
    console.log('complete');
  });
  const interval = setInterval(() => {
    if (data.percent >= 100) {
      clearInterval(interval);
      data.loadingComplete = true;
    }
    if (data.percent < data.percentBefore) data.percent++;
  }, 20);
});

</script>

<style lang="stylus" scoped>
.loading
  position fixed
  height 100vh
  width 100vw
  background #fff;
  left 0
  top 0
  z-index 111
  background: #c4eeb2
  background-image radial-gradient(at 43.0% 19.0%, #567dbf 0px, transparent 50%),radial-gradient(at 82.0% 18.0%, #00c0f5 0px, transparent 50%),radial-gradient(at 77.0% 15.0%, hsl(230, 50%, 46%) 0px, transparent 50%),radial-gradient(at 30.0% 73.0%, hsl(111, 65%, 57%) 0px, transparent 50%),radial-gradient(at 6.0% 3.0%, #ede34e 0px, transparent 50%)
  text-align center
  overflow hidden
  display flex
  align-items center
  justify-content space-around
  display none
  .progress
    display inline-block
    font-size 124px
    color #FFFFFF
    text-shadow 0 1px 0 hsl(174,5%,80%),
                0 2px 0 hsl(174,5%,75%),
                0 3px 0 hsl(174,5%,70%),
                0 4px 0 hsl(174,5%,66%),
                0 5px 0 hsl(174,5%,64%),
                0 6px 0 hsl(174,5%,62%),
                0 7px 0 hsl(174,5%,61%),
                0 8px 0 hsl(174,5%,60%),
                0 0 5px rgba(0,0,0,.05),
              0 1px 3px rgba(0,0,0,.2),
              0 3px 5px rgba(0,0,0,.2),
              0 5px 10px rgba(0,0,0,.2),
            0 10px 10px rgba(0,0,0,.2),
            0 20px 20px rgba(0,0,0,.3)
</style>
