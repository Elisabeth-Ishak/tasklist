import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/create',
      name: 'create',
      component: () => import('@/views/CreateView.vue'),
    },
    {
      path: '/detail/:id', 
      name: 'detail',
      component: () => import('@/views/DetailView.vue'),
      props: true // Erlaubt, dass die ID als Prop an die Komponente übergeben wird
    }, {
      path: '/create-person',
      name: 'create-person',
      component: () => import('@/views/CreatePersonView.vue'),
    },
    {
      path: '/person/:id',
      name: 'detail-person',
      component: () => import('@/views/DetailPersonView.vue'),
    }
  ],
})

export default router