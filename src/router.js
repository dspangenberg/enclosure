import { createRouter, createWebHistory } from 'vue-router'
import Account from '@/models/Account'

const routes = [
  {
    path: '/auth',
    name: 'auth',
    meta: { requiresAuth: false },
    component: () => import(/* webpackChunkName: "authLayout" */ '@/layouts/TheAuthLayout.vue'),
    children: [{
      path: 'login',
      name: 'login',
      meta: { requiresAuth: false },
      component: () => import(/* webpackChunkName: "login" */ '@/views/Auth/Login.vue')
    },
    {
      path: 'autorize/:id',
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
        path: 'notifications',
        name: 'notifications',
        component: () => import(/* webpackChunkName: "notifications" */ '@/views/App/Notifications.vue')
      },
      {
        path: 'timeline/bubble/:p/:type',
        name: 'following',
        component: () => import(/* webpackChunkName: "profile-bubble" */ '@/views/App/ProfileBubble.vue')
      },
      {
        path: 'timeline/:type/:p?',
        name: 'timeline',
        component: () => import(/* webpackChunkName: "home" */ '@/views/App/Home.vue')
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/app/timeline/home',
    meta: { requiresAuth: false }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth === false) {
    next()
  } else {
    try {
      console.log('RouterGuard')
      await Account.verifyAccountCredentials()
      next()
    } catch (error) {
      console.log(error)
      next({ name: 'login' })
    }
  }
})

export default router
