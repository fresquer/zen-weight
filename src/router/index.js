import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '@/services/useAuth' // Importamos el composable de autenticación
import AppLayout from '../layouts/AppLayout.vue'
import HomeView from '../views/HomeView.vue'
import ConfigurationView from '../views/configuration/ConfigurationView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import LostPasswordView from '@/views/LostPasswordView.vue'
import ResetPassword from '@/views/ResetPassword.vue'

const routes = [
  {
    path: '/',
    redirect: () => {
      const { isAuthenticated } = useAuth()
      return isAuthenticated.value ? '/app' : '/login'
    },
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
  },
  {
    path: '/lost-password',
    name: 'lost-password',
    component: LostPasswordView,
  },
  {
    path: '/reset-password',
    name: 'reset-password',
    component: ResetPassword,
  },
  {
    path: '/app',
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'app',
        component: HomeView,
      },
      {
        path: 'configuration',
        name: 'configuration',
        component: ConfigurationView,
      },
      {
        path: 'registers',
        name: 'registers',
        component: () => import('@/views/registers/RegisterView.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// 🔹 Middleware para proteger rutas
router.beforeEach((to, from, next) => {
  const { isAuthenticated, checkSession } = useAuth()

  checkSession().then(() => {
    if (to.matched.some((record) => record.meta.requiresAuth) && !isAuthenticated.value) {
      next('/login')
    } else if ((to.path === '/login' || to.path === '/register') && isAuthenticated.value) {
      next('/app')
    } else {
      next()
    }
  })
})

export default router
