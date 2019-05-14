import Vue from 'vue'
import Router from 'vue-router'
import Equipo from './views/Equipo.vue'
import Personal from './views/Personal.vue'
import ProEleRef from './views/ProEleRef'
// import Asignaciones from './views/Asignaciones'
Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    /*{
      path: '/',
      name: 'home',
      component: Home
    },*/
    {
      path: '/personal',
      name: 'personal',
      component: Personal
    },{
      path: '/equipos',
      name: 'equipos',
      component: Equipo
    }, {
      path: '/pro-ele-ref',
      name: 'pro-ele-ref',
      component: ProEleRef
    },{
      path: '/asignaciones',
      name: 'asignaciones',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "asignaciones" */'./views/Asignaciones.vue')
    }
  ]
})
