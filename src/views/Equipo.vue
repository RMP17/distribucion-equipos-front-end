<template>
    <div>
        <h4 class="pa-2" style="border-bottom:5px solid skyblue" v-if="modeScreen===1">{{$route.meta.subname}}
            {{$route.params.filter}} </h4>
        <h4 class="pa-2" style="border-bottom:5px solid skyblue" v-else-if="modeScreen===2">
            Detalle
        </h4>
        <h4 class="pa-2" style="border-bottom:5px solid skyblue"
            v-else
        >
            Editar Dispositivo {{ this.selected.codigo_activo}}
        </h4>
        <v-container fluid>
            <div v-show="modeScreen===1">
                <v-layout row>
                    <!--                <ComponentEquipo @register-success="getEquipos"/>-->
                    <!--<component-accesorio :id-equipo="selectedIdEquipo"
                                         ref="componentsAccesorio"/>-->
                    <v-text-field
                            append-icon="search"
                            background-color="blue lighten-5"
                            class="pa-0 px-1 w-100 flex"
                            color="blue darken-4"
                            hide-details
                            label="Buscar..."
                            single-line
                            v-model="search"
                    ></v-text-field>
                    <v-select :items="tiposEquipos"
                              background-color="blue lighten-5"
                              class="pa-0 px-1"
                              color="blue darken-4"
                              hide-details
                              item-text="nombre"
                              item-value="id"
                              label="Filtrar por tipo de dispositivo"
                              title="Filtrar por tipo de dispositivo"
                              v-model="filters.tipoEquipo"
                    ></v-select>
                    <v-select :items="modelos"
                              background-color="blue lighten-5"
                              class="pa-0 px-1"
                              color="blue darken-4"
                              hide-details
                              item-text="nombre"
                              item-value="id"
                              label="Filtrar por modelo"
                              title="Filtrar por modelo"
                              v-model="filters.modelo"
                    ></v-select>
                    <v-select :items="filtroEstados"
                              background-color="blue lighten-5"
                              class="pa-0 px-2"
                              color="blue darken-4"
                              hide-details
                              item-text="state"
                              item-value="abbr"
                              label="Filtrar por estado"
                              title="Filtrar por estado"
                              v-model="filters.estado"
                    ></v-select>
                </v-layout>
                <span class="my-3 d-inline-block">Total dispositivos: {{equiposFiltrado.length}}</span>
                <v-data-table
                        :headers="dataTable.headers"
                        :items="equiposFiltrado"
                        :search="search"
                        disable-initial-sort
                >
                    <!--class="elevation-1" elevacion de data table -->
                    <template v-slot:items="props">
                        <td>{{ props.item.codigo_activo }}</td>
                        <td>{{ props.item.nro_serie }}</td>
                        <td>{{ props.item.service_tag }}</td>
                        <td>{{ props.item.tipo_equipo? props.item.tipo_equipo.nombre:'' }}</td>
                        <td>{{ props.item.marca? props.item.marca.nombre:'' }}</td>
                        <td>{{ props.item.modelo? props.item.modelo.nombre:'' }}</td>
                        <td>
                            <v-select :items="estados"
                                      @change="changeEstadoEquipo(props.item)"
                                      background-color="blue lighten-5"
                                      color="blue darken-4"
                                      dense
                                      flat
                                      hide-details
                                      item-text="state"
                                      item-value="abbr"
                                      label="Estado"
                                      single-line
                                      solo
                                      v-model="props.item.estado"
                            ></v-select>
                            <!--<span v-if="props.item.estado === 'b'">Bueno</span>
                            <span v-if="props.item.estado === 'r'">En Reparación</span>
                            <span v-if="props.item.estado === 'd'">Dañado</span>-->
                        </td>
                        <!--<td>
                          <span v-if="props.item.tipo === 'e'">Equipo</span>
                          <span v-if="props.item.tipo === 'o'">Otro</span>
                        </td>-->
                        <td>{{ props.item.created_at }}</td>
                        <!--          <td>{{ props.item.condicion }} - {{ props.item.origen }}</td>-->
                        <!--          <td>{{ props.item.origen }}</td>-->
                        <!--<td>{{ props.item.descripcion }}</td>
                        <td>{{ props.item.observaciones }}</td>-->
                        <td>
                            <v-layout column pa-0>
                                <v-btn @click="aModoEditar(props.item)"
                                       class="white--text mx-1"
                                       color="success"
                                       depressed
                                       round
                                       small
                                >
                                    <v-icon>edit</v-icon>
                                    Editar
                                </v-btn>
                                <v-btn @click="aModoDetalle(props.item)"
                                       class="white--text mx-1"
                                       color="cyan"
                                       depressed
                                       round
                                       small
                                >
                                    <v-icon>info</v-icon>
                                    Detalle
                                </v-btn>
                                <v-btn @click="eliminarEquipo(props.item)"
                                       class="white--text mx-1"
                                       color="error"
                                       depressed
                                       round
                                       small
                                >
                                    <v-icon>delete</v-icon>
                                    Eliminar
                                </v-btn>
                            </v-layout>
                        </td>
                    </template>
                    <v-alert :value="true" color="error" icon="warning" v-slot:no-results>
                        Your search for "{{ search }}" found no results.
                    </v-alert>
                </v-data-table>

                <v-layout row>
                    <v-btn @click="printEquipos()"
                           class="white--text"
                           color="success"
                           depressed
                           round
                           small
                    >
                        <v-icon>print</v-icon>
                        Imprimir
                    </v-btn>
                    <v-text-field
                            background-color="blue lighten-5"
                            class="pa-0"
                            color="blue darken-4 w-100 flex"
                            hide-details
                            label="Titulo del informe"
                            single-line
                            v-model="tituloInforme"
                    ></v-text-field>
                </v-layout>
            </div>


            <div v-show="modeScreen===2">
                <v-btn @click="modeScreen=1"
                       class=""
                       depressed
                       round
                       small
                >
                    < Atras
                </v-btn>
                <template v-if="selected">
                    <v-layout row>
                        <v-flex xs4>
                            <b class="d-inline-block pa-2">Código de activo:</b>
                            <span class="d-inline-block pa-2">{{selected.codigo_activo}}</span>
                        </v-flex>
                        <v-flex xs4>
                            <b class="d-inline-block pa-2">Número de serie:</b>
                            <span class="d-inline-block pa-2">{{selected.nro_serie}}</span>
                        </v-flex>
                        <v-flex xs4>
                            <b class="d-inline-block pa-2">Service tag:</b>
                            <span class="d-inline-block pa-2">{{selected.service_tag}}</span>
                        </v-flex>
                    </v-layout>

                    <v-layout row>
                        <v-flex xs4>
                            <b class="d-inline-block pa-2">Tipo de equipo</b>
                            <span class="d-inline-block pa-2">{{selected.tipo_equipo.nombre}}</span>
                        </v-flex>
                        <v-flex xs4>
                            <b class="d-inline-block pa-2">Marca:</b>
                            <span class="d-inline-block pa-2">{{selected.marca.nombre}}</span>
                        </v-flex>
                        <v-flex xs4>
                            <b class="d-inline-block pa-2">Modelo:</b>
                            <span class="d-inline-block pa-2">{{selected.modelo.nombre}}</span>
                        </v-flex>
                    </v-layout>

                    <v-layout row>
                        <v-flex xs4>
                            <b class="d-inline-block pa-2">Estado:</b>
                            <span class="d-inline-block pa-2">
                            {{
                            selected.estado==='b'? 'Bueno':
                            selected.estado==='d'? 'Dañado':'En Reparación'
                            }}
                        </span>
                        </v-flex>
                        <v-flex xs4>
                            <b class="d-inline-block pa-2">Fecha de registro:</b>
                            <span class="d-inline-block pa-2">{{selected.created_at}}</span>
                        </v-flex>
                        <v-flex xs4>

                        </v-flex>
                    </v-layout>

                    <v-layout row>
                        <v-flex xs4>
                            <b class="d-inline-block pa-2">Descripcion:</b>
                            <span class="d-inline-block pa-2">
                            {{
                            selected.descripcion
                            }}
                        </span>
                        </v-flex>
                        <v-flex xs4>
                            <b class="d-inline-block pa-2">Observaciones:</b>
                            <span class="d-inline-block pa-2">{{selected.observaciones}}</span>
                        </v-flex>
                        <v-flex xs4>

                        </v-flex>
                    </v-layout>

                    <h3 class="text-xs-center text-uppercase">Accesorios</h3>
                    <v-data-table
                            :headers="dataTableAccesorios.headers"
                            :items="dataTableAccesorios.data"
                            disable-initial-sort
                            hide-actions
                            item-key="index"
                    >
                        <template v-slot:items="props">
                            <td>{{ props.index+1 }}</td>
                            <td>{{ props.item.nombre }}</td>
                        </template>
                    </v-data-table>
                </template>
            </div>


            <div v-show="modeScreen===3">
                <EquipoFormComponent
                        :edit-data="selected"
                        @cancel="modeScreen=1"
                        @register-success="()=>{this.getEquipos();this.modeScreen=1}"
                        mode-edit
                        v-if="modeScreen===3"
                />
            </div>
        </v-container>
        <!--        <ComponentEquipo :edit-data="selected" @register-success="getEquipos" mode-edit ref="componentEditEquipo"/>-->
        <PrintEquipoComponent
                :headers="dataTable.headers"
                :print-data="equiposFiltrado"
                :title="tituloInforme"
                ref="printEquipos"/>
    </div>
