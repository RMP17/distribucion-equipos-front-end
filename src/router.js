import Vue from 'vue'
import Router from 'vue-router'
import Equipo from './views/Equipo.vue'
import ProEleRef from './views/ProEleRef'
import Login from './components/ComponentLogin.vue'
import AppContainer from './views/AppContainer.vue'
import store from './store';
import Tecnicos from "./views/personal/Tecnicos";
import Notarios from "./views/personal/Notarios";
import Coordinadores from "./views/personal/Coordinadores";
import ProcesosElectorales from "./views/ProcesosElectorales";
import Estaciones from "./views/Estaciones";
import UserComponent from "./components/UserComponent";
import Profesiones from "./views/DatosComplementarios/Profesiones";
import PuntosEmpadronamiento from "./views/DatosComplementarios/PuntosEmpadronamiento";
import Marcas from "./views/DatosComplementarios/Marcas";
import TiposEquipos from "./views/DatosComplementarios/TiposEquipos";
import Modelos from "./views/DatosComplementarios/Modelos";
import Accesorios from "./views/DatosComplementarios/Accesorios";
import Inicio from "./views/Inicio";
import RegistrarDispositvos from "./views/Inventario/RegistrarDispositvos";
import RegistrarProcesos from "./views/procesos/RegistrarProcesos";

// import Asignaciones from './views/Asignaciones'
Vue.use(Router)

