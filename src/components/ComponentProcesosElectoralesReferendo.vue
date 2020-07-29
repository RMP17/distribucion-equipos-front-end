<template>
    <div>
        <div v-show="modeScreen===1">
            <v-layout pb-4>
                <v-text-field
                        append-icon="search"
                        background-color="blue lighten-5"
                        class="py-0 mx-2"
                        color="blue darken-4"
                        hide-details
                        label="Buscar por nombre de proceso"
                        single-line
                        v-model="search"
                ></v-text-field>
                <v-select :items="tiposProcesos"
                          background-color="blue lighten-5"
                          class="pa-0 mx-2"
                          color="blue darken-4"
                          hide-details
                          item-text="nombre"
                          item-value="id"
                          label="Filtrar por tipo de proceso"
                          v-model="filters.tipoProceso"
                ></v-select>
            </v-layout>
            <v-data-table
                    disable-initial-sort
                    :search="search"
                    :headers="dataTable.headers"
                    :items="filtradoProcesos"
            >
                <template v-slot:items="props">
                    <td>{{ props.item.descripcion }}</td>
                    <td>{{ props.item.fecha }}</td>
                    <td>{{ props.item.fecha_final }}</td>
                    <td>{{ props.item.tipo }}</td>
                    <td>
                        <span v-if="props.item.estado">En proceso</span>
                        <span v-else>Finalizado</span>
                    </td>
                    <td>
                        <v-layout class="justify-center" row>
                            <v-btn @click="aModoEditar(props.item)"
                                   class="white--text" color="success"
                                   depressed
                                   round
                                   small
                            >
                                <v-icon>edit</v-icon>
                                Editar
                            </v-btn>
                            <v-btn @click="eliminarProceso(props.item)"
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
                <v-alert v-slot:no-results :value="true" color="error" icon="warning">
                    Your search for "{{ search }}" found no results.
                </v-alert>
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
            <PrintProcesosComponent
                    :headers="dataTable.headers"
                    :print-data="filtradoProcesos"
                    ref="printReport"
                    title="Procesos"/>
        </div>
        <div v-show="modeScreen===2">
            <v-flex xs6 offset-xs3>
                <ProcesosElectoralesReferendoComponent
                        :edit-data="selected"
                        @cancel="modeScreen=1"
                        @register-success="()=>{this.getProcesosElectorales();this.modeScreen=1}"
                        mode-edit
                        v-if="modeScreen===2"/>
            </v-flex>
        </div>
        <!--<EquipoFormComponent
                :edit-data="selected"
                @cancel="modeScreen=1"
                @register-success="()=>{this.getEquipos();this.modeScreen=1}"
                mode-edit
                v-if="modeScreen===3"
        />-->
    </div>
</template>

<script>
    import ProcesoElectoral from '../models/ProcesoElectoral'
    import ProcesosElectoralesReferendoComponent from '../components/nc/ProcesosElectoralesReferendoComponent'
    import axios from 'axios';
    import PrintProcesosComponent from "./reportes/PrintProcesosComponent";


    export default {
        components:{
            PrintProcesosComponent,
            ProcesosElectoralesReferendoComponent
        },
        data: () => ({
            // view
            dialog: false,
            menu: false,
            valid: true,
            tiposProcesos: ['Todos','Nacional','Departamental','Municipal'],
            dataTable:{
                headers: [
                    {
                        text: 'Descripción',
                        value: 'descripcion'
                    },
                    { text: 'Fecha de inicio', value: 'fecha' },
                    { text: 'Fecha final', value: 'fecha_final' },
                    {
                        text: 'Tipo de proceso',
                        value: 'tipo'
                    },
                    { text: 'Estado', value: 'estado' },
                    { text: 'Acciones'},
                ],
                procesosElectorales:[],
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
            // model
            procesoElectoral: new ProcesoElectoral(),
            modeEdit: false,
            selected:null,
            modeScreen:1,
            search:'',
            filters:{
                tipoProceso:null
            }
        }),
        mounted(){
            this.getProcesosElectorales();
        },
        methods: {
            getProcesosElectorales(){
                axios.get(this.$urlApi.resourcesProEleRef
                ).then(response => {
                    this.dataTable.procesosElectorales = response.data;
                }).catch(errors => {

                });

            },
            aModoEditar(equipo) {
                this.modeScreen = 2
                this.selected = equipo
            },
            eliminarProceso: function (equipo) {
                this.$swal().then(result => {
                    if (result.isConfirmed) {
                        axios.delete(this.$urlApi.resourcesProEleRef + '/' + equipo.id
                        ).then(response => {
                            this.getProcesosElectorales()
                            this.$toastr('success', '', 'TAREA REALIZADA CON ÉXITO');
                        }).catch(errors => {
                            this.$notifyErrors(errors)
                            console.log('error servidor')
                        });
                    }
                })
            },
            printReport() {
                this.$refs.printReport.print();
            },
        },
        computed:{
            filtradoProcesos() {
                let data = []
                if (!this.filters.tipoProceso || this.filters.tipoProceso === '' || this.filters.tipoProceso === 'Todos') {
                    data = this.dataTable.procesosElectorales
                } else {
                    data = this.dataTable.procesosElectorales.filter(proceso => {
                        return proceso.tipo === this.filters.tipoProceso
                    })
                }
                return data
            }
        }
    }
</script>
