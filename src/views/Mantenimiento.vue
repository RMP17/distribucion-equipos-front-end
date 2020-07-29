<template>
  <div>
    <h4 class="pa-2" style="border-bottom:5px solid skyblue">{{$route.meta.subname}} {{$route.params.filter}} </h4>
    <v-container fluid>
      <!--<v-layout row>
        <v-flex xs6 pa-0>
          <v-text-field
                  color="blue darken-4 w-100 flex"
                  background-color="blue lighten-5"
                  class="pa-0"
                  v-model="search"
                  append-icon="search"
                  label="Buscar..."
                  single-line
                  hide-details
          ></v-text-field>
        </v-flex>
        <v-select :items="filtroEstados"
                  v-model="filters.estado"
                  hide-details
                  class="pa-0 px-2"
                  color="blue darken-4"
                  background-color="blue lighten-5"
                  item-text="state"
                  item-value="abbr"
                  label="Filtrar por estado"
                  title="Filtrar por estado"
        ></v-select>
        <v-select :items="tiposEquipos"
                  v-model="filters.tipoEquipo"
                  hide-details
                  class="pa-0"
                  color="blue darken-4"
                  background-color="blue lighten-5"
                  item-text="nombre"
                  item-value="id"
                  label="Filtrar por tipo de dispositivo"
                  title="Filtrar por tipo de dispositivo"
        ></v-select>
      </v-layout>
      <span>Total dispositivos: {{equiposFiltrado.length}}</span>
      <v-data-table
              disable-initial-sort
              :headers="dataTable.headers"
              :items="equiposFiltrado"
              :search="search"
      >
        &lt;!&ndash;class="elevation-1" elevacion de data table &ndash;&gt;
        <template v-slot:items="props">
          <td>{{ props.item.tipo_equipo? props.item.tipo_equipo.nombre:'' }}</td>
          <td>{{ props.item.marca?  props.item.marca.nombre:'' }}</td>
          <td>{{ props.item.modelo?  props.item.modelo.nombre:'' }}</td>
          &lt;!&ndash;<td>
            <span v-if="props.item.tipo === 'e'">Equipo</span>
            <span v-if="props.item.tipo === 'o'">Otro</span>
          </td>&ndash;&gt;
          <td>{{ props.item.codigo_activo }}</td>
          <td>{{ props.item.nro_serie }}</td>
&lt;!&ndash;          <td>{{ props.item.service_tag }}</td>&ndash;&gt;
&lt;!&ndash;          <td>{{ props.item.condicion }} - {{ props.item.origen }}</td>&ndash;&gt;
&lt;!&ndash;          <td>{{ props.item.origen }}</td>&ndash;&gt;
          &lt;!&ndash;<td>{{ props.item.descripcion }}</td>
          <td>{{ props.item.observaciones }}</td>&ndash;&gt;
          <td>
            &lt;!&ndash;<v-select :items="estados"
                      v-model="props.item.estado"
                      @change="changeEstadoEquipo(props.item)"
                      flat
                      hide-details
                      dense
                      color="blue darken-4"
                      background-color="blue lighten-5"
                      item-text="state"
                      item-value="abbr"
                      label="Estado"
                      single-line
                      solo
            ></v-select>&ndash;&gt;
            <span v-if="props.item.estado === 'b'">Bueno</span>
            <span v-if="props.item.estado === 'r'">En Reparación</span>
            <span v-if="props.item.estado === 'd'">Dañado</span>
          </td>
          <td>
            <v-btn @click="enviarMantenimiento(props.item)"
                   class="white&#45;&#45;text" color="info"
                   depressed
                   round
                   small
            >
              <v-icon>build</v-icon>
              Enviar a mantenimiento
            </v-btn>
          </td>
        </template>
        <v-alert v-slot:no-results :value="true" color="error" icon="warning">
          Your search for "{{ search }}" found no results.
        </v-alert>
      </v-data-table>-->
      <v-layout>
        <v-flex xs6 offset-xs3>
          <MantenimientoFormComponent/>
        </v-flex>
      </v-layout>
    </v-container>
<!--    <MantenimientoComponent :data="selected" :equipo="selected" ref="componentEnviarMantenimiento"/>-->
    <!--<PrintEquipoComponent
            :title="tituloInforme"
            :print-data="equiposFiltrado"
            :headers="dataTable.headers"
            ref="printEquipos"  />-->
  </div>
