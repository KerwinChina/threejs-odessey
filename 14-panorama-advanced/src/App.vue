<template>
  <Layout />
</template>

<script setup>
import { getCurrentInstance } from 'vue';
import Layout from '@/components/Layout.vue';

const { proxy: ctx } = getCurrentInstance();
// 根实例
window.$root = ctx;
</script>
