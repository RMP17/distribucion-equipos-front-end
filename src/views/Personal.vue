<!--fixme: Borrar cuando si no se necesita-->
<template>
  <v-container fluid>
    <v-layout row>
      <!--<component-equipo @register-success="getEquipos" />-->
      <component-tecnico @register-success="getPersonal"/>
      <component-notario @register-success="getPersonal"/>
      <component-user />
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
            :items="dataTable.personal"
            :search="search"
    >
      <!--class="elevation-1" elevacion de data table -->
      <template slot="headerCell" slot-scope="props" >
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
          <span v-on="on">
            {{ props.header.text }}
          </span>
          </template>
          <span>
            {{ props.header.title ? props.header.title:props.header.text }}
          </span>
        </v-tooltip>
      </template>
      <template v-slot:items="props">
        <td>{{ props.item.ci+' '+props.item.extension  }}</td>
        <td>{{ props.item.nombre }}</td>
        <td>{{ props.item.apellido1 }}</td>
        <td>{{ props.item.apellido2 }}</td>
        <td>{{ props.item.celular+' '+props.item.empresa_telefonica }}</td>
        <td>{{ props.item.profesion }}</td>
        <td>{{ props.item.tipo_personal }}</td>
        <template v-if="props.item.tipo_personal==='Notario'">
          <td>{{ props.item.notario.experiencia_procesos_anteriores ? 'SI':'NO'}}</td>
          <td>{{ props.item.notario.nro_estacion }}</td>
          <td>{{ props.item.notario.tipo_estacion }}</td>
        </template>
        <template v-else>
          <td></td>
          <td></td>
          <td></td>
        </template>
        <td class="justify-center">
          <v-btn color="info" v-if="props.item.tipo_personal.includes('Tecnico')"
                 @click="editTecnico(props.item)"
                 flat
                 class="square"
                 title="Editar Técnico" >
            <v-icon>edit</v-icon>
          </v-btn>
          <v-btn color="info" v-if="props.item.tipo_personal.includes('Notario')"
                 @click="editNotario(props.item)"
                 flat
                 class="square"
                 title="Editar Notario" >
            <v-icon>edit</v-icon>
          </v-btn>
          <!--<v-icon class="mr-2" @click="editItem(props.item)">
            edit
          </v-icon>-->
        </td>
      </template>
      <!--<v-alert v-slot:no-results :value="true" color="error" icon="warning">
        Your search for "{{ search }}" found no results.
      </v-alert>-->
    </v-data-table>

    <!--components para editar-->
    <component-tecnico :edit-data="selectedTecnico" ref="componentTecnico" mode-edit/>
    <component-notario :edit-data="selectedNotario" ref="componentNotario" mode-edit/>
  </v-container>
</template>

<script>
    import axios from 'axios';
    import ComponentTecnico from '@/components/ComponentTecnico.vue';
    import ComponentNotario from '@/components/ComponentNotario.vue';
    import ComponentUser from '../components/ComponentUser.vue';

    export default {

    components: {
      ComponentTecnico,
      ComponentNotario,
      ComponentUser
    },
    mounted(){
        this.$nextTick(()=>{
            this.getPersonal();
        })
    },
    data:()=>{
        return {

            dataTable:{
                headers: [
                    {
                        text: 'C.I.',
                        align: 'left',
                        title:'Cédula de identidad',
                        //sortable: false,
                        value: 'ci'
                    },
                    { text: 'Nombre', value: 'nombre' },
                    { text: 'Primer Apellido', value: 'apellido1' },
                    { text: 'Segundo Apellido', value: 'apellido2' },
                    { text: 'Celular', value: 'celular' },
                    { text: 'Profesión', value: 'profesion' },
                    { text: 'Tipo de Personal', value: 'tipo_personal' },
                    {
                        text: 'Exp. Pro. Ant.',
                        title:'Experiencia en procesos anteriores' ,
                        value: 'experiencia_procesos_anteriores'
                    },
                    { text: 'Nro de estacion', value: 'nro_estacion' },
                    { text: 'Tipo de estación', value: 'tipo_estacion' },
                    {
                        text: '',
                        sortable: false,
                    },
                ],
                personal:[],
            },
            selectedTecnico:null,
            selectedNotario:null,
            search:'',
        }
    },
    methods:{
        getPersonal:function () {
            axios.get(this.$urlApi.resourcesPersonal
            ).then( response => {
                let personal=response.data;
                personal.forEach(value => {
                    if (value.tecnico) {
                        value.tipo_personal = 'Tecnico, ';
                    } else {
                        value.tipo_personal = '';
                    }
                    if (value.notario) {
                        value.tipo_personal += 'Notario';
                    } else {
                        value.tipo_personal += '';
                    }
                });
                this.dataTable.personal=personal;
            }).catch( errors => {
                console.log('error servidor')
            });
        },
        editTecnico(tecnico){
          this.selectedTecnico=tecnico;
          this.$nextTick(()=>{
              this.$refs.componentTecnico.openDialog();
          });
        },
        editNotario(notario){
          this.selectedNotario=notario;
          this.$nextTick(()=>{
              this.$refs.componentNotario.openDialog();
          });
        }
    },
    computed:{

    }
  }
</script>
