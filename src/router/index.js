import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/auth/LoginView.vue'
import SignView from '../views/auth/SignView.vue'
import LoginPage2 from '../views/auth/LoginPage2.vue'
import PostFeed from '../views/auth/PostFeed.vue'
import ProfileView from '../views/auth/ProfileView.vue'
import AdminDashboard from '../views/auth/AdminDashboard.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/signup', name: 'Signup', component: SignView },
  { path: '/login2', name: 'Login2', component: LoginPage2 },
  { path: '/postfeed', name: 'PostFeed', component: PostFeed, meta: { requiresAuth: true } },
  { path: '/admin', name: 'Admin', component: AdminDashboard, meta: { requiresAuth: true } },
  {
    path: '/profile',
    name: 'profile',
    component: ProfileView,
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Navigation Guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('user') // Adjust based on your auth method

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router
