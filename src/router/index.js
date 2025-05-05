import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/auth/LoginView.vue'
import SignView from '../views/auth/SignView.vue'
import LoginPage2 from '../views/auth/LoginPage2.vue'
import PostFeed from '../views/auth/PostFeed.vue'
import ProfileView from '../views/auth/ProfileView.vue'
const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/signup', name: 'Signup', component: SignView },
  { path: '/postfeed', name: 'PostFeed', component: PostFeed },
  { path: '/login2', name: 'Login2', component: LoginPage2 },
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

export default router
