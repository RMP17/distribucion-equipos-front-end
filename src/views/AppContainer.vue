<template>
    <v-content class="main-container">
        <v-toolbar extension-height="30px" flat height="100">
            <v-img
                    :src="LOGO"
                    class="pl-7 logo shrink mr-2"
                    contain
                    max-width="150px"
                    transition="scale-transition"
                    width="300px"
            />
            <v-toolbar-title>
                <span class="text-shadow">SISTEMA DE ASIGNACIÓN, CONTROL Y SEGUIMIENTO DE EQUIPOS BIOMÉTRICOS PARA EL PADRON ELECTORAL EN DIFERENTES  PROCESOS REALIZADOS POR EL SERVICIO DE REGISTRO CÍVICO SERECÍ CHUQUISACA.</span>
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <template v-slot:extension>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                    <!--<v-menu left offset-y>
                        <template v-slot:activator="{ on }">
                            <v-btn flat v-on="on">
                                Personal
                                <v-icon>arrow_drop_down</v-icon>
                            </v-btn>
                        </template>
                        <v-list>
                            <v-list-tile to="/tecnicos">
                                <v-list-tile-action>
                                    <v-icon>build</v-icon>
                                </v-list-tile-action>
                                <v-list-tile-content>
                                    Tecnicos
                                </v-list-tile-content>
                            </v-list-tile>

                            <v-list-tile to="/notarios">
                                <v-list-tile-action>
                                    <v-icon>peoples</v-icon>
                                </v-list-tile-action>
                                <v-list-tile-content>
                                    Notarios
                                </v-list-tile-content>
                            </v-list-tile>
                            <v-list-tile to="/coordinadores">
                                <v-list-tile-action>
                                    <v-icon>peoples</v-icon>
                                </v-list-tile-action>
                                <v-list-tile-content>
                                    Coordinadores
                                </v-list-tile-content>
                            </v-list-tile>
                        </v-list>
                    </v-menu>-->
                    <template v-if="user.nivel_acceso==0 || user.nivel_acceso==4">
                        <v-btn flat to="/inicio" dark small>
                            <v-icon>home</v-icon>
                            Inicio
                        </v-btn>
                        <v-btn flat to="/datos-complementarios" dark small>
                            <v-icon>settings</v-icon>
                            Configuraciones
                        </v-btn>
                        <v-btn flat to="/inventario" dark small>
                            <v-icon>laptop_windows</v-icon>
                            Inventario
                        </v-btn>
                        <v-btn flat to="/mantenimiento" dark small>
                            <v-icon>settings</v-icon>
                            Mantenimiento
                        </v-btn>
                        <v-btn flat to="/procesos-electorales" dark small>
                            <v-icon >how_to_vote</v-icon>
                            Procesos Electorales
                        </v-btn>
                        <v-btn flat to="/estaciones" dark small>
                            <v-icon >pin_drop</v-icon>
                            Estaciones
                        </v-btn>
                        <v-btn flat to="/pro-ele-ref" dark small>
                            <v-icon >all_inbox</v-icon>
                            Asignaciones
                        </v-btn>
                        <v-btn flat to="/usuarios" dark small>
                            <v-icon >people</v-icon>
                            Usuarios
                        </v-btn>
                        <v-btn flat to="/asignaciones" dark small>
                            <v-icon >book</v-icon>
                            Reportes
                        </v-btn>
                    </template>
                    <template v-if="user.nivel_acceso==1">
                        <v-btn flat to="/inicio" dark small>
                            <v-icon>home</v-icon>
                            Inicio
                        </v-btn>
                        <v-btn flat to="/inventario" dark small>
                            <v-icon>laptop_windows</v-icon>
                            Inventario
                        </v-btn>
                        <v-btn flat to="/pro-ele-ref" dark small>
                            <v-icon >all_inbox</v-icon>
                            Asignaciones
                        </v-btn>
                    </template>
                    <template v-if="user.nivel_acceso==2">
                        <v-btn flat to="/inicio" dark small>
                            <v-icon>home</v-icon>
                            Inicio
                        </v-btn>
                        <v-btn flat to="/usuarios/notarios" dark small>
                            <v-icon >people</v-icon>
                            Usuarios
                        </v-btn>
                    </template>
                    <!--<v-btn to="/" flat>
                      <v-icon left>laptop_windows</v-icon>
                      Equipos
                    </v-btn>-->
                    <!--<v-btn flat>Link Two</v-btn>
                    <v-btn flat>Link Three</v-btn>-->
                </v-toolbar-items>
                <v-spacer></v-spacer>
            </template>
            <!--            todo: quitar si se usa el nuevo menu-->
            <!--<v-spacer></v-spacer>
            <v-toolbar-items>
                <v-menu left offset-y>
                    <template v-slot:activator="{ on }">
                        <v-btn flat v-on="on">
                            Personal
                            <v-icon>arrow_drop_down</v-icon>
                        </v-btn>
                    </template>
                    <v-list>
                        <v-list-tile active-class="active-custom" to="/tecnicos">
                            <v-list-tile-action>
                                <v-icon>build</v-icon>
                            </v-list-tile-action>
                            <v-list-tile-content>
                                Tecnicos
                            </v-list-tile-content>
                        </v-list-tile>

                        <v-list-tile active-class="active-custom" to="/notarios">
                            <v-list-tile-action>
                                <v-icon>peoples</v-icon>
                            </v-list-tile-action>
                            <v-list-tile-content>
                                Notarios
                            </v-list-tile-content>
                        </v-list-tile>
                        <v-list-tile active-class="active-custom" to="/coordinadores">
                            <v-list-tile-action>
                                <v-icon>peoples</v-icon>
                            </v-list-tile-action>
                            <v-list-tile-content>
                                Coordinadores
                            </v-list-tile-content>
                        </v-list-tile>
                    </v-list>
                </v-menu>

                &lt;!&ndash;<v-btn flat to="/personal">
                    <v-icon left>people</v-icon>
                    Personal
                </v-btn>&ndash;&gt;
                <v-btn flat to="/equipos">
                    <v-icon left>laptop_windows</v-icon>
                    Dispositivos
                </v-btn>
                <v-btn flat to="/procesos-electorales" active-class="active-custom" >
                    <v-icon left>how_to_vote</v-icon>
                    Procesos Electorales
                </v-btn>
                <v-btn flat to="/estaciones" active-class="active-custom" >
                    <v-icon left>pin_drop</v-icon>
                    Estaciones
                </v-btn>
                <v-btn flat title="Proceso Electoral o Referendo" to="/pro-ele-ref" active-class="active-custom" >
                    <v-icon left>all_inbox</v-icon>
                    Inventario
                </v-btn>
                <v-btn flat to="/asignaciones">
                    <v-icon left>book</v-icon>
                    Resumen
                </v-btn>
                <v-menu bottom nudge-bottom="10" offset-y v-if="user">
                    <template v-slot:activator="{ on }">
                        <v-btn color="indigo" dark
                               icon
                               small
                               v-on="on"
                        >
                            <span class="headline" style="line-height: initial !important;">{{user.usuario | extractFirstLetter}}</span>
                        </v-btn>
                    </template>
                    <v-list>
                        <v-list-tile active-class="active-custom" to="/datos-complementarios">
                            <v-list-tile-content>
                                <v-list-tile-title>Datos Complementarios</v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                        <v-list-tile @click="logout">
                            <v-list-tile-content>
                                <v-list-tile-title>Cerrar Sesión</v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </v-list>
                </v-menu>
                &lt;!&ndash;<v-btn to="/" flat>
                  <v-icon left>laptop_windows</v-icon>
                  Equipos
                </v-btn>&ndash;&gt;
                &lt;!&ndash;<v-btn flat>Link Two</v-btn>
                <v-btn flat>Link Three</v-btn>&ndash;&gt;
            </v-toolbar-items>-->
        </v-toolbar>
        <v-layout row justify-end style="height: 30px">
            <v-menu bottom nudge-bottom="10" offset-y v-if="user" right>
                <template v-slot:activator="{ on }">
                    <v-btn flat v-on="on" small>
                        <!--                                USUARIO:{{ user.nombre_completo}}-->
                        USUARIO:{{user.nombre}}
                        <v-icon>arrow_drop_down</v-icon>
                    </v-btn>
                </template>
                <v-list>
                    <!--<v-list-tile to="/datos-complementarios">
                        <v-list-tile-content>
                            <v-list-tile-title>Datos Complementarios</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>-->
                    <v-list-tile @click="logout">
                        <v-list-tile-content>
                            <v-list-tile-title>Cerrar Sesión</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                </v-list>
            </v-menu>
        </v-layout>
        <MenuContainer>
            <transition mode="out-in" name="fade">
                    <router-view/>
            </transition>
        </MenuContainer>
    </v-content>
