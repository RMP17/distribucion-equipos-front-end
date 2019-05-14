<template>
    <div>
        <v-dialog v-model="dialog" scrollable persistent max-width="800px">
            <template v-slot:activator="{ on }">
                <v-btn color="info" flat
                       class="square" v-on="on" title="Procesos Electorales">
                    <v-icon>how_to_vote</v-icon>
                </v-btn>
            </template>
            <v-card>
                <v-card-title class="grey lighten-2">
                  <v-layout align-center justify-space-between fill-height>
                    <span class=title>Procesos Electorales</span>
                    <v-btn color="secondary" flat
                           @click="dialog=!dialog"
                           class="square"><v-icon >close</v-icon></v-btn>
                  </v-layout>
                </v-card-title>
                <v-card-text>

                    <v-form ref="formProcesosElectorales" v-model="valid" lazy-validation
                    >
                        <v-container pa-0 grid-list-sm>
                            <v-layout row wrap>
                                <v-flex xs12 md4>
                                    <v-text-field
                                            color="blue darken-4"
                                            background-color="blue lighten-5"
                                            box
                                            :rules="rules.descripcion"
                                            v-model="procesoElectoral.descripcion"
                                            label="Descripción del Proceso Electoral"
                                    ></v-text-field>
                                </v-flex>
                                <v-flex xs12 md4>
                                    <v-menu
                                            v-model="menu"
                                            :close-on-content-click="false"
                                            :nudge-right="40"
                                            lazy
                                            transition="scale-transition"
                                            offset-y
                                            full-width
                                            min-width="290px"
                                    >
                                        <template v-slot:activator="{ on }" >
                                            <v-text-field
                                                    v-model="procesoElectoral.fecha"
                                                    :rules="rules.fecha"
                                                    background-color="blue lighten-5"
                                                    label="Seleccione una fecha"
                                                    append-icon="event"
                                                    color="blue darken-4"
                                                    box
                                                    readonly
                                                    v-on="on"
                                            ></v-text-field>
                                        </template>
                                        <v-date-picker v-model="procesoElectoral.fecha"
                                                       @input="menu = false"
                                                       locale="es-mx"
                                                       header-color="primary"
                                                       no-title></v-date-picker>
                                    </v-menu>
                                </v-flex>
                                <v-flex d-flex xs12 md4 text-xs-center>
                                    <v-btn color="info" depressed large @click="submit">Registrar</v-btn>
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-form>

                    <v-data-table
                            disable-initial-sort
                            :headers="dataTable.headers"
                            :items="dataTable.procesosElectorales"
                    >
                        <template v-slot:items="props">
                            <td>{{ props.item.descripcion }}</td>
                            <td>{{ props.item.fecha }}</td>
                            <td>
                                <span v-if="props.item.estado">En proceso</span>
                                <span v-else>Finalizado</span>
                            </td>
                        </template>
                        <v-alert v-slot:no-results :value="true" color="error" icon="warning">
                            Your search for "{{ search }}" found no results.
                        </v-alert>
                    </v-data-table>

                </v-card-text>
                <v-card-actions >
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" outline @click="dialog = false">Cerrar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import ProcesoElectoral from '../models/ProcesoElectoral'
    import axios from 'axios';

    export default {
        data: () => ({
            // view
            dialog: false,
            menu: false,
            valid: true,
            dataTable:{
                headers: [
                    {
                        text: 'Descripción',
                        value: 'descripcion'
                    },
                    { text: 'Fecha', value: 'fecha' },
                    { text: 'Estado', value: 'estado' },
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
        }),
        mounted(){
            this.getProcesosElectorales();
        },
        methods: {
            submit: function () {
                if (this.$refs.formProcesosElectorales.validate()) {
                    if(!this.modeEdit){
                        this.create()
                    } else {
                        this.update();
                    }
                }
            },
            getProcesosElectorales(){
                axios.get(this.$urlApi.resourcesProEleRef
                ).then(response => {
                    this.dataTable.procesosElectorales = response.data;
                }).catch(errors => {

                });

            },
            create(){
                axios.post(this.$urlApi.resourcesProEleRef,
                    this.procesoElectoral
                ).then(response => {
                    this.procesoElectoral = new ProcesoElectoral();
                    this.$toastr('success', '', 'TAREA REALIZADA CON ÉXITO');
                    this.$nextTick(() => {
                        this.valid = true;
                        this.getProcesosElectorales();
                    });
                    this.$emit('register-success');
                }).catch(errors => {
                    this.$notifyErrors(errors);
                });
            },
            /*update(){
                axios.put(this.$urlApi.resourcesTecnico+'/'+this.tecnico.id,
                    this.tecnico
                ).then(response => {
                    Object.assign(this.editData, this.tecnico);
                    this.$toastr('success', '', 'TAREA REALIZADA CON ÉXITO');
                    this.dialog=false;
                    this.$nextTick(() => {
                        this.tecnico = new Tecnico();
                        this.valid = true;
                    });
                    this.$emit('register-success');
                }).catch(errors => {
                    this.$notifyErrors(errors);
                });
            },*/
            /*openDialog(){
                Object.assign(this.tecnico,this.editData);
                this.dialog=true;
            }*/
        }
    }
</script>
