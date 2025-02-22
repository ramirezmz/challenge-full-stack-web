import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/Login.vue'),
      meta: { public: true }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/pages/privates/Dashboard.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/',
      redirect: '/dashboard'
    }
  ]
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token')
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router