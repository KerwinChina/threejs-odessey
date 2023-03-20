<template>
  <div class="layout">
    <div class="loading" v-if="!data.loadingComplete">
        <span class="progress">{{ `${data.percent}%` }}</span>
    </div>
    <div class="orient">
      <i class="icon"></i>
      <p class="text">竖握手机，精彩继续</p>
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
.orient
  display none
  position fixed
  height 100%
  width 100%
  left 0
  top 0
  right 0
  bottom 0
  z-index 999
  background: #c4eeb2
  background-image radial-gradient(at 43.0% 19.0%, #567dbf 0px, transparent 50%),radial-gradient(at 82.0% 18.0%, #00c0f5 0px, transparent 50%),radial-gradient(at 77.0% 15.0%, hsl(230, 50%, 46%) 0px, transparent 50%),radial-gradient(at 30.0% 73.0%, hsl(111, 65%, 57%) 0px, transparent 50%),radial-gradient(at 6.0% 3.0%, #ede34e 0px, transparent 50%)
  text-align center
  flex-direction column
  justify-content space-around
  align-items center
  .icon
    display inline-block
    height 120px
    width 120px
    background url('data:image/png;base64,     iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAAeFBMVEUAAAD////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////GqOSsAAAAJ3RSTlMA2me+BKks4KymCfjofpglkVcx7ooT1D/OGbKgXk8fDchvRzm5g3i3w4JLAAADY0lEQVR42u2b6ZKiMBSFL7ITVgVREXBr8/5vOJVlOqasGiXauV0j5wdV6a6Yz3sP2UxAaljk7kRdyqqBN6nIU2oiJ3sPwmJFTeWc4HV90RdEqte/P+VaR74fRX4c0kfaxL7vR/4uFATnV/NP2MdcWk+W84cAexBKqjUnT8BUqsFSleOHAAv4q8aVZV1N4MHTGpj/XVDKHgKcbppiaTiArn1K3WaKA/Q0jl34TzkZ3OjIqhdwo6RkkMenATqWRdCUJInn8YcnHnpZDyBzUA9KwUGm6VmxLEZgLM/RW9uLLsVtJgH4LwOo8HOVCaAAyPCnrG/CSEElwu8sAQcgILJzXu+u7YiQgp7eKOz60TbANqWawnJp2YQnwjOgEEjUWgNQvfiq2nfON8PubLUj2vE2AbxltpEEJN9a7Ii2fIrwxf/RdjIZ6d4eALTkZrgsajnVi7fWAODIv/PfBodcRMFprQGAr4+FZ1c4YWHBhELNWp+yeFcRhMxWBCBwHb2xsyNGSBsA8m+gq9lxgtwWwL28UsQACUCtfa4WTKjpbq5d4QFAzceJACcFasGzSfAAkgM3Ih4AFHxkaPEAoBJLWRwTKhsccSKgZo3pFgdADdY1IoC3Zp3BFgdA+TDDMaEKQTjiREDtiFWIAA17EXY4AGpPjAyIAC2ft6OYUFbI6rou7ABMWJ7PANYBfpsH0AHQUzADoAPMJvxvAIrgWQ3eDwB4JaHPijjd6e0mPNNpugTIAHTVvzkFOZlIQPofMeHy7nFf7nO+Vk8HvNewcBlBh9gTjhuWhAAPAJbMMlfMnvDCFkmYABnbscEBUAtV53cARPDpEZgBMACSIPjCNGHBOmJMgJIyIabA/3iAWAOIPh4APQWzCdEBZhPOJkQHQDchOgB6Cua3AN0D6ADoKZhNiA4wm3A2IXoEEEyYYUdgzB0nRQFQNT99k+p37ZSiA6CnABXA5/f1jNWs+OE0I9XsnC9cxX09A6nLRUswEtssjcVPR7lxBg4sjAmYqJJXIXbqGqnhjmsNJgr4CddGHm8j2QjTNXTyRsl0eVXK6mbqmm2YHxfTdPRX6nJlMa1uvaHqqHlyoa+olvE0UCjNn8TUWCQzv7x9UC/ffk3N5LbyA6ZXTTXbJX3uOlN1qdtvT9XTqm7ihbTuHyJiZ6xbOEA9AAAAAElFTkSuQmCC') no-repeat center;
    background-size: 100% 100%;
  .text
    font-size 44px
    color #ffffff
    font-weight 600

@media screen and (min-aspect-ratio: 13/8) {
  .orient {
    display: flex;
  }
}
</style>