</template>
<script>

    import {mapMutations, mapState} from 'vuex';
    import MenuContainer from './Menu/MenuContainer';
    import LOGO from '../assets/sereci.png';

    export default {
        name: 'AppContainer',
        components: {
            MenuContainer
        },
        data() {
            return {
                LOGO,
                admins: [
                    ['Management', 'people_outline'],
                    ['Settings', 'settings']
                ],
                cruds: [
                    ['Create', 'add'],
                    ['Read', 'insert_drive_file'],
                    ['Update', 'update'],
                    ['Delete', 'delete']
                ]
            }
        },
        methods: {
            ...mapMutations(['storeAuthData']),
            logout() {
                this.$http.get(this.$urlApi.logout
                ).then(response => {
                    let data = {
                        user: null,
                        token: null,
                    };
                    this.storeAuthData(data);
                    this.$router.replace('/login');
                }, err => {
                    if (err.response.status === 401) {
                        let data = {
                            user: null,
                            token: null,
                        };
                        this.storeAuthData(data);
                        // this.$router.replace('/login');
                        this.$router.replace('/login');
                    } else {
                        console.log('errror logout');
                    }
                });
            }
        },
        computed: {
            ...mapState(['user'])
        },
        mounted() {
            console.log(this.user)
        }
    }
</script>
<style scoped>
    .fade-enter-active, .fade-leave-active {
        transition: opacity .2s ease-in;
    }

    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
    {
        opacity: 0;
    }

    .v-toolbar__title {
        white-space: normal;
        text-align: center;
    }

    .v-toolbar {
        background: url('../assets/toolbar.jpg') no-repeat center -550px fixed;
        background-size: cover;
        color: white;
    }

    .main-container {
        background: #e6e6e6;
    }

    .text-shadow {
        text-shadow: 2px 0 0 #000, -2px 0 0 #000, 0 2px 0 #000, 0 -2px 0 #000, 1px 1px #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000;
    }
    .v-btn{
        padding: 0 5px;
    }
    /*.silver{
        background-color: #d5d8e2;
    }
    a{
        text-decoration: none;
    }
    .border-menu{
        border: 1px solid lightgrey;
        border-radius: 5px;
    }*/
</style>
