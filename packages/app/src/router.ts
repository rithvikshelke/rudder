import { createRouter as _createRouter, createWebHistory } from '@ionic/vue-router'
import { Router } from 'vue-router'
const createRouter = (): Router => {
  return _createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
      {
        path: '/auth/callback',
        name: 'auth-callback',
        component: import('@/components/LoadingBlock.vue'),
        meta: {
          skipAuthentication: true,
        },
      },
      {
        path: '/',
        name: 'dashboard',
        component: import('@/views/Home.vue')
      },
      {
        path: '/unauthorized',
        name: 'unauthorized',
        component:  import('@/views/Unauthorized.vue'),
        meta: {
          skipAuthentication: true,
        },
      },
    ],
  })
}

export default createRouter
