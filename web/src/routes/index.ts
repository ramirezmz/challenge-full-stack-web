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
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          redirect: '/dashboard/students'
        },
        {
          path: 'students',
          name: 'students',
          component: () => import('@/pages/privates/StudentDashboard.vue')
        },
        {
          path: 'admins',
          name: 'admins',
          component: () => import('@/pages/privates/AdminDashboard.vue')
        },
        {
          path: '/dashboard/students/:userId',
          name: 'edit-student',
          component: () => import('@/pages/privates/EditStudent.vue')
        },
      ]
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