</template>

<script>
    import ComponentEquipo from '../components/ComponentEquipo.vue'
    import PrintEquipoComponent from '../components/PrintEquipoComponent.vue'
    import axios from 'axios';
    import ComponentAccesorio from "../components/ComponentAccesorio.vue";
    import EquipoFormComponent from '../components/nc/EquipoFormComponent'

    export default {
        components: {
            ComponentAccesorio,
            ComponentEquipo,
            PrintEquipoComponent,
            EquipoFormComponent
        },
        watch: {
            '$route'(to, from) {
                this.getEquipos(this.cargarPaginaConFiltro)
            }
        },
        mounted() {
            this.$nextTick(() => {
                this.getEquipos(this.cargarPaginaConFiltro);
                this.getTiposEquipos();
                this.getModelos();
            })
        },
        data() {
            return {
                dataTable: {
                    headers: [
                        {text: 'Código de activo', value: 'codigo_activo'},
                        {text: 'Número de serie', value: 'nro_serie'},
                        {text: 'Service tag', value: 'service_tag'},
                        {
                            text: 'Tipo de equipo',
                            align: 'left',
                            //sortable: false,
                            value: 'tipo_equipo.nombre'
                        },
                        {text: 'Marca', value: 'marca.nombre'},
                        {text: 'Modelo', value: 'modelo.nombre'},
                        {text: 'Estado', value: 'estado'},
                        {text: 'Fecha Registro', value: 'created_at'},
                        // { text: 'Tipo', value: 'tipo' },
                        // { text: 'Condicion-Origen', value: 'condicion' },
                        /*{text: 'Descripcion', value: 'descripcion'},
                        {text: 'Observaciones', value: 'observaciones'},*/
                        {text: 'Acciones', sortable: false,},
                    ],
                    equipos: [],
                },
                dataTableAccesorios: {
                    headers: [
                        {
                            text: '#',
                            width: '1%'
                        }, {
                            text: 'Accesorio',
                            //sortable: false,
                            value: 'nombre',
                        }
                        // { text: 'Código', value: 'codigo' },
                    ],
                    data: [],
                },
                search: '',
                tituloInforme: '',
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
                modelos: [],
                filters: {
                    estado: null,
                    tipoEquipo: null,
                    modelo: null
                },
                selected: null,
                // 1 = para la lista; 2=detalle; 3=Editar
                modeScreen: 1
            }
        },
        methods: {
            getEquipos: function (params = '') {
                axios.get(this.$urlApi.resourcesEquipo + '?filter=' + params
                ).then(response => {
                    this.dataTable.equipos = response.data;
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
            getModelos: function () {
                axios.get(this.$urlApi.resourcesModelos
                ).then(response => {
                    this.modelos = response.data;
                    this.modelos.unshift({id: '', nombre: 'Todos'})
                }).catch(errors => {
                    console.log('error servidor')
                });
            },
            /*getAccesoriosEquipoById(idEquipo) {
                this.selectedIdEquipo = idEquipo;
                this.$nextTick(() => {
                    this.$refs.componentsAccesorio.openDialog();
                });
            },*/
            changeEstadoEquipo(equipo) {
                let inputs = {
                    estado: equipo.estado,
                };
                axios.patch(this.$urlApi.changeEstadoEquipo + equipo.id, inputs
                ).then(response => {
                    this.$toastr('success', '', 'TAREA REALIZADA CON ÉXITO');
                }).catch(errors => {
                    this.$notifyErrors(errors);
                });
            },
            /*editEquipo(equipo) {
                this.selected = equipo;
                this.$nextTick(() => {
                    this.$refs.componentEditEquipo.openDialog();
                });
            },*/
            printEquipos() {
                this.$refs.printEquipos.print();
            },
            aModoDetalle(equipo) {
                this.modeScreen = 2
                this.selected = equipo
                this.dataTableAccesorios.data = equipo.accesorios
            },
            aModoEditar(equipo) {
                this.modeScreen = 3
                this.selected = equipo
            },
            eliminarEquipo: function (equipo) {
                this.$swal().then(result => {
                    if (result.isConfirmed) {
                        axios.delete(this.$urlApi.resourcesEquipo + '/' + equipo.id
                        ).then(response => {
                            this.getEquipos()
                            this.$toastr('success', '', 'TAREA REALIZADA CON ÉXITO');
                        }).catch(errors => {
                            this.$notifyErrors(errors)
                            console.log('error servidor')
                        });
                    }
                })
            },
        },
        computed: {
            cargarPaginaConFiltro() {
                let params = ''
                if (this.$route.params.filter === 'asignados') {
                    params = 'a'
                } else if (this.$route.params.filter === 'disponibles') {
                    params = 'na'
                } else if (this.$route.params.filter === 'reparacion') {
                    params = 're'
                }
                return params
            },
            equiposFiltrado() {
                let data = []
                if (!this.filters.estado || this.filters.estado === '') {
                    data = this.dataTable.equipos
                } else {
                    data = this.dataTable.equipos.filter(equipo => {
                        return equipo.estado === this.filters.estado
                    })
                }

                if (this.filters.tipoEquipo && this.filters.tipoEquipo !== '') {
                    data = data.filter(value => {
                        return value.tipo_equipo_id === this.filters.tipoEquipo
                    })
                }

                if (this.filters.modelo && this.filters.modelo !== '') {
                    data = data.filter(value => {
                        return value.modelo_id === this.filters.modelo
                    })
                }
                return data
            }
        }
    }
</script>
