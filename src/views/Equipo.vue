<template>
  <v-container fluid>
    <v-layout row>
      <component-equipo @register-success="getEquipos" />
      <component-accesorio :id-equipo="selectedIdEquipo"
                           ref="componentsAccesorio"/> <!--@register-success="getEquipos"-->
      <v-text-field
              color="blue darken-4"
              background-color="blue lighten-5"
              class="pa-0"
              v-model="search"
              append-icon="search"
              label="Buscar..."
              single-line
              hide-details
      ></v-text-field>
    </v-layout>
    <v-data-table
            disable-initial-sort
            :headers="dataTable.headers"
            :items="dataTable.equipos"
            :search="search"
    >
      <!--class="elevation-1" elevacion de data table -->
      <template v-slot:items="props">
        <td>{{ props.item.descripcion }}</td>
        <td>
          <span v-if="props.item.tipo === 'e'">Equipo</span>
          <span v-if="props.item.tipo === 'o'">Otro</span>
        </td>
        <td>{{ props.item.codigo }}</td>
        <td>{{ props.item.modelo }}</td>
        <td>{{ props.item.nro_serie }}</td>
        <td>
          <span v-if="props.item.estado === 'b'">Bien</span>
          <span v-if="props.item.estado === 'r'">En reparación</span>
          <span v-if="props.item.estado === 'd'">De baja</span>
        </td>
        <td class="justify-center">
          <v-btn color="info"
                 @click="getAccesoriosEquipoById(props.item.id)"
                 flat
                 class="square"
                 title="Accesorios" >
            <v-icon>usb</v-icon>
          </v-btn>
        </td>
      </template>
      <v-alert v-slot:no-results :value="true" color="error" icon="warning">
        Your search for "{{ search }}" found no results.
      </v-alert>
    </v-data-table>
  </v-container>
</template>

<script>
  import ComponentEquipo from '../components/ComponentEquipo.vue'
  import axios from 'axios';
  import ComponentAccesorio from "../components/ComponentAccesorio.vue";
  export default {
    components: {
        ComponentAccesorio,
        ComponentEquipo
    },
    mounted(){
        this.$nextTick(()=>{
            this.getEquipos();
        })
    },
    data(){
        return {
            dataTable:{
                headers: [
                    {
                        text: 'Descripción',
                        align: 'left',
                        //sortable: false,
                        value: 'descripcion'
                    },
                    { text: 'Tipo', value: 'tipo' },
                    { text: 'Código', value: 'codigo' },
                    { text: 'Modelo', value: 'modelo' },
                    { text: 'Número de serie', value: 'nro_serie' },
                    { text: 'Estado', value: 'estado' },
                    { text: '', sortable: false,},
                ],
                equipos:[],
            },
            search:'',
            selectedIdEquipo:null,
        }
    },
    methods:{
        getEquipos:function () {
            axios.get(this.$urlApi.resourcesEquipo
            ).then( response => {
                this.dataTable.equipos = response.data;
            }).catch( errors => {
                console.log('error servidor')
            });
        },
        getAccesoriosEquipoById(idEquipo){
            this.selectedIdEquipo=idEquipo;
            this.$nextTick(()=>{
                this.$refs.componentsAccesorio.openDialog();
            });
        },
    }
  }
</script>
