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
    meta: { requiresAuth: true },
    component: () => import(/* webpackChunkName: "appLayout" */ '@/layouts/TheAppLayout.vue'),
    children: [
      {
        path: 'timeline/:type?',
        name: 'bookmarks',
        component: () => import(/* webpackChunkName: "timeline-view" */ '@/views/App/TimelineView.vue')
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/app/timeline'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  const store = useStore()

  if (to.meta.requiresAuth === false) {
    next()
  } else {
    try {
      await store.reconnect()
      next()
    } catch (error) {
      console.log(error)
      next({ name: 'login' })
    }
  }
})

export default router
