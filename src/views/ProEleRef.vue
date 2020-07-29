<template>
    <div>
        <h4 class="pa-2" style="border-bottom:5px solid skyblue">{{$route.meta.subname}}</h4>
        <v-container fluid grid-list-md>
            <v-layout column>
                <div style="height: 450px">
                    <h1 class="pa-2 text-xs-center">Estaciones</h1>
                    <v-flex>
                        <v-layout row>
                            <v-btn @click="getEstaciones"
                                   class="white--text" color="cyan accent-4"
                                   depressed
                                   round
                                   small
                            >
                                <v-icon left>refresh</v-icon>
                                Recargar
                            </v-btn>
                            <v-text-field
                                    append-icon="search"
                                    background-color="blue lighten-5"
                                    class="pt-0 pr-1"
                                    color="blue darken-4"
                                    hide-details
                                    label="Buscar..."
                                    single-line
                                    v-model="search"
                            ></v-text-field>
                            <v-select :items="filtroReservas"
                                      background-color="blue lighten-5"
                                      class="pa-0 px-2"
                                      color="blue darken-4"
                                      hide-details
                                      item-text="state"
                                      item-value="abbr"
                                      label="Filtrar por asignacion"
                                      title="Filtrar por asignacion"
                                      v-model="filtros.reserva"
                            ></v-select>
                        </v-layout>
                        <v-data-table
                                :headers="dataTable.headers"
                                :items="estacionesFiltradas"
                                :search="search"
                                disable-initial-sort
                                v-model="selected"
                        >
                            <template v-slot:items="props">
                                <tr :active="props.selected" @click="selectedItem(props.item)">
                                    <td>
                                        {{ props.item.nro_estacion}}<span class="indigo--text"
                                    >{{ Number(props.item.nro_counter_r_final)>0 ? '(Devuelto)':''  }}</span>
                                    </td>
                                    <td>
                                        <span v-if="props.item.tipo_estacion==='f'">Fija</span>
                                        <span v-else>Móvil</span>
                                    </td>
                                    <td>{{ props.item.notario ? props.item.notario.nombre_completo:'' }}</td>
                                </tr>
                            </template>
                        </v-data-table>
                    </v-flex>
                </div>
                <div>
                    <h1 class="pa-2 text-xs-center">Asignar</h1>
                    <v-flex>
                        <v-layout justify-space-between row>
                            <div>
                                <v-btn :disabled="!estacion"
                                       @click="printDoc()"
                                       class="white--text" color="cyan accent-4"
                                       depressed
                                       round
                                       small
                                >
                                    <v-icon left>print</v-icon>
                                    Imprimir Entrega
                                </v-btn>
                                <v-btn :disabled="!estacion"
                                       @click="printDoc('d')"
                                       class="white--text" color="cyan accent-4"
                                       depressed
                                       round
                                       small
                                >
                                    <v-icon left>print</v-icon>
                                    Imprimir Devolucion
                                </v-btn>
                            </div>
                            <div class="d-flex justify-space-between">
                                <v-btn :disabled="!estacion.id || estacion.fecha_hora_entrega!=null"
                                       @click="entregar()"
                                       class="white--text" color="cyan accent-4"
                                       depressed
                                       round
                                       small
                                >
                                    <v-icon left>check</v-icon>
                                    Entregar
                                </v-btn>
                                <component-devolucion
                                        :disabled="!estacion.id || estacion.fecha_hora_entrega==null || estacion.fecha_hora_devolucion!=null"
                                        @success="devolver"/>
                            </div>
                        </v-layout>
                        <v-layout row>
                            <!--<v-text-field
                                    color="blue darken-4"
                                    background-color="blue lighten-5"
                                    class="pt-0 pr-1 pl-1"
                                    label="Notario"
                                    single-line
                                    hide-details
                                    append-icon="person"
                                    @keyup.enter="addEquipoToEstacion($event.target.value)"
                            ></v-text-field>-->
                            <v-autocomplete
                                    :filter="customFilter"
                                    :items="items"
                                    :loading="autocomplete.isLoading"
                                    :search-input.sync="autocomplete.search"
                                    @change="assignNotario"
                                    background-color="blue lighten-5"
                                    class="pt-0 pr-1 pl-1"
                                    clearable
                                    color="blue darken-4"
                                    hide-details
                                    hide-no-data
                                    item-text="nombre_completo"
                                    item-value="id"
                                    label="Public APIs"
                                    open-on-clear
                                    placeholder="Buscar al notario por...(ci, nombre)"
                                    return-object
                                    single-line
                                    v-model="autocomplete.model"
                            >
                                <template v-slot:item="{ item, index }">
                                    <v-layout align-center fill-height justify-space-between>
                                        <v-flex xs8>
                                            <span class="v-text-field--full-width">{{item.nombre_completo }}</span>
                                        </v-flex>
                                        <v-flex class="text-xs-right">
                                            <span>{{item.ci }}</span>
                                        </v-flex>
                                    </v-layout>
                                </template>
                            </v-autocomplete>
                        </v-layout>
                        <v-layout row>
                            <v-text-field
                                    @keyup.enter="addEquipoToEstacion($event.target.value)"
                                    append-icon="laptop_windows"
                                    background-color="blue lighten-5"
                                    class="pt-0 pr-1 pl-1"
                                    color="blue darken-4"
                                    hide-details
                                    label="Introduzca el número de serie del equipo o codigo de activo"
                                    single-line
                            ></v-text-field>
                        </v-layout>
                        <v-data-table

                                :headers="dataTableEquipos.headers"
                                :items="dataTableEquipos.equipos"
                                disable-initial-sort
                        >
                            <template v-slot:items="props">
                                <td>
                                    <v-btn @click="removeEquipoOfEstacion(props.item)" class="square" color="error"
                                           flat
                                           title="Quitar"
                                           v-if="estacion.fecha_hora_entrega==null">
                                        <v-icon>remove</v-icon>
                                    </v-btn>
                                </td>
                                <td>
                                    {{ props.item.tipo_equipo? props.item.tipo_equipo.nombre:''}}
                                    {{ props.item.marca? props.item.marca.nombre:''}}
                                    {{ props.item.modelo? props.item.modelo.nombre:''}}
                                </td>
                                <td>{{ props.item.nro_serie}}</td>
                                <td>
                                    <v-select :items="estados"
                                              :readonly="estacion.fecha_hora_devolucion!=null"
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
                                <td>
                                    <v-textarea :rows="1"
                                                @click:append-outer="saveObservacion(props.item)"
                                                append-outer-icon="save"
                                                color="blue darken-4"
                                                hide-details
                                                label="Observaciones"
                                                outline
                                                v-if="estacion.fecha_hora_entrega==null"
                                                v-model="props.item.pivot.observacion"
                                    ></v-textarea>
                                    <v-textarea :rows="1"
                                                color="blue darken-4"
                                                hide-details
                                                label="Observaciones"
                                                outline
                                                readonly
                                                v-else
                                                v-model="props.item.pivot.observacion"
                                    ></v-textarea>
                                </td>
                                <td>
                                    <v-textarea
                                            :rows="1"
                                            @click:append-outer="saveObservacion(props.item,'d')"
                                            append-outer-icon="save"
                                            color="blue darken-4"
                                            hide-details
                                            label="Observaciones"
                                            outline
                                            v-if="estacion.fecha_hora_devolucion==null && estacion.fecha_hora_entrega!=null"
                                            v-model="props.item.pivot.observacion_devolucion"
                                    ></v-textarea>
                                    <v-textarea :rows="1"
                                                color="blue darken-4"
                                                hide-details
                                                label="Observaciones"
                                                outline
                                                readonly
                                                v-else
                                                v-model="props.item.pivot.observacion_devolucion"
                                    ></v-textarea>
                                </td>
                            </template>
                        </v-data-table>
                    </v-flex>
                </div>
            </v-layout>
            <component-print-asignacion :devuelto="devuelto" :print-data="printEstacion" ref="componentPrintProEleRef"/>
        </v-container>
    </div>