const tecnicos = [
    '/inventario',
    '/inventario/dispositivos',
    '/inventario/dispositivos/asignados',
    '/inventario/dispositivos/disponibles',
    '/pro-ele-ref',
    '/pro-ele-ref/lista',
    '/mantenimiento',
    '/mantenimiento/lista',
]
const coordinadores = ['/usuarios/notarios']
const onlyAdmin = (to, from, next) => {
    const currentUser = store.state.user;
    if (currentUser.nivel_acceso == 0 || currentUser.nivel_acceso == 4) {
        next();
    } else if(currentUser.nivel_acceso == 1 && tecnicos.includes(to.path)) {
      next();
    } else if(currentUser.nivel_acceso == 2 && coordinadores.includes(to.path)) {
      next();
    } else {
        alert('Acceso denegado');
    }
};

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: '',
            component: AppContainer,
            meta: {
                requiresAuth: true
            },
            children: [
                {path: '/', redirect: '/inicio'},
                {
                    path: '/inicio',
                    name: 'Inicio',
                    component: Inicio,
                },{
                    path: '/datos-complementarios',
                    name: 'Configuraciones',
                    redirect: '/datos-complementarios/profesiones',
                    beforeEnter: onlyAdmin
                },{
                    path: '/datos-complementarios/profesiones',
                    name: 'Configuraciones',
                    meta:{subname: 'Profesiones'},
                    component: Profesiones,
                    beforeEnter: onlyAdmin
                },
                {
                    path: '/datos-complementarios/puntos-empadronamiento',
                    name: 'Configuraciones',
                    meta:{subname: 'Puntos de Empadronamiento'},
                    component: PuntosEmpadronamiento,
                    beforeEnter: onlyAdmin
                },{
                    path: '/datos-complementarios/marcas',
                    name: 'Configuraciones',
                    meta:{subname: 'Marcas'},
                    component: Marcas,
                    beforeEnter: onlyAdmin
                },{
                    path: '/datos-complementarios/tipos-dispositivos',
                    name: 'Configuraciones',
                    meta:{subname: 'Tipos de Dispositivos'},
                    component: TiposEquipos,
                    beforeEnter: onlyAdmin
                }, {
                    path: '/datos-complementarios/modelos',
                    name: 'Configuraciones',
                    meta:{subname: 'Modelos'},
                    component: Modelos,
                    beforeEnter: onlyAdmin
                }, {
                    path: '/datos-complementarios/accesorios',
                    name: 'Configuraciones',
                    meta:{subname: 'Accesorios'},
                    component: Accesorios,
                    beforeEnter: onlyAdmin
                },


                {path: '/usuarios', name: 'Usuarios', redirect: '/usuarios/lista'},
                {
                    path: '/usuarios/lista',
                    name:'Usuarios' ,
                    meta:{subname: 'Usuarios'},
                    component: UserComponent,
                    beforeEnter: onlyAdmin
                },{
                    path: '/usuarios/tecnicos',
                    name:'Usuarios' ,
                    meta:{subname: 'Tecnicos'},
                    component: Tecnicos,
                    beforeEnter: onlyAdmin
                },{
                    path: '/usuarios/notarios',
                    name:'Usuarios' ,
                    meta:{subname: 'Notarios'},
                    component: Notarios,
                    beforeEnter: onlyAdmin
                },{
                    path: '/usuarios/coordinadores',
                    name:'Usuarios' ,
                    meta:{subname: 'Coordinadores'},
                    component: Coordinadores,
                    beforeEnter: onlyAdmin
                },

                // {path: '/tecnicos', name: 'Tecnicos', component: Tecnicos, beforeEnter: onlyAdmin},
                // {path: '/notarios', name: 'Notarios', component: Notarios, beforeEnter: onlyAdmin},
                // {path: '/coordinadores', name: 'Coordinadores', component: Coordinadores, beforeEnter: onlyAdmin},
                // { path: '/personal', name: 'personal', component: Personal, beforeEnter: onlyAdmin},
                {path: '/inventario', name: 'Inventario', redirect: '/inventario/dispositivos/registrar', /*beforeEnter: onlyAdmin*/},
                {
                    path: '/inventario/dispositivos/registrar',
                    name: 'Inventario',
                    meta:{subname: 'Registrar Dispositivos'},
                    component: RegistrarDispositvos,
                    beforeEnter: onlyAdmin
                },{
                    path: '/inventario/dispositivos',
                    name: 'Inventario',
                    meta:{subname: 'Lista de Dispositivos'},
                    component: Equipo,
                    beforeEnter: onlyAdmin
                },{
                    path: '/inventario/dispositivos/:filter',
                    name: 'Inventario',
                    meta:{subname: 'Dispositivos'},
                    component: Equipo,
                    beforeEnter: onlyAdmin
                },

                {
                    path: '/procesos-electorales',
                    name: 'Procesos Electorales',
                    redirect: '/procesos-electorales/registrar',
                    beforeEnter: onlyAdmin
                },{
                    path: '/procesos-electorales/registrar',
                    name: 'Procesos Electorales',
                    meta:{subname: 'Registrar Procesos Electorales'},
                    component: RegistrarProcesos,
                    beforeEnter: onlyAdmin
                    // beforeEnter: onlyAdmin
                },,{
                    path: '/procesos-electorales/lista',
                    name: 'Procesos Electorales',
                    meta:{subname: 'Lista Procesos Electorales'},
                    component: ProcesosElectorales,
                    beforeEnter: onlyAdmin
                    // beforeEnter: onlyAdmin
                },{
                    path: '/estaciones',
                    name: 'Estaciones',
                    redirect: '/estaciones/lista',
                    beforeEnter: onlyAdmin
                }, {
                    path: '/estaciones/lista',
                    name: 'Estaciones',
                    meta:{subname: 'Estaciones'},
                    component: Estaciones,
                    beforeEnter: onlyAdmin
                },

                {
                    path: '/pro-ele-ref',
                    name: 'Asignaciones',
                    redirect: '/pro-ele-ref/lista',
                    beforeEnter: onlyAdmin
                },{
                    path: '/pro-ele-ref/lista',
                    name: 'Asignaciones',
                    meta:{subname: 'Asignaciones'},
                    component: ProEleRef,
                    beforeEnter: onlyAdmin
                },


                {
                    path: '/asignaciones',
                    name: 'Reportes',
                    redirect:'/asignaciones/lista',
                    beforeEnter: onlyAdmin
                },{
                    path: '/asignaciones/lista',
                    name: 'Reportes',
                    meta:{subname: 'Reportes'},
                    component: () => import(/* webpackChunkName: "asignaciones" */'./views/Asignaciones.vue'),
                   beforeEnter: onlyAdmin
                },

                {
                    path: '/mantenimiento',
                    name: 'Mantenimiento',
                    redirect:'/mantenimiento/dispositivos',
                    beforeEnter: onlyAdmin
                }, {
                    path: '/mantenimiento/dispositivos',
                    name: 'Mantenimiento',
                    meta:{subname: 'Enviar a Mantenimiento'},
                    component: () => import(/* webpackChunkName: "asignaciones" */'./views/Mantenimiento.vue'),
                    beforeEnter: onlyAdmin
                }, {
                    path: '/mantenimiento/lista',
                    name: 'Mantenimiento',
                    meta:{subname: 'Dispositivos en Mantenimiento'},
                    component: () => import('./views/Mantenimiento/EquiposMantenimiento.vue'),
                    beforeEnter: onlyAdmin
                }, {
                    path: '/mantenimiento/realizados',
                    name: 'Mantenimiento',
                    meta:{subname: 'Mantenimientos realizados'},
                    component: () => import('./views/Mantenimiento/EquiposMantenimientoRealizados.vue'),
                    beforeEnter: onlyAdmin
                }
            ],
        },
        {
            path: '/login',
            name: 'login',
            component: Login,
            meta: {
                isLogin: true
            },
        }
    ]
})

router.beforeEach((to, from, next) => {
    const currentUser = store.state.user;
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    const isLogin = to.matched.some(record => record.meta.isLogin);
    if (requiresAuth && !currentUser) next('login');
    else if (isLogin && currentUser){
      if (currentUser.nivel_acceso===2){
        next('/inicio');
      }else{
        next('/inicio');
      }
    }
    else next();
});
export default router;
