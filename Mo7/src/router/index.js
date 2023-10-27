// Composables
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/gestiocomandes',
    component: () => import('@/components/PaginaPrincipal.vue'),
  },
  {
    path: '/gestioproductes',
    component: () => import('@/components/GestioProductes.vue'),
  }  
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