</template>

<script>
    import axios from 'axios';
    import Equipo from '../models/Equipo';
    import ComponentPrintAsignacion from "../components/ComponentPrintAsignacion.vue";
    import ComponentDevolucion from "../components/ComponentDevolucion";

    export default {

        components: {
            ComponentPrintAsignacion,
            ComponentDevolucion
        },
        mounted() {
            this.$nextTick(() => {
                this.getEstaciones();
            })
        },
        data: () => {
            return {
                printEstacion: null,
                autocomplete: {
                    descriptionLimit: 65,
                    entries: [],
                    isLoading: false,
                    model: null,
                    search: null,
                },
                dataTable: {
                    headers: [
                        {
                            text: 'Numero de estación',
                            align: 'left',
                            //sortable: false,
                            value: 'nro_estacion',
                            width: '1%'
                        }, {
                            text: 'estación',
                            align: 'left',
                            //sortable: false,
                            value: 'nro_estacion',
                            width: '1%'
                        }, {
                            text: 'Notario',
                            align: 'left',
                            //sortable: false,
                            value: 'notario.nombre'
                        },
                    ],
                    estaciones: [],
                },
                dataTableEquipos: {
                    headers: [
                        {
                            align: 'left',
                            //sortable: false,
                            width: "1%"
                        }, {
                            text: 'Descripción',
                            align: 'left',
                            //sortable: false,
                            value: 'descripcion',
                            width: "1%"
                        },
                        {text: 'Número de serie', value: 'nro_serie', width: "1%"},
                        {text: 'Estado', width: "1%"},
                        {text: 'Observaciones al entregar'},
                        {text: 'Observaciones al devolver'},
                    ],
                    equipos: [],
                },
                selected: [],
                estacion: {},
                nro_serie: null,
                search: '',
                estados: [
                    {state: 'Bueno', abbr: 'b'},
                    {state: 'Dañado', abbr: 'd'},
                    {state: 'En Reparación', abbr: 'r'},
                ],
                dialog: false,
                equipo: new Equipo(),

                devuelto: false,

                filtroReservas: [
                    {state: 'Todos', abbr: ''},
                    {state: 'En reserva', abbr: 're'},
                    {state: 'Asignados', abbr: 'as'},
                ],
                filtros: {
                    reserva: null,
                },
            }
        },
        methods: {
            saveObservacion(equipo, value = '') {
                if (this.estacion) {
                    let inputs = {
                        id_equipo: equipo.id,
                        id_estacion: this.estacion.id,
                        observacion: value === 'd' ? equipo.pivot.observacion_devolucion : equipo.pivot.observacion,
                    }
                    axios.post(this.$urlApi.saveObservacion, inputs
                    ).then(response => {
                        this.$toastr('success', '', 'TAREA REALIZADA CON ÉXITO');
                    }).catch(errors => {
                        this.$notifyErrors(errors);
                    });
                } else {
                    let errors = ['Seleccione una Estacion'];
                    this.$notifyErrorsLocal(errors);
                }
            },
            entregar() {
                this.$swal().then(result => {
                    if (result.isConfirmed) {
                        if (this.estacion) {
                            let inputs = {
                                id_estacion: this.estacion.id,
                            }
                            axios.post(this.$urlApi.entregarDevolver, inputs
                            ).then(response => {
                                this.estacion.fecha_hora_entrega = response.data.fecha_hora_entrega;
                                this.$toastr('success', '', 'TAREA REALIZADA CON ÉXITO');
                            }).catch(errors => {
                                this.$notifyErrors(errors);
                            });
                        } else {
                            let errors = ['Seleccione una Estacion'];
                            this.$notifyErrorsLocal(errors);
                        }
                    }
                })
            },
            devolver(datosDevolver) {
                this.$swal().then(result => {
                    if (result.isConfirmed) {
                        if (this.estacion) {
                            let inputs = {
                                id_estacion: this.estacion.id,
                                nro_counter_c_final: datosDevolver.nro_counter_c_final,
                                nro_counter_r_final: datosDevolver.nro_counter_r_final,
                            }
                            axios.post(this.$urlApi.entregarDevolver, inputs
                            ).then(response => {
                                this.estacion.fecha_hora_devolucion = response.data.fecha_hora_devolucion;
                                this.selected.nro_counter_c_final = 1;
                                this.selected.nro_counter_r_final = 1;
                                this.$toastr('success', '', 'TAREA REALIZADA CON ÉXITO');
                            }).catch(errors => {
                                this.$notifyErrors(errors);
                            });
                        } else {
                            let errors = ['Seleccione una Estacion'];
                            this.$notifyErrorsLocal(errors);
                        }
                    }
                })
            },
            /* editTecnico(tecnico) {
                 this.selectedTecnico = tecnico;
                 this.$nextTick(() => {
                     this.$refs.componentTecnico.openDialog();
                 });
             },
             editNotario(notario) {
                 this.selectedNotario = notario;
                 this.$nextTick(() => {
                     this.$refs.componentNotario.openDialog();
                 });
             },*/
            /*create() {
                let _confirm = confirm('Está seguro !!!');
                if (_confirm) {
                    axios.post(this.$urlApi.resourcesKit
                    ).then(response => {
                        this.$toastr('success', '', 'TAREA REALIZADA CON ÉXITO');
                        this.getKits();
                        this.$emit('register-success');
                    }).catch(errors => {
                        this.$notifyErrors(errors);
                    });
                }
            },*/
            getEstaciones() {
                axios.get(this.$urlApi.resourcesEstacion
                ).then(response => {
                    this.dataTable.estaciones = response.data;
                }).catch(errors => {
                    this.$notifyErrors(errors);
                    console.log('error de servidor')
                });
            },
            getEquiposByEstacion() {
                axios.get(this.$urlApi.getEquiposByEstacion + this.estacion.id
                ).then(response => {
                    this.dataTableEquipos.equipos = response.data;
                }).catch(errors => {
                    console.log('error de servidor')
                });

            },
            printDoc(informeDevuelto = '') {
                this.devuelto = informeDevuelto === 'd';
                this.printEstacion = this.estacion;
                this.printEstacion.equipos = this.dataTableEquipos.equipos;
                console.log(this.printEstacion.equipos)
                this.$nextTick(() => {
                    this.$refs.componentPrintProEleRef.printAsignacion();
                });
                /*axios.get(this.$urlApi.getEquiposByEstacion+this.estacion.id
                ).then(response => {

                }).catch(errors => {
                    console.log('error servidor')
                }).then(response => {
                });*/
            },
            removeEquipoOfEstacion(equipo) {
                this.$swal().then(result => {
                    if (result.isConfirmed) {
                        let inputs = {
                            id_estacion: this.estacion.id,
                            id_equipo: equipo.id,
                        }
                        axios.patch(this.$urlApi.removeEquipoOfKit, inputs
                        ).then(response => {
                            // this.getEquiposByKit()
                            this.getEquiposByEstacion();
                        }).catch(errors => {
                            console.log('error de servidor')
                        })
                    }
                })
            },
            addEquipoToEstacion(nro_serie) {
                if (this.estacion) {
                    let inputs = {
                        id_estacion: this.estacion.id,
                        nro_serie: nro_serie
                    };
                    axios.post(this.$urlApi.addEquipoToEstacion, inputs
                    ).then(response => {
                        this.$toastr('success', '', 'TAREA REALIZADA CON ÉXITO');
                        this.getEquiposByEstacion();
                    }).catch(errors => {
                        this.$notifyErrors(errors);
                    });
                } else {
                    let errors = ['Seleccione una Estacion'];
                    this.$notifyErrorsLocal(errors);
                }
            },
            selectedItem(selectedItem) {
                this.selected = [];
                this.estacion = selectedItem;
                this.selected.push(selectedItem);
                this.getEquiposByEstacion();
                this.autocomplete.model = null;
                if (selectedItem && selectedItem.notario_id) {
                    this.getNotarioById(selectedItem.notario_id);
                }
            },
            changeEstadoEquipo(equipo) {
                let inputs = {
                    id_estacion: this.selected[0].id,
                    id_equipo: equipo.id,
                    estado: equipo.estado,
                };
                axios.patch(this.$urlApi.changeEstadoEquipo, inputs
                ).then(response => {
                    this.$toastr('success', '', 'TAREA REALIZADA CON ÉXITO');
                }).catch(errors => {
                    this.$notifyErrors(errors);
                });
            },
            assignNotario(responseNotario) {
                if (!this.selected[0]) {
                    this.$toastr('error', '', 'SELECCIONE UNA ESTACION');
                    return
                }
                let inputs = {
                    id_estacion: this.selected[0].id,
                    notario_id: responseNotario ? responseNotario.id : null,
                };
                axios.patch(this.$urlApi.assignNotario, inputs
                ).then(response => {
                    if (responseNotario) {
                        this.estacion.notario_id = responseNotario.id;
                        this.estacion.notario = responseNotario;
                    } else {
                        this.estacion.notario = null;
                        this.estacion.notario_id = null;
                    }
                    this.$toastr('success', '', 'TAREA REALIZADA CON ÉXITO');
                }).catch(errors => {
                    this.autocomplete.model = null;
                    this.$notifyErrors(errors);
                });
            },
            getNotarioById(id_notario) {
                axios.get(this.$urlApi.resourcesNotario + '/' + id_notario
                ).then(response => {
                    this.autocomplete.model = response.data;
                    this.autocomplete.entries.push(response.data);
                }).catch(errors => {
                    this.$notifyErrors(errors);
                });
            },

            /*devolverEquipos(datosDevolver){
                axios.patch(this.$urlApi.returnEquipment+this.estacion.id,datosDevolver
                ).then(response => {
                    this.selected.nro_counter_c_final = 1;
                    this.selected.nro_counter_r_final = 1;
                    this.$toastr('success', '', 'TAREA REALIZADA CON ÉXITO');
                }).catch(errors => {
                    this.$notifyErrors(errors);
                });
            },*/

            // custom filter to autocomplete
            customFilter: (item, queryText, itemText) => {
                let match = item.nombre_completo.toLocaleLowerCase().indexOf(queryText.toLocaleLowerCase());
                if (match === -1) {
                    match = item.ci.toLocaleLowerCase().indexOf(queryText.toLocaleLowerCase());
                }
                return match > -1;
            }
        },
        computed: {
            autocompleteSearch() {
                return this.autocomplete.search;
            },
            fields() {
                if (!this.autocomplete.model) return [];

                return Object.keys(this.autocomplete.model).map(key => {
                    return {
                        key,
                        value: this.autocomplete.model[key] || 'n/a'
                    }
                })
            },
            items() {
                return this.autocomplete.entries.map(entry => {
                    const nombre_completo = entry.nombre_completo.length > this.autocomplete.descriptionLimit
                        ? entry.nombre_completo.slice(0, this.autocomplete.descriptionLimit) + '...'
                        : entry.nombre_completo;
                    return Object.assign({}, entry, {nombre_completo})
                })
            },
            estacionesFiltradas() {
                let data = []
                if (!this.filtros.reserva || this.filtros.reserva === '') {
                    data = this.dataTable.estaciones
                } else {
                    data = this.dataTable.estaciones
                }

                if (this.filtros.reserva && this.filtros.reserva === 're') {
                    data = data.filter(value => {
                        console.log(value.notario_id)
                        return !value.notario_id
                    })
                }
                if (this.filtros.reserva && this.filtros.reserva === 'as') {
                    data = data.filter(value => {
                        return !!value.notario_id
                    })
                }
                return data
            }
        },
        watch: {
            autocompleteSearch(val) {
                // Items have already been loaded
                if (this.items.length > 1) return;

                // Items have already been requested
                if (this.autocomplete.isLoading) return;

                this.autocomplete.isLoading = true;

                // Lazily load input items
                fetch(this.$urlApi.resourcesNotario + '?contratado=c')
                    .then(res => res.json())
                    .then(res => {
                        // const { count, entries } = res;
                        // console.log(res);
                        this.autocomplete.count = res.length;
                        this.autocomplete.entries = res;
                    })
                    .catch(err => {
                        console.log(err)
                    })
                    .finally(() => (this.autocomplete.isLoading = false))
            }
        }
    }
</script>

<style scoped>
    .invisible {
        visibility: hidden;
    }
</style>
