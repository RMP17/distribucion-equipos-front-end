<template>
    <div>
        <h4 class="pa-2" style="border-bottom:5px solid skyblue">{{$route.meta.subname}}</h4>
        <v-container fluid>
            <v-layout>
            <v-flex xs6 py-0>
                <v-text-field
                        color="blue darken-4 w-100 flex"
                        background-color="blue lighten-5"
                        class="py-0"
                        v-model="search"
                        append-icon="search"
                        label="Buscar..."
                        single-line
                        hide-details
                ></v-text-field>
            </v-flex>
            <!--<v-select :items="filtroEstados"
                      v-model="filters.estado"
                      hide-details
                      class="pa-0 px-2"
                      color="blue darken-4"
                      background-color="blue lighten-5"
                      item-text="state"
                      item-value="abbr"
                      label="Filtrar por estado"
                      title="Filtrar por estado"
            ></v-select>-->
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
            <div class="py-2">
                <span>Total dispositivos: {{equiposFiltrado.length}}</span>
            </div>
            <v-data-table
                    :headers="dataTable.headers"
                    :items="equiposFiltrado"
                    :search="search"
                    disable-initial-sort
            >
                <template v-slot:items="props">
                    <td>
                        {{
                        (props.item.equipo)
                        ? props.item.equipo.codigo_activo:''
                        }}
                    </td>
                    <td>{{ props.item.tecnico ? props.item.tecnico.nombre:'' }}</td>
                    <td>
                        {{
                        (props.item.equipo && props.item.equipo.tipo_equipo)
                        ? props.item.equipo.tipo_equipo.nombre:''
                        }}
                    </td>
                    <td>{{props.item.created_at}}</td>
                    <td>
                        {{
                        props.item.equipo
                        ? props.item.equipo.nro_serie:''
                        }}
                    </td>
                    <td>
                        {{
                        (props.item.equipo && props.item.equipo.marca)
                        ? props.item.equipo.marca.nombre:''
                        }}
                    </td>
                    <td>
                        {{
                        (props.item.equipo && props.item.equipo.modelo)
                        ? props.item.equipo.modelo.nombre:''
                        }}
                    </td>
                   <!-- <td>
                        <template v-if="props.item.equipo">
                            <span v-if="props.item.equipo.estado === 'b'">Bueno</span>
                            <span v-if="props.item.equipo.estado === 'd'">Dañado</span>
                            <span v-if="props.item.equipo.estado === 'r'">En Reparación</span>
                        </template>
                    </td>-->
                    <td>{{props.item.diagnostico_inicial}}</td>
<!--                    <td>{{props.item.tipo_mantenimiento}}</td>-->
                    <td>{{props.item.observaciones}}</td>
                    <td>{{props.item.updated_at}}</td>
                </template>
                <!--<v-alert v-slot:no-results :value="true" color="error" icon="warning">
                  Your search for "{{ search }}" found no results.
                </v-alert>-->
            </v-data-table>
            <v-btn @click="printReport()"
                   class="white--text"
                   color="success"
                   depressed
                   round
                   small
            >
                <v-icon>print</v-icon>
                Imprimir Reporte
            </v-btn>
        </v-container>
        <PrintEquipoMantenimiento2Component
                title="Mantenimientos Realizados"
                :print-data="equiposFiltrado"
                :headers="dataTable.headers"
                ref="printReport"  />
    </div>
</template>

<script>
    import axios from 'axios'
    import PrintEquipoMantenimiento2Component from '../../components/reportes/PrintEquipoMantenimiento2Component'

    export default {

        components: {
            PrintEquipoMantenimiento2Component
        },
        mounted() {
            this.$nextTick(() => {
                this.getMantenimiento()
                this.getTiposEquipos()
            })
        },
        data: () => {
            return {

                dataTable: {
                    headers: [
                        {text: 'Codigo activo', value: 'equipo.codigo_activo'},
                        {text: 'Tecnico', value: 'tecnico.nombre_completo'},
                        {text: 'Tipo de equipo', value: 'equipo.modelo.nombre'},
                        {text: 'Fecha Inicio del mantenimiento', value: 'created_at'},
                        {text: 'Nro Serie', value: 'equipo.serie'},
                        {text: 'Marca', value: 'equipo.marca.nombre'},
                        {text: 'Modelo', value: 'equipo.modelo.nombre'},
                        // {text: 'Estado', value: 'equipo.estado'},
                        {text: 'Diagnostico inicial', value: 'diagnostico_inicial'},
                        // {text: 'Tipo de mantenimiento', value: 'tipo_mantenimiento'},
                        {text: 'Observaciones', value: 'observaciones'},
                        {text: 'Fecha Finalizacion del mantenimiento', value: 'updated_at'},
                    ],
                    data: [],
                },
                filtroEstados: [
                    {state: 'Todos', abbr: ''},
                    {state: 'Solo Buenos', abbr: 'b'},
                    {state: 'Solo Dañados', abbr: 'd'},
                    {state: 'Solo en Reparación', abbr: 'r'},
                ],
                filters:{
                    estado:null,
                    tipoEquipo:null
                },
                tiposEquipos: [],
                selected: null,
                search: '',
            }
        },
        methods: {
            getMantenimiento: function (params='rm') {
                axios.get(this.$urlApi.resourcesMantenimiento+'?filter='+params
                ).then(response => {
                    this.dataTable.data = response.data;
                }).catch(errors => {
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
            printReport() {
                this.$refs.printReport.print();
            },
        },
        computed:{
            equiposFiltrado(){
                let data = []
                if (!this.filters.estado || this.filters.estado==='') {
                    data=this.dataTable.data
                } else {
                    data = this.dataTable.data.filter(mantenimiento =>{
                        return mantenimiento.equipo.estado===this.filters.estado
                    })
                }

                if (this.filters.tipoEquipo && this.filters.tipoEquipo!=='') {
                    data = data.filter( mantenimiento =>{
                        return mantenimiento.equipo.tipo_equipo_id===this.filters.tipoEquipo
                    })
                }
                return data
            }
        }
    }
</script>
