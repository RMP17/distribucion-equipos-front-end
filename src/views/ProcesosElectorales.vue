<template>
    <div>
        <h4 class="pa-2" style="border-bottom:5px solid skyblue">{{$route.meta.subname}}</h4>
        <v-container fluid>
            <component-p-e-r v-if="this.$store.state.user.nivel_acceso===0"/>
        </v-container>
    </div>
</template>

<script>
    import ComponentPER from '../components/ComponentProcesosElectoralesReferendo.vue';

    export default {
        components: {
            ComponentPER
        },
        data:()=>{
            return {}
        },
        methods:{

        },
        computed:{

        }
    }
</script>
