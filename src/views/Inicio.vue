<template>
    <div>
        <h4 class="pa-2" style="border-bottom:5px solid skyblue">INICIO</h4>
        <v-container fluid>
            <v-layout column align-center>
                <b class="" v-if="user">BIENVENIDO {{user.nombre.toUpperCase()}}</b>
                <br>
                <br>
                <span class="text-shadow title">
                    SISTEMA DE ASIGNACIÓN,
                    CONTROL Y SEGUIMIENTO DE EQUIPOS BIOMÉTRICOS PARA EL PADRON ELECTORAL MASIVO
                    EN DIFERENTES  PROCESOS REALIZADOS POR EL SERVICIO DE REGISTRO CÍVICO SERECÍ CHUQUISACA.
                </span>
                <v-img
                        :src="LOGO"
                        class="pl-7 logo shrink mr-2"
                        contain
                        max-width="300px"
                        transition="scale-transition"
                        width="300px"
                />
                <br>
                <br>
                <br>
<!--                <span class="text-shadow title">POR: CINTHIA</span>-->
            </v-layout>
        </v-container>
    </div>
</template>

<script>
    import LOGO from '../assets/sereci.png';
    import {mapState} from 'vuex';
    export default {
        name:'Inicio',
        components: {
        },
        mounted() {

        },
        data: () => {
            return {
                LOGO
            }
        },
        methods: {

        },
        computed: {
            ...mapState(['user'])
        }
    }
</script>
<style scoped>
    .title {
        white-space: normal;
        text-align: center;
        line-height: 1.5em !important;
        color: white;
    }

    .text-shadow {
        text-shadow: 2px 0 0 #ed7145,
        -2px 0 0 #ed7145,
        0 2px 0 #ed7145,
        0 -2px 0 #ed7145,
        1px 1px #ed7145,
        -1px -1px 0 #ed7145,
        1px -1px 0 #ed7145,
        -1px 1px 0 #ed7145;

    }
</style>
