import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../pages/Home.vue'),
  },
  {
    path: '/days/today',
    name: 'Today',
    component: () => import('../pages/Today.vue'),
  },
  {
    path: '/calendar',
    name: 'Calendar',
    component: () => import('../pages/Calendar.vue'),
  },
  {
    // date param in format YYYY-MM-DD
    path: '/days/:date(\\d{4}-\\d{2}-\\d{2})',
    name: 'DateView',
    component: () => import('../pages/Date.vue'),
    props: true,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