</template>

<script>
  import PrintEquipoComponent from '../components/PrintEquipoComponent'
  import axios from 'axios';
  import MantenimientoComponent from "../components/MantenimientoComponent";
  import MantenimientoFormComponent from "../components/nc/MantenimientoFormComponent";
  export default {
    components: {
      PrintEquipoComponent,
      // MantenimientoComponent,
      MantenimientoFormComponent
    },
    watch: {
      '$route' (to, from) {
        this.getEquipos(this.cargarPaginaConFiltro)
      }
    },
    mounted(){
        this.$nextTick(()=>{
          this.getEquipos(this.cargarPaginaConFiltro);
            this.getTiposEquipos();
        })
    },
    data(){
        return {
            dataTable:{
                headers: [
                    {
                        text: 'Tipo de equipo',
                        align: 'left',
                        //sortable: false,
                        value: 'tipo_equipo.nombre'
                    },
                    { text: 'Marca', value: 'marca.nombre' },
                    { text: 'Modelo', value: 'modelo.nombre' },
                    // { text: 'Tipo', value: 'tipo' },
                    { text: 'Código de activo', value: 'codigo_activo' },
                    { text: 'Número de serie', value: 'nro_serie' },
                    // { text: 'Service tag', value: 'service_tag' },
                    // { text: 'Condicion-Origen', value: 'condicion' },
                    /*{ text: 'Descripcion', value: 'descripcion' },
                    { text: 'Observaciones', value: 'observaciones' },*/
                    { text: 'Estado', value: 'estado' },
                    { text: 'Acciones', value: '', sortable: false},
                ],
                equipos:[],
            },
            search:'',
            tituloInforme:'',
            selectedIdEquipo:null,
          estados: [
            {state: 'Bueno', abbr: 'b'},
            {state: 'Dañado', abbr: 'd'},
            {state: 'En Reparación', abbr: 'r'},
          ],
          filtroEstados: [
            {state: 'Todos', abbr: ''},
            {state: 'Solo Buenos', abbr: 'b'},
            {state: 'Solo Dañados', abbr: 'd'},
            {state: 'Solo en Reparación', abbr: 'r'},
          ],
          tiposEquipos: [],
          filters:{
              estado:null,
              tipoEquipo:null
          },
          selected: null,
        }
    },
    methods:{
        getEquipos:function (params='') {
            axios.get(this.$urlApi.resourcesEquipo+'?filter='+params
            ).then( response => {
                this.dataTable.equipos = response.data;
            }).catch( errors => {
                console.log('error servidor')
            });
        },
        getTiposEquipos:function () {
            axios.get(this.$urlApi.resourcesTiposEquipos
            ).then( response => {
                this.tiposEquipos = response.data;
              this.tiposEquipos.unshift({id:'',nombre:'Todos'})
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
      changeEstadoEquipo(equipo){
        let inputs={
          estado: equipo.estado,
        };
        axios.patch(this.$urlApi.changeEstadoEquipo+equipo.id, inputs
        ).then(response => {
          this.$toastr('success', '', 'TAREA REALIZADA CON ÉXITO');
        }).catch(errors => {
          this.$notifyErrors(errors);
        });
      },
      enviarMantenimiento(equipo) {
        this.selected = equipo;
        this.$nextTick(() => {
          this.$refs.componentEnviarMantenimiento.openDialog();
        });
      },
      printEquipos() {
        this.$refs.printEquipos.print();
      },
    },
    computed: {
      cargarPaginaConFiltro(){
        let params=''
        if (this.$route.params.filter==='asignados'){
          params='a'
        } else if(this.$route.params.filter==='disponibles'){
          params='na'
        }
        return params
      },
      equiposFiltrado(){
        let data = []
        if (!this.filters.estado || this.filters.estado==='') {
          data=this.dataTable.equipos
        } else {
          data = this.dataTable.equipos.filter(equipo =>{
            return equipo.estado===this.filters.estado
          })
        }

        if (this.filters.tipoEquipo && this.filters.tipoEquipo!=='') {
          data = data.filter( value =>{
            return value.tipo_equipo_id===this.filters.tipoEquipo
          })
        }
        return data
      }
    }
  }
</script>
