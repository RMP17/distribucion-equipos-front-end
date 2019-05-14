<template>
    <v-container grid-list-md fluid>
        <v-layout row wrap>
            <v-flex md6>
                <v-layout row>
                    <component-p-e-r/>
                    <component-estacion/>
                    <v-btn color="info" flat
                           title="Nuevo Kit"
                           @click="create"
                           class="square">
                        <v-icon>devices_other</v-icon>
                    </v-btn>
                    <v-text-field
                            color="blue darken-4"
                            background-color="blue lighten-5"
                            class="pt-0 pr-1"
                            v-model="search"
                            append-icon="search"
                            label="Buscar..."
                            single-line
                            hide-details
                    ></v-text-field>
                </v-layout>
                <v-data-table
                        disable-initial-sort
                        v-model="selected"
                        :headers="dataTable.headers"
                        :items="dataTable.kits"
                        :search="search"
                >
                    <template v-slot:items="props">
                        <tr :active="props.selected" @click="selectedItem(props.item)">
                            <td>{{ props.item.id}}</td>
                        </tr>
                    </template>
                </v-data-table>
            </v-flex>
            <v-flex md6>
                <v-layout row>
                    <v-text-field
                            color="blue darken-4"
                            background-color="blue lighten-5"
                            class="pt-0 pr-1 pl-1"
                            label="Introduzca el número de serie del equipo"
                            single-line
                            hide-details
                            append-icon="laptop_windows"
                            @keyup.enter="addEquipoToKit($event.target.value)"
                    ></v-text-field>
                </v-layout>
                <v-data-table

                        disable-initial-sort
                        :headers="dataTableEquipos.headers"
                        :items="dataTableEquipos.equipos"
                >
                    <template v-slot:items="props">

                        <td>
                            <v-btn color="error" flat
                                   title="Quitar equipo"
                                   @click="removeEquipoOfKit(props.item)"
                                   class="square">
                                <v-icon>remove</v-icon>
                            </v-btn>
                            {{ props.item.descripcion}}
                        </td>
                        <td>{{ props.item.modelo}}</td>
                        <td>{{ props.item.nro_serie}}</td>
                        <td width="25%">
                            <v-select :items="estados"
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
                            ></v-select>
                            <!--<span v-if="props.item.estado === 'b'">Bien</span>
                            <span v-if="props.item.estado === 'r'">En reparación</span>
                            <span v-if="props.item.estado === 'd'">De baja</span>-->
                        </td>
                    </template>
                </v-data-table>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import axios from 'axios';
    import ComponentPER from '../components/ComponentProcesosElectoralesReferendo.vue';
    import ComponentEstacion from '../components/ComponentEstacion.vue';
    import Equipo from '../models/Equipo';

    export default {

        components: {
            ComponentPER,
            ComponentEstacion
        },
        mounted() {
            this.$nextTick(() => {
                this.getKits();
            })
        },
        data: () => {
            return {
                dataTable: {
                    headers: [
                        {
                            text: 'Numero de Kit',
                            align: 'left',
                            //sortable: false,
                            value: 'id'
                        },
                    ],
                    kits: [],
                },
                dataTableEquipos: {
                    headers: [
                        {
                            text: 'Descripción',
                            align: 'left',
                            //sortable: false,
                            value: 'descripcion'
                        },
                        {text: 'Modelo', value: 'modelo'},
                        {text: 'Número de serie', value: 'nro_serie'},
                        {text: 'Estado', value: 'estado'},
                    ],
                    equipos: [],
                },
                selected: [],
                kit: null,
                nro_serie:null,
                search: '',
                estados: [
                    {state: 'Bien', abbr: 'b'},
                    {state: 'En Reparación', abbr: 'e'},
                    {state: 'De baja', abbr: 'd'},
                ],
                equipo: new Equipo()
            }
        },
        methods: {
            editTecnico(tecnico) {
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
            },
            create() {
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
            },
            getKits() {
                axios.get(this.$urlApi.resourcesKit
                ).then(response => {
                    this.dataTable.kits = response.data;
                }).catch(errors => {
                    console.log('error de servidor')
                });
            },
            getEquiposByKit() {
                axios.get(this.$urlApi.getEquiposByKit+this.kit.id
                ).then(response => {
                    this.dataTableEquipos.equipos = response.data;
                }).catch(errors => {
                    console.log('error de servidor')
                });

            },
            removeEquipoOfKit(equipoKit) {
                let _confirm = confirm('¿Está seguro?');
                if(_confirm) {
                    let inputs={
                        id_kit:equipoKit.id_kit,
                        id_equipo:equipoKit.id_equipo,
                    };
                    axios.patch(this.$urlApi.removeEquipoOfKit, inputs
                    ).then(response => {
                        this.getEquiposByKit()
                    }).catch(errors => {
                        console.log('error de servidor')
                    });
                }
            },
            addEquipoToKit(nro_serie) {
                if(this.kit){
                    let inputs = Object.assign({}, this.kit);
                    inputs.nro_serie = nro_serie;
                    axios.post(this.$urlApi.addEquipoToKit, inputs
                    ).then(response => {
                        this.$toastr('success', '', 'TAREA REALIZADA CON ÉXITO');
                        this.getEquiposByKit();
                    }).catch(errors => {
                        this.$notifyErrors(errors);
                    });
                } else {
                    let errors=['Seleccione un kit'];
                    this.$notifyErrorsLocal(errors);
                }
            },
            selectedItem(selectedItem) {
                this.selected = [];
                this.kit = selectedItem;
                this.selected.push(selectedItem);
                this.getEquiposByKit();
            },
            changeEstadoEquipo(equipo){
                console.log(equipo);
                let inputs={
                    id_kit: this.selected[0].id,
                    id_equipo: equipo.id,
                    estado: equipo.estado,
                };
                axios.patch(this.$urlApi.changeEstadoEquipo, inputs
                ).then(response => {
                    this.$toastr('success', '', 'TAREA REALIZADA CON ÉXITO');
                }).catch(errors => {
                    this.$notifyErrors(errors);
                });
            }
        },
        computed: {
        }
    }
</script>