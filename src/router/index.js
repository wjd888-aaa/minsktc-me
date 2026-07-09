import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/items', name: 'Items', component: () => import('../views/Items.vue') },
  { path: '/items/:id', name: 'ItemDetail', component: () => import('../views/ItemDetail.vue') },
  { path: '/publish', name: 'Publish', component: () => import('../views/Publish.vue') },
  { path: '/login', name: 'Login', component: () => import('../views/Login.vue') }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
