<template>
    <v-container fluid grid-list-md pa-2>
        <v-layout row justify-center>
            <v-flex xs2  v-if="$route.name!=='Inicio'">
                <v-card class="silver" elevation="0" >
                    <h4 class="pa-2" style="border-bottom:5px solid skyblue">{{$route.name}}</h4>
                    <div class="pa-3 white">
                        <div class="border-menu">
                            <template v-if="$route.path.includes('/usuarios')">
                                <div v-for="usuario of usuarios" :key="usuario.text">
                                    <div class="ma-2">
                                        <router-link  class="blue--text" :to="usuario.to">{{usuario.text}}</router-link>
                                    </div>
                                    <v-divider/>
                                </div>
                            </template>
                            <template v-else-if="$route.path.includes('/inventario')">
                                <div v-for="value of inventario" :key="value.text">
                                    <div class="ma-2">
                                        <router-link  class="blue--text" :to="value.to">{{value.text}}</router-link>
                                    </div>
                                    <v-divider/>
                                </div>
                            </template>
                            <template v-else-if="$route.path.includes('/mantenimiento')">
                                <div v-for="value of mantenimiento" :key="value.text">
                                    <div class="ma-2">
                                        <router-link  class="blue--text" :to="value.to">{{value.text}}</router-link>
                                    </div>
                                    <v-divider/>
                                </div>
                            </template>
                            <template v-else-if="$route.path.includes('/procesos-electorales')">
                                <div v-for="procesos of procesosElectorales" :key="procesos.text">
                                    <div class="ma-2">
                                        <router-link  class="blue--text" :to="procesos.to">{{procesos.text}}</router-link>
                                    </div>
                                    <v-divider/>
                                </div>
                            </template>
                            <template v-else-if="$route.path.includes('/estaciones')">
                                <div v-for="estacion of estaciones" :key="estacion.text">
                                    <div class="ma-2">
                                        <router-link  class="blue--text" :to="estacion.to">{{estacion.text}}</router-link>
                                    </div>
                                    <v-divider/>
                                </div>
                            </template>
                            <template v-else-if="$route.path.includes('/asignaciones')">
                                <div v-for="value of resumen" :key="value.text">
                                    <div class="ma-2">
                                        <router-link  class="blue--text" :to="value.to">{{value.text}}</router-link>
                                    </div>
                                    <v-divider/>
                                </div>
                            </template>
                            <template v-else-if="$route.path.includes('/pro-ele-ref')">
                                <div v-for="value of asignaciones" :key="value.text">
                                    <div class="ma-2">
                                        <router-link  class="blue--text" :to="value.to">{{value.text}}</router-link>
                                    </div>
                                    <v-divider/>
                                </div>
                            </template>
                            <template v-else-if="$route.path.includes('/datos-complementarios')">
                                <div v-for="value of datosComplementarios" :key="value.text">
                                    <div class="ma-2">
                                        <router-link  class="blue--text" :to="value.to">{{value.text}}</router-link>
                                    </div>
                                    <v-divider/>
                                </div>
                            </template>
                        </div>
                    </div>
                </v-card>
            </v-flex>
            <v-flex xs10>
                <v-card color="white" elevation="0">
                    <!--<v-card-text class="px-0">12</v-card-text>-->
                    <slot></slot>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>
<script>

    export default {
        name: 'AppContainer',
        data() {
            return {
                usuarios: [
                    {
                        text: 'Usuarios',
                        to: '/usuarios/lista',
                    },{
                        text: 'Tecnicos',
                        to: '/usuarios/tecnicos',
                    },{
                        text: 'Notarios',
                        to: '/usuarios/notarios',
                    },{
                        text: 'Coordinadores',
                        to: '/usuarios/coordinadores',
                    },
                ],
                inventario: [
                    {
                        text: 'Registrar Dispositivos',
                        to: '/inventario/dispositivos/registrar',
                    },{
                        text: 'Lista de Dispositivos',
                        to: '/inventario/dispositivos',
                    },{
                        text: 'Dispositivos asignados',
                        to: '/inventario/dispositivos/asignados',
                    },{
                        text: 'Dispositivos disponibles',
                        to: '/inventario/dispositivos/disponibles',
                    },{
                        text: 'Dispositivos en Reparacion',
                        to: '/inventario/dispositivos/reparacion',
                    }
                ],
                procesosElectorales: [
                    {
                        text: 'Registrar Procesos Electorales',
                        to: '/procesos-electorales/registrar',
                    },{
                        text: 'Lista Procesos Electorales',
                        to: '/procesos-electorales/lista',
                    }
                ],
                estaciones: [
                    {
                        text: 'Estaciones',
                        to: '/estaciones/lista',
                    }
                ],
                resumen: [
                    {
                        text: 'Resumen',
                        to: '/asignaciones/lista',
                    }
                ],
                asignaciones: [
                    {
                        text: 'Asignaciones',
                        to: '/pro-ele-ref/lista',
                    }
                ],
                datosComplementarios: [
                    {
                        text: 'Profesiones',
                        to: '/datos-complementarios/profesiones',
                    },{
                        text: 'Puntos de Empadronamiento',
                        to: '/datos-complementarios/puntos-empadronamiento',
                    },{
                        text: 'Marcas',
                        to: '/datos-complementarios/marcas',
                    },{
                        text: 'Tipos de Dispositivos',
                        to: '/datos-complementarios/tipos-dispositivos',
                    },{
                        text: 'Modelos',
                        to: '/datos-complementarios/modelos',
                    },{
                        text: 'Accesorios',
                        to: '/datos-complementarios/accesorios',
                    }
                ],
                mantenimiento: [
                    {
                        text: 'Enviar a Mantenimiento',
                        to: '/mantenimiento/dispositivos',
                    },{
                        text: 'Dispositivos en Mantenimiento',
                        to: '/mantenimiento/lista',
                    },{
                        text: 'Mantenimientos realizados',
                        to: '/mantenimiento/realizados',
                    }
                ]
            }
        },
        methods: {},
        computed: {},
        mounted() {
            console.log(this.$route);
        }
    }
</script>
<style scoped>
    .silver {
        background-color: #d5d8e2;
    }

    a {
        text-decoration: none;
    }

    .border-menu {
        border: 1px solid lightgrey;
        border-radius: 5px;
    }
</style>
