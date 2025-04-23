import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/auth/LoginView.vue'
import SignView from '../views/auth/SignView.vue'
import LoginPage2 from '../views/auth/LoginPage2.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/signup', name: 'Signup', component: SignView },
  { path: '/login2', name: 'LoginPage2', component: LoginPage2 },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
