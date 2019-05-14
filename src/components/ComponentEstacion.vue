<template>
    <div>
        <v-dialog v-model="dialog" scrollable persistent max-width="800px">
            <template v-slot:activator="{ on }">
                <v-btn color="info" flat
                       class="square" v-on="on" title="Estaciones">
                    <v-icon>pin_drop</v-icon>
                </v-btn>
            </template>
            <v-card>
                <v-card-title class="grey lighten-2">
                    <v-layout align-center justify-space-between fill-height>
                        <span class="title">Estaciones</span>
                        <div>
                            <v-btn color="info" flat
                                   @click="modeCreate=!modeCreate"
                                   class="square">
                                <v-icon>add_box</v-icon>
                            </v-btn>
                            <v-btn color="secondary" flat
                                   @click="dialog=!dialog"
                                   class="square">
                                <v-icon>close</v-icon>
                            </v-btn>
                        </div>
                    </v-layout>
                </v-card-title>
                <v-card-text>
                    <v-container v-if="modeCreate">
                        <v-form ref="formEstaciones" v-model="valid" lazy-validation>
                            <v-text-field
                                    color="blue darken-4"
                                    background-color="blue lighten-5"
                                    box
                                    :rules="rules.descripcion"
                                    v-model.number="estacion.nro_estacion"
                                    label="Número de estación"
                                    required
                            ></v-text-field>
                            <v-text-field
                                    color="blue darken-4"
                                    background-color="blue lighten-5"
                                    box
                                    :rules="rules.descripcion"
                                    v-model.number="estacion.nro_counter_c"
                                    label="Número de counter C"
                                    required
                            ></v-text-field>
                            <v-text-field
                                    color="blue darken-4"
                                    background-color="blue lighten-5"
                                    box
                                    :rules="rules.descripcion"
                                    v-model.number="estacion.nro_counter_r"
                                    label="Número de counter R"
                                    required
                            ></v-text-field>

                            <div class="flex-center">
                                <v-radio-group v-model="estacion.tipo_estacion" style="margin: 0!important;">
                                    <v-layout>
                                        <v-flex>
                                            <v-radio label="Estación Fija" value="f"></v-radio>
                                        </v-flex>
                                        <v-flex>
                                            <v-radio label="Estación Móvil" value="m"></v-radio>
                                        </v-flex>
                                    </v-layout>
                                </v-radio-group>
                            </div>
                        </v-form>
                    </v-container>
                    <v-container v-else>
                        <v-select :items="proEleRef"
                                  @change="getEstaciones"
                                  v-model="selectedProEleRef"
                                  background-color="blue lighten-5"
                                  color="blue darken-4"
                                  item-text="descripcion"
                                  item-value="id"
                                  class="pa-0"
                                  attach
                                  hide-details
                                  label="Extensión"
                        ><template v-slot:item="{ item, index }">
                                <v-layout align-center justify-space-between fill-height>
                                    <v-flex xs8 class="text-truncate">
                                        <span class="v-text-field--full-width">{{item.descripcion }}</span>
                                    </v-flex>
                                    <v-flex class="text-xs-right">
                                        <span>{{item.fecha }}</span>
                                    </v-flex>
                                </v-layout>
                            </template>
                        </v-select>

                        <v-data-table
                            disable-initial-sort
                            :headers="dataTable.headers"
                            :items="dataTable.estaciones"
                    >
                        <template v-slot:items="props">
                            <td>{{ props.item.nro_estacion }}</td>
                            <td>{{ props.item.nro_counter_c }}</td>
                            <td>{{ props.item.nro_counter_r }}</td>
                            <td>
                                <span v-if="props.item.tipo_estacion==='f'">Estación fija</span>
                                <span v-else>Estación móvil</span>
                            </td>
                        </template>
                    </v-data-table>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" outline @click="dialog = false">Cerrar</v-btn>
                    <v-btn v-if="modeCreate"  color="info" depressed class="text" @click="submit">Enviar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import Estacion from '../models/Estacion'
    import axios from 'axios';

    export default {
        data: () => ({
            // view
            dialog: false,
            valid: true,
            modeCreate:false,
            modeEdit:false,
            dataTable: {
                headers: [
                    {
                        text: 'Número de estación',
                        value: 'nro_estacion'
                    },
                    {
                        text: 'Número de counter C',
                        value: 'nro_counter_c'
                    },
                    {
                        text: 'Número de counter R',
                        value: 'nro_counter_r'
                    },
                    {
                        text: 'Tipo de estación',
                        value: 'tipo_estacopm'
                    },
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
            proEleRef:[],
            selectedProEleRef:null,
            // model
            estacion: new Estacion(),
        }),
        mounted() {
            this.getProcesosElectorales();
        },
        methods: {
            submit: function () {
                if (this.$refs.formEstaciones.validate()) {
                    if (!this.modeEdit) {
                        this.create()
                    } else {
                        this.update();
                    }
                }
            },
            getProcesosElectorales() {
                axios.get(this.$urlApi.resourcesProEleRef
                ).then(response => {
                    this.proEleRef = response.data;
                }).catch(errors => {

                });

            },
            getEstaciones() {
                axios.get(this.$urlApi.resourcesEstacion+'/'+this.selectedProEleRef
                ).then(response => {
                    this.dataTable.estaciones = response.data;
                }).catch(errors => {

                });

            },
            create() {
                axios.post(this.$urlApi.resourcesEstacion,
                    this.estacion
                ).then(response => {
                    this.estacion = new Estacion();
                    this.$toastr('success', '', 'TAREA REALIZADA CON ÉXITO');
                    /*this.$nextTick(() => {
                        this.valid = true;
                        this.getProcesosElectorales();
                    });*/
                    this.getEstaciones();
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
