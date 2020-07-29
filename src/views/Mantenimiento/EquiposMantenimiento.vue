<template>
    <div>
        <h4 class="pa-2" style="border-bottom:5px solid skyblue">{{$route.meta.subname}}</h4>
        <v-container fluid>
            <v-layout>
                <v-text-field
                        @input="(e)=>{this.searchSerie='';this.filters.tipoEquipo='';}"
                        append-icon="search"
                        background-color="blue lighten-5"
                        class="py-0 mx-2"
                        color="blue darken-4"
                        hide-details
                        label="Buscar por codigo de activo"
                        single-line
                        v-model="searchCodigoActivo"
                ></v-text-field>
                <v-select :items="tiposEquipos"
                          background-color="blue lighten-5"
                          class="pa-0 mx-2"
                          color="blue darken-4"
                          hide-details
                          item-text="nombre"
                          item-value="id"
                          label="Filtrar por tipo de dispositivo"
                          title="Filtrar por tipo de dispositivo"
                          v-model="filters.tipoEquipo"
                ></v-select>
                <v-text-field
                        @input="(e)=>{this.filters.tipoEquipo='';this.searchCodigoActivo = ''}"
                        append-icon="search"
                        background-color="blue lighten-5"
                        class="py-0 mx-2"
                        color="blue darken-4"
                        hide-details
                        label="Buscar por nro de serie"
                        single-line
                        v-model="searchSerie"
                ></v-text-field>
            </v-layout>
            <div class="py-2">
                <span>Total dispositivos: {{equiposFiltrado.length}}</span>
            </div>
            <v-data-table
                    :headers="dataTable.headers"
                    :items="equiposFiltrado"
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
                    <!--
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
                    </td>-->
                    <!--<td>
                        <template v-if="props.item.equipo">
                            <span v-if="props.item.equipo.estado === 'b'">Bueno</span>
                            <span v-if="props.item.equipo.estado === 'd'">Dañado</span>
                            <span v-if="props.item.equipo.estado === 'r'">En Reparación</span>
                        </template>
                    </td>-->
                    <td>{{props.item.diagnostico_inicial}}</td>
                    <!--                    <td>{{props.item.tipo_mantenimiento}}</td>-->
                    <td>{{props.item.observaciones}}</td>
                    <td>
                        <v-layout class="justify-center" row>
                            <v-btn @click="realizarMantenimiento(props.item)"
                                   class="white--text" color="info"
                                   depressed
                                   round
                                   small
                            >
                                <v-icon>build</v-icon>
                                Reparado
                            </v-btn>
                        </v-layout>
                    </td>
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
        <PrintEquipoMantenimientoComponent
                :headers="dataTable.headers"
                :print-data="equiposFiltrado"
                ref="printReport"
                title="Dispositivos en Mantenimiento"/>
    </div>
</template>

<script>
    import axios from 'axios'
    import PrintEquipoMantenimientoComponent from '../../components/reportes/PrintEquipoMantenimientoComponent'

    export default {

        components: {
            PrintEquipoMantenimientoComponent
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
                        {text: 'Fecha Inicio Mantenimiento', value: 'created_at'},
                        {text: 'Nro Serie', value: 'equipo.serie'},
                        /*{text: 'Marca', value: 'equipo.marca.nombre'},
                        {text: 'Modelo', value: 'equipo.modelo.nombre'},
                        {text: 'Estado', value: 'equipo.estado'},*/
                        {text: 'Diagnostico inicial', value: 'diagnostico_inicial'},
                        // {text: 'Tipo de mantenimiento', value: 'tipo_mantenimiento'},
                        {text: 'Observaciones', value: 'observaciones'},
                        {text: 'Regresar', sortable: false, width: '1%'},
                    ],
                    data: [],
                },
                filtroEstados: [
                    {state: 'Todos', abbr: ''},
                    {state: 'Solo Buenos', abbr: 'b'},
                    {state: 'Solo Dañados', abbr: 'd'},
                    {state: 'Solo en Reparación', abbr: 'r'},
                ],
                filters: {
                    estado: null,
                    tipoEquipo: null
                },
                tiposEquipos: [],
                selected: null,
                search: '',
                searchCodigoActivo: '',
                searchSerie: '',
            }
        },
        methods: {
            getMantenimiento: function (params = 'pm') {
                axios.get(this.$urlApi.resourcesMantenimiento + '?filter=' + params
                ).then(response => {
                    this.dataTable.data = response.data;
                }).catch(errors => {
                    console.log('error servidor')
                });
            },
            getTiposEquipos: function () {
                axios.get(this.$urlApi.resourcesTiposEquipos
                ).then(response => {
                    this.tiposEquipos = response.data;
                    this.tiposEquipos.unshift({id: '', nombre: 'Todos'})
                }).catch(errors => {
                    console.log('error servidor')
                });
            },
            realizarMantenimiento: function (equipo_mantenimiento) {
                this.$swal().then(result => {
                    if (result.isConfirmed) {
                        axios.patch(this.$urlApi.resourcesMantenimiento + '/' + equipo_mantenimiento.id
                        ).then(response => {
                            this.$toastr('success', '', 'TAREA REALIZADA CON ÉXITO');
                            this.getMantenimiento()
                        }).catch(errors => {
                            console.log('error servidor')
                        })
                    }
                })
            },
            printReport() {
                this.$refs.printReport.print();
            },
        },
        computed: {
            equiposFiltrado() {
                let data = []
                if (this.searchCodigoActivo) {
                    return this.dataTable.data.filter(mantenimiento => {
                        return mantenimiento
                            .equipo
                            .codigo_activo
                            .toLowerCase()
                            .indexOf(this.searchCodigoActivo.toLowerCase()) !== -1
                    })
                }
                if (this.searchSerie) {
                    return this.dataTable.data.filter(mantenimiento => {
                        return mantenimiento
                            .equipo
                            .nro_serie
                            .toLowerCase()
                            .indexOf(this.searchSerie.toLowerCase()) !== -1
                    })
                }
                if (!this.filters.estado || this.filters.estado === '') {
                    data = this.dataTable.data
                } else {
                    data = this.dataTable.data.filter(mantenimiento => {
                        return mantenimiento.equipo.estado === this.filters.estado
                    })
                }

                if (this.filters.tipoEquipo && this.filters.tipoEquipo !== '') {
                    data = data.filter(mantenimiento => {
                        return mantenimiento.equipo.tipo_equipo_id === this.filters.tipoEquipo
                    })
                }
                return data
            }
        }
    }
</script>
