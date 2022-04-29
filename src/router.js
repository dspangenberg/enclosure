import { createRouter, createWebHistory } from 'vue-router'
import { useStore } from '@/stores/global'

const routes = [
  {
    path: '/auth',
    name: 'auth',
    component: () => import(/* webpackChunkName: "authLayout" */ '@/layouts/TheAuthLayout.vue'),
    children: [{
      path: 'login',
      name: 'login',
      meta: { requiresAuth: false },
      component: () => import(/* webpackChunkName: "login" */ '@/views/Auth/Login.vue')
    },
    {
      path: 'autorize',
      name: 'autorize',
      meta: { requiresAuth: false },
      component: () => import(/* webpackChunkName: "autorize" */ '@/views/Auth/Autorize.vue')
    }]
  },
  {
    path: '/app',
    name: 'app',
    meta: { requiresAuth: false },
    component: () => import(/* webpackChunkName: "appLayout" */ '@/layouts/TheAppLayout.vue'),
    children: [{
      path: 'home',
      name: 'home',
      component: () => import(/* webpackChunkName: "home" */ '@/views/App/Home.vue')
    }]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/app/home'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  const store = useStore()
  const { user, client } = store

  if (to.meta.requiresAuth === false) next()
  if (!client) {
    await store.reconnect()
  }

  if (!user === false && to.meta.requiresAuth === true) {
    next({ name: 'login' })
  } else next()
})

export default router
