// Composables
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/components/PaginaPrincipal.vue'),
  },
  {
    path: '/gestiocomandes',
    component: () => import('@/components/GestioComandes.vue'),
  },
  {
    path: '/gestioproductes',
    component: () => import('@/components/GestioProductes.vue'),
  },
  {
    path: '/gestioestadistiques',
    component: () => import('@/components/gestioEstadistiques.vue'),
  }   
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
