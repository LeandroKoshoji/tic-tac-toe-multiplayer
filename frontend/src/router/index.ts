import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView/HomeView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/local-game',
    name: 'localGame',
    component: () => import('../views/BoardView/LocalBoardView.vue/LocalBoardView.vue')
  },
  {
    path: '/online-game/:id',
    name: 'onlineGame',
    component: () => import('../views/BoardView/OnlineBoardView/OnlineBoardView.vue')
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
