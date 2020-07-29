<template>
  <div>
    <h4 class="pa-2" style="border-bottom:5px solid skyblue">
      {{$route.meta.subname}}
    </h4>
    <v-container class="min-height">
      <EquipoFormComponent/>
    </v-container>
  </div>
</template>

<script>
  import axios from 'axios';
  import EquipoFormComponent from '../../components/nc/EquipoFormComponent'
  export default {
    components: {
      EquipoFormComponent
    },
    mounted(){
        this.$nextTick(()=>{
            this.getTiposEquipos();
        })
    },
    data:()=>({

    }),
    methods:{
        getTiposEquipos:function () {
            axios.get(this.$urlApi.resourcesTiposEquipos
            ).then( response => {
                this.tiposEquipos = response.data;
              this.tiposEquipos.unshift({id:'',nombre:'Todos'})
            }).catch( errors => {
                console.log('error servidor')
            });
        },
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
