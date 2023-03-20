import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'home',
    redirect: '/home',
  },
  {
    path: '/home',
    component: () => import('@/views/home/index.vue'),
    meta: {
      title: '',
    },
  },
  {
    path: '/family',
    component: () => import('@/views/family/index.vue'),
    meta: {
      title: '',
    },
  },
  {
    path: '/country',
    component: () => import('@/views/country/index.vue'),
    meta: {
      title: '',
    },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
