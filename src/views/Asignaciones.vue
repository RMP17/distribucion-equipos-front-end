<template>
    <div>
        <h4 class="pa-2" style="border-bottom:5px solid skyblue">{{$route.meta.subname}}</h4>
        <v-container fluid>
            <v-layout row>
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
                <v-select :items="proEleRef"
                          @change="getEstaciones"
                          attach
                          background-color="blue lighten-5"
                          class="pa-0 px-1"
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
                                <span class="v-text-field--full-width">{{item.descripcion }}</span>
                            </v-flex>
                            <v-flex class="text-xs-right">
                                <span>{{item.fecha }}</span>
                            </v-flex>
                        </v-layout>
                    </template>
                </v-select>
            </v-layout>
            <v-data-table
                    :headers="dataTable.headers"
                    :items="dataTable.estaciones"
                    :search="search"
                    disable-initial-sort
            >
                <template v-slot:items="props">
                    <td>{{ props.item.nro_estacion }}</td>
                    <td>{{ props.item.nro_counter_c }}</td>
                    <td>{{ props.item.nro_counter_c_final }}</td>
                    <td>{{ props.item.nro_counter_c_final ? props.item.nro_counter_c_final - props.item.nro_counter_c:'' }}</td>
                    <td>{{ props.item.nro_counter_r }}</td>
                    <td>{{ props.item.nro_counter_r_final }}</td>
                    <td>{{ props.item.nro_counter_r_final? props.item.nro_counter_r_final-props.item.nro_counter_r:'' }}</td>
                    <td>
                        <span v-if="props.item.tipo_estacion === 'f'">Fija</span>
                        <span v-else>Móvil</span>
                    </td>
                    <td>
                        {{
                        props.item.punto_empadronamiento ?
                        props.item.punto_empadronamiento.descripcion:''
                        }}
                    </td>
                    <td>{{ props.item.tecnico ? props.item.tecnico.nombre:'' }}</td>
                    <td>{{ props.item.notario ? props.item.notario.nombre:'' }}</td>
                    <td>{{ props.item.notario ? props.item.notario.ci:'' }}</td>
                    <td>{{ props.item.notario ? props.item.notario.extension:'' }}</td>
                    <td>{{ props.item.notario ? props.item.notario.celular:'' }}</td>
                    <td>{{ props.item.notario ? props.item.notario.empresa_telefonica:'' }}</td>
                    <td class="justify-center">
                        <!--<v-btn @click="getEquiposByEstacion(props.item)"
                               class="white&#45;&#45;text" color="success"
                               depressed
                               round
                               small
                        >
                            <v-icon left>print</v-icon>
                            Imprimir
                        </v-btn>-->
                    </td>
                </template>
                <v-alert :value="true" color="error" icon="warning" v-slot:no-results>
                    Your search for "{{ search }}" found no results.
                </v-alert>
            </v-data-table>
            <v-layout row>
            <v-btn @click="printReporte()"
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
                    color="blue darken-4 w-100 flex"
                    background-color="blue lighten-5"
                    class="pa-0"
                    v-model="tituloInforme"
                    label="Titulo del informe"
                    single-line
                    hide-details
            ></v-text-field>
            </v-layout>
            <PrintReporteComponent :print-data="dataTable.estaciones"
                                   :headers="dataTable.headers"
                                   :title="tituloInforme" ref="printReporte"/>
<!--            <component-asignacion :edit-data="selectedEstacion" @registerSuccess="getEstaciones"-->
<!--                                  ref="componentsAsignacion"/>-->
<!--            <component-print-asignacion :print-data="printEstacion" ref="componentPrintAsignacion"/>-->
        </v-container>
    </div>
</template>

<script>
    import ComponentEquipo from '../components/ComponentEquipo.vue'
    import axios from 'axios';
    import PrintReporteComponent from "../components/PrintReporteComponent";
    import ComponentAccesorio from "../components/ComponentAccesorio.vue";
    import ComponentAsignacion from "../components/ComponentAsignacion.vue";
    import ComponentPrintAsignacion from "../components/ComponentPrintAsignacion.vue";

    export default {
        components: {
            ComponentAccesorio,
            ComponentEquipo,
            ComponentAsignacion,
            ComponentPrintAsignacion,
            PrintReporteComponent
        },
        mounted() {
            this.$nextTick(() => {
                this.getProcesosElectorales();
            })
        },
        data() {
            return {
                tituloInforme:'',
                dataTable: {
                    headers: [
                        {
                            text: 'Nro Estación',
                            // align: 'left',
                            //sortable: false,
                            value: 'nro_estacion'
                        },
                        {text: 'Counter C', value: 'nro_counter_c'},
                        {text: 'Counter C Final', value: 'nro_counter_c_final'},
                        {text: 'Total Registros C'},
                        {text: 'Counter R', value: 'nro_counter_r'},
                        {text: 'Counter R Final', value: 'nro_counter_r_final'},
                        {text: 'Total Registros R'},
                        {text: 'Tipo de estación', value: 'tipo_estacion'},
                        {text: 'Punto de Empadronamiento', value: 'punto_empadronamiento'},
                        {text: 'Tecnico', value: 'tecnico.nombre_completo'},
                        {text: 'Notario', value: 'notario.nombre_completo'},
                        {text: 'C.I.', value: 'notario.ci'},
                        {text: 'Ext.', value: 'notario.extension'},
                        {text: 'Celular', value: 'notario.extension'},
                        {text: 'Emp. Tel.', value: 'notario.empresa_telefonica'},
                        {text: '', sortable: false, value: ''},
                    ],
                    estaciones: [],
                },
                search: '',
                selectedEstacion: null,
                printEstacion: null,

                proEleRef: [],
                selectedProEleRef: null,
            }
        },
        computed: {},
        methods: {
            getEstaciones: function () {
                axios.get(this.$urlApi.reporteEstacion + this.selectedProEleRef
                ).then(response => {
                    this.dataTable.estaciones = response.data;
                }).catch(errors => {
                    console.log('error servidor')
                });
            },
            editEstacion(estacion) {
                this.selectedEstacion = estacion;
                this.$nextTick(() => {
                    this.$refs.componentsAsignacion.openDialog();
                });
            },
            getEquiposByEstacion(estacion) {
                axios.get(this.$urlApi.getEquiposByEstacion + estacion.id
                ).then(response => {
                    this.printEstacion = estacion;
                    this.printEstacion.equipos = response.data;
                }).catch(errors => {
                    console.log('error servidor')
                }).then(response => {
                    this.$refs.componentPrintAsignacion.printAsignacion();
                });
            },
            getProcesosElectorales() {
                axios.get(this.$urlApi.resourcesProEleRef
                ).then(response => {
                    this.proEleRef = response.data;
                }).catch(errors => {

                });

            },
            printReporte() {
                this.$refs.printReporte.print();
            }
        }
    }
</script>
