<template>
  <div>
    <h4 class="pa-2" style="border-bottom:5px solid skyblue">
      {{$route.meta.subname}}
    </h4>
    <v-container class="min-height">
      <v-layout>
        <v-flex xs6 offset-xs3>
          <ProcesosElectoralesReferendoComponent/>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
  import axios from 'axios';
  import ProcesosElectoralesReferendoComponent from '../../components/nc/ProcesosElectoralesReferendoComponent'
  export default {
    components: {
      ProcesosElectoralesReferendoComponent
    },
    data:()=>({

    }),
    methods:{
    },
    computed: {

    }
  }
</script>
<style scoped>
  .min-height{
    min-height: 50rem;
  }
</style>
