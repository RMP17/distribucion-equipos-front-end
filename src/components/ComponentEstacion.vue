<template>
    <div>
        <v-dialog v-model="dialog" scrollable persistent max-width="800px">
            <template v-slot:activator="{ on }" v-if="!modeEdit">
                <v-btn v-on="on" class="white--text" color="cyan accent-4"
                       depressed
                       round
                       small
                >
                    <v-icon left>add</v-icon>
                    Registrar
                </v-btn>
            </template>
            <v-card>
                <v-card-title class="grey lighten-2">
                    <v-layout align-center justify-space-between fill-height>
                        <span class="title">Nueva Estación</span>
                        <div>
                            <v-btn color="secondary" flat
                                   @click="dialog=!dialog"
                                   class="square">
                                <v-icon>close</v-icon>
                            </v-btn>
                        </div>
                    </v-layout>
                </v-card-title>
                <v-card-text>
                    <v-container>
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
                                    type="number"
                                    :rules="rules.counter"
                                    v-model.number="estacion.nro_counter_c"
                                    label="Counter C"
                                    required
                            ></v-text-field>
                            <v-text-field
                                    color="blue darken-4"
                                    background-color="blue lighten-5"
                                    box
                                    :rules="rules.counter"
                                    type="number"
                                    v-model.number="estacion.nro_counter_r"
                                    label="Counter R"
                                    required
                            ></v-text-field>
                            <v-overflow-btn
                                    v-model="estacion.punto_empadronamiento_id"
                                    :items="puntos"
                                    :rules="rules.punto_empadronamiento_id"
                                    item-text="descripcion"
                                    item-value="id"
                                    background-color="blue lighten-5"
                                    color="blue darken-4"
                                    label="Punto de Empadronamiento"
                                    editable
                            ></v-overflow-btn>
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
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" outline @click="dialog = false">Cerrar</v-btn>
                    <v-btn color="info" depressed class="text" @click="submit">Enviar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import Estacion from '../models/Estacion'
    import axios from 'axios';

    export default {
        props: {
            editData:{
                default:null
            },
            modeEdit:{
                type:Boolean,
                default:false
            }
        },
        data: () => ({
            // view
            dialog: false,
            valid: true,
            rules: {
                descripcion: [
                    v => !!v || 'Descripción es requerido',
                    /*v => (v && v.length <= 10) || 'Name must be less than 10 characters'*/
                ],
                counter: [
                    v => v>=0 || 'Counter debe ser mayor o igual 0',
                    /*v => (v && v.length <= 10) || 'Name must be less than 10 characters'*/
                ],
                fecha: [
                    v => !!v || 'Fecha es requerido',
                    // v => /.+@.+/.test(v) || 'E-mail must be valid'
                ],
                punto_empadronamiento_id: [
                    v => !!v || 'Punto de empadronamiento es requerido',
                    // v => /.+@.+/.test(v) || 'E-mail must be valid'
                ]
            },
            proEleRef:[],
            selectedProEleRef:null,
            // model
            estacion: new Estacion(),
            puntos:[]
        }),
        mounted() {
            // this.getProcesosElectorales();
            this.getPuntos()
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
            getPuntos(){
                axios.get(this.$urlApi.resourcesPuntos).then(response=>{
                    this.puntos = response.data
                })
            },
            create() {
                axios.post(this.$urlApi.resourcesEstacion,
                    this.estacion
                ).then(response => {
                    this.estacion = new Estacion();
                    this.$toastr('success', '', 'TAREA REALIZADA CON ÉXITO');
                    this.$nextTick(() => {
                        this.valid = true;
                    });
                    this.$emit('register-success');
                }).catch(errors => {
                    this.$notifyErrors(errors);
                });
            },
            update(){
                axios.put(this.$urlApi.resourcesEstacion+'/'+this.estacion.id,
                    this.estacion
                ).then(response => {
                    Object.assign(this.editData, this.estacion);
                    this.$toastr('success', '', 'TAREA REALIZADA CON ÉXITO');
                    this.dialog=false;
                    this.$nextTick(() => {
                        this.estacion = new Estacion();
                        this.valid = true;
                    });
                    this.$emit('register-success');
                }).catch(errors => {
                    this.$notifyErrors(errors);
                });
            },
            openDialog(){
                Object.assign(this.estacion,this.editData);
                this.dialog=true;
            }
        }
    }
</script>
