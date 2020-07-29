<template>
    <div>
        <v-dialog max-width="600" origin="top center" persistent v-model="dialog">
            <v-card>
                <v-card-title class="grey lighten-2">
                    <v-layout align-center fill-height justify-space-between>
                        <span class=title>Accesorios</span>
                        <v-btn @click="dialog=!dialog" class="square"
                               color="secondary"
                               flat>
                            <v-icon>close</v-icon>
                        </v-btn>
                    </v-layout>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-form ref="formAccesorio" v-model="valid">
                            <v-layout>
                                <v-flex md8 xs12>
                                    <v-select :items="tipos_accesorios"
                                              :rules="rules.tipos_accesorios"
                                              background-color="blue lighten-5"
                                              box
                                              color="blue darken-4"
                                              item-text="state"
                                              item-value="abbr"
                                              label="Tipo de accesorio"
                                              v-model="accesorio.nombre"
                                    ></v-select>
                                </v-flex>
                                <v-flex md4 xs12>
                                    <v-btn @click="submit"
                                           color="info"
                                           depressed
                                           large left round>Registrar
                                    </v-btn>
                                </v-flex>
                            </v-layout>
                        </v-form>
                        <v-data-table
                                :headers="dataTable.headers"
                                :items="dataTable.accesorios"
                                disable-initial-sort
                        >
                            <!--class="elevation-1" elevacion de data table -->
                            <template v-slot:items="props">
                                <td>{{ props.item.nombre }}</td>
                                <td>
                                    <v-btn @click="eliminarAccesorio(props.item)"
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
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click="dialog = false" color="blue darken-1" outline>Cerrar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import Accesorio from '@/models/Accesorio';
    import axios from 'axios';

    export default {
        props: {
            idEquipo: {
                default: null
            }
            /*modeEdit: {
                type: Boolean,
                default: false
            }*/
        },
        data: () => ({
            // view
            dataTable: {
                headers: [
                    {
                        text: 'Accesorio',
                        //sortable: false,
                        value: 'tipo_accesorio'
                    }, {
                        text: 'Acciones',
                        sortable: false,
                        value: ''
                    },
                    // { text: 'Código', value: 'codigo' },
                ],
                accesorios: [],
            },
            valid: false,
            dialog: false,
            rules: {
                tipos_accesorios: [
                    v => !!v || 'Accesorio es requerido',
                    /*v => (v && v.length <= 10) || 'Name must be less than 10 characters'*/
                ],
            },
            tipos_accesorios: [
                {state: 'Cable de conexión USB', abbr: 'Cable de conexión USB'},
                {state: 'Cable de poder', abbr: 'Cable de poder'},
                {state: 'Transformador', abbr: 'Transformador'},
                {state: 'Cable de conexión VGA', abbr: 'Cable de conexión VGA'},
            ],
            // model
            accesorio: new Accesorio()
        }),
        computed: {},
        methods: {
            submit: function () {
                if (this.$refs.formAccesorio.validate()) {
                    axios.post(this.$urlApi.resourcesAccesorio,
                        this.accesorio
                    ).then(response => {
                        this.accesorio = new Accesorio();
                        this.accesorio.equipo_id = this.idEquipo;
                        this.$toastr('success', '', 'TAREA REALIZADA CON ÉXITO');
                        this.valid = true;
                        this.getAccesoriosEquiposById(this.idEquipo);
                    }).catch(errors => {
                        this.$notifyErrors(errors);
                    });
                }
            },
            openDialog() {
                this.accesorio.equipo_id = this.idEquipo;
                this.getAccesoriosEquiposById(this.idEquipo);
                this.dialog = true;
            },
            getAccesoriosEquiposById(idEquipo) {
                axios.get(this.$urlApi.resourcesAccesorio + '/' + idEquipo
                ).then(response => {
                    this.dataTable.accesorios = response.data;
                }).catch(errors => {
                    console.log('error servidor')
                });
            },
            eliminarAccesorio(accesorio) {
                this.$swal().then(result => {
                    if (result.isConfirmed) {
                        axios.delete(this.$urlApi.resourcesAccesorio + '/' + accesorio.id
                        ).then(response => {
                            this.getAccesoriosEquiposById(this.idEquipo)
                            this.$toastr('success', '', 'TAREA REALIZADA CON ÉXITO')
                        }).catch(errors => {
                            this.$notifyErrors(errors)
                            console.log('error servidor')
                        });
                    }
                })
            }
        }
    }
</script>
