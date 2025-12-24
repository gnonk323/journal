import { createRouter, createWebHistory } from 'vue-router'
import { checkAuth } from '../services/auth'

const routes = [
  {
    path: '/',
    name: "Login",
    component: () => import('../pages/Login.vue'),
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../pages/Home.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/days/today',
    name: 'Today',
    component: () => import('../pages/Today.vue'),
    meta: { requiresAuth: true },
  },
  {
    // date param in format YYYY-MM-DD
    path: '/days/:date(\\d{4}-\\d{2}-\\d{2})',
    name: 'DateView',
    component: () => import('../pages/Date.vue'),
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: '/calendar',
    name: 'Calendar',
    component: () => import('../pages/Calendar.vue'),
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    if (await checkAuth()) next()
    else next("/")
  } else {
    next()
  }
})

export default router
