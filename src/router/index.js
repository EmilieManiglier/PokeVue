import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/pokemon/:id',
    name: 'pokemonDetail',
    props: true,
    component: () => import('@/views/PokemonDetail.vue')
  },  
  {
    path: '/location',
    name: 'location',
    component: () => import('@/views/Location.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
