<template>
    <div>
        <h4 class="pa-2" style="border-bottom:5px solid skyblue">{{$route.meta.subname}}</h4>
        <v-container fluid>
            <v-layout row>
                <component-estacion @register-success="getEstaciones"/>
                <!--<v-select :items="proEleRef"
                          @change="getEstaciones"
                          attach
                          background-color="blue lighten-5"
                          class="pa-0"
                          color="blue darken-4"
                          hide-details
                          item-text="descripcion"
                          item-value="id"
                          label="Seleccione un Proceso Electoral"
                          v-model="selectedProEleRef"
                >
                    <template v-slot:item="{ item, index }">
                        <v-layout align-center fill-height justify-space-between>
                            <v-flex class="text-truncate" xs8>
                                <span class="v-text-field&#45;&#45;full-width">{{item.descripcion }}</span>
                            </v-flex>
                            <v-flex class="text-xs-right">
                                <span>{{item.fecha }}</span>
                            </v-flex>
                        </v-layout>
                    </template>
                </v-select>-->
                <v-flex pa-0 xs6>
                    <v-text-field
                            append-icon="search"
                            background-color="blue lighten-5"
                            class="pa-0"
                            color="blue darken-4"
                            hide-details
                            label="Buscar..."
                            single-line
                            v-model="search"
                    ></v-text-field>
                </v-flex>
                <v-select :items="filtrosEstaciones"
                          background-color="blue lighten-5"
                          class="pa-0 px-2"
                          color="blue darken-4"
                          hide-details
                          item-text="state"
                          item-value="abbr"
                          label="Filtrar por tipo de estacion"
                          title="Filtrar por tipo de estacion"
                          v-model="filtros.tipoEstacion"
                ></v-select>
            </v-layout>
            <span class="my-3 d-inline-block">Total estaciones: {{estacionesFiltradas.length}}</span>
            <v-data-table
                    :headers="dataTable.headers"
                    :items="estacionesFiltradas"
                    :search="search"
                    disable-initial-sort
            >
                <template v-slot:items="props">
                    <td>{{ props.item.nro_estacion }}</td>
                    <td>
                        <span v-if="props.item.tipo_estacion==='f'">Estación fija</span>
                        <span v-else>Estación móvil</span>
                    </td>
                    <td>
                        {{
                        props.item.punto_empadronamiento ? props.item.punto_empadronamiento.descripcion:''
                        }}
                    </td>
                    <td>{{ props.item.nro_counter_c }}</td>
                    <td>{{ props.item.nro_counter_r }}</td>
                    <td>{{ props.item.nro_counter_c_final }}</td>
                    <td>{{ props.item.nro_counter_r_final }}</td>
                    <td>
                        <v-btn @click="editEstacion(props.item)"
                               class="white--text" color="success"
                               depressed
                               round
                               small
                        >
                            <v-icon>edit</v-icon>
                            Editar
                        </v-btn>
                        <v-btn @click="eliminarEstacion(props.item)"
                               class="white--text" color="error"
                               depressed
                               round
                               small
                        >
                            <v-icon>delete</v-icon>
                            Eliminar
                        </v-btn>
                    </td>
                </template>
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
            <PrintEstacionesComponent
                    :headers="dataTable.headers"
                    :print-data="estacionesFiltradas"
                    ref="printReport"
                    title="Estaciones"/>
            <component-estacion :edit-data="selectedEstacion" @register-success="getEstaciones" mode-edit
                                ref="componentEstacion"/>
        </v-container>
    </div>
</template>

<script>
    import ComponentPER from '../components/ComponentProcesosElectoralesReferendo.vue';
    import ComponentEstacion from '../components/ComponentEstacion.vue';
    import Estacion from '../models/Estacion'
    import axios from 'axios';
    import PrintEstacionesComponent from "../components/reportes/PrintEstacionesComponent";

    export default {
        components: {
            PrintEstacionesComponent,
            ComponentPER,
            ComponentEstacion
        },
        data: () => ({
            dialog: false,
            valid: true,
            modeCreate: false,
            modeEdit: false,
            search: '',
            dataTable: {
                headers: [
                    {
                        text: 'Número de estación',
                        value: 'nro_estacion'
                    },
                    {
                        text: 'Tipo de estación',
                        value: 'tipo_estacopm'
                    }, {
                        text: 'Punto de Empadronamiento',
                        value: 'punto_empadronamiento.descripcion'
                    },
                    {
                        text: 'Counter C',
                        value: 'nro_counter_c'
                    },
                    {
                        text: 'Counter R',
                        value: 'nro_counter_r'
                    },
                    {
                        text: 'Counter C Final',
                        value: 'nro_counter_c_final'
                    },
                    {
                        text: 'Counter R Final',
                        value: 'nro_counter_r_final'
                    },
                    {
                        text: 'Acciones',
                        sortable: false
                    }
                ],
                estaciones: [],
            },
            rules: {
                descripcion: [
                    v => !!v || 'Descripción es requerido',
                    /*v => (v && v.length <= 10) || 'Name must be less than 10 characters'*/
                ],
                fecha: [
                    v => !!v || 'Fecha es requerido',
                    // v => /.+@.+/.test(v) || 'E-mail must be valid'
                ]
            },
            proEleRef: [],
            selectedProEleRef: null,
            selectedEstacion: null,
            filtrosEstaciones: [
                {state: 'Todos', abbr: ''},
                {state: 'Estaciones fijas', abbr: 'f'},
                {state: 'Estaciones Moviles', abbr: 'm'}
            ],
            filtros: {
                tipoEstacion: ''
            },
            // model
            estacion: new Estacion(),
        }),
        mounted() {
            // this.getProcesosElectorales();
            this.getEstaciones()
        },
        methods: {
            /*getProcesosElectorales() {
                axios.get(this.$urlApi.resourcesProEleRef
                ).then(response => {
                    this.proEleRef = response.data;
                }).catch(errors => {

                });

            },*/
            getEstaciones() {
                axios.get(this.$urlApi.resourcesEstacion + '/' + 1
                ).then(response => {
                    this.dataTable.estaciones = response.data;
                }).catch(errors => {

                });

            },
            editEstacion(estacion) {
                this.selectedEstacion = estacion;
                this.$nextTick(() => {
                    this.$refs.componentEstacion.openDialog();
                });
            },
            eliminarEstacion(estacion) {
                this.$swal().then(result => {
                    if (result.isConfirmed) {
                        axios.delete(this.$urlApi.resourcesEstacion + '/' + estacion.id
                        ).then(response => {
                            this.getEstaciones()
                            this.$toastr('success', '', 'TAREA REALIZADA CON ÉXITO')
                        }).catch(errors => {
                            this.$notifyErrors(errors)
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
            estacionesFiltradas() {
                let data = []
                if (!this.filtros.tipoEstacion || this.filtros.tipoEstacion === '') {
                    data = this.dataTable.estaciones
                } else {
                    data = this.dataTable.estaciones.filter(estacion => {
                        return estacion.tipo_estacion === this.filtros.tipoEstacion
                    })
                }

                return data
            }
        }
    }
</script>
