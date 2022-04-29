import { createRouter, createWebHistory } from 'vue-router'
// import { useAuth } from '@/composables/use-auth'

const routes = [
  {
    path: '/auth',
    name: 'auth',
    meta: { requiresAuth: false },
    component: () => import(/* webpackChunkName: "authLayout" */ '../layouts/TheAuthLayout.vue'),
    children: [{
      path: 'login',
      name: 'login',
      component: () => import(/* webpackChunkName: "login" */ '@/views/Auth/Login.vue')
    },
    {
      path: 'autorize',
      name: 'autorize',
      component: () => import(/* webpackChunkName: "autorize" */ '@/views/Auth/Autorize.vue')
    }]
  },
  {
    path: '/app',
    name: 'app',
    meta: { requiresAuth: false },
    component: () => import(/* webpackChunkName: "appLayout" */ '../layouts/TheAppLayout.vue'),
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

/*
router.beforeEach((to, from, next) => {
  const { authenticating, user } = useAuth()

  if (authenticating.value === false && to.meta.requiresAuth === true && !user?.value) {
    next({ name: 'login' })
  } else next()
})
*/

export default router
