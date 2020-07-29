<template>
<!--    todo: este tiene modal por el momento no se esta usando-->
    <div>
        <v-dialog v-model="dialog" persistent max-width="600px">
            <template v-slot:activator="{ on }">
                <!--<v-btn @click="modeCreate=true"
                       v-on="on"
                       class="white&#45;&#45;text" color="cyan accent-4"
                       depressed
                       round
                       small
                >
                    <v-icon left>add</v-icon>
                    Registrar
                </v-btn>-->
            </template>
            <v-card>
                <v-card-title class="grey lighten-2">
                    <v-layout align-center justify-space-between fill-height>
                        <span class=title>Enviar a mantenimiento</span>
                        <v-btn color="secondary" flat
                               @click="dialog=!dialog"
                               class="square">
                            <v-icon>close</v-icon>
                        </v-btn>
                    </v-layout>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-form ref="form" v-model="valid" lazy-validation>
                            <v-overflow-btn
                                    v-model="mantenimiento.tecnico_id"
                                    :items="tecnicos"
                                    item-text="nombre"
                                    item-value="id"
                                    menu-props="auto"
                                    background-color="blue lighten-5"
                                    color="blue darken-4"
                                    label="Tecnico asignado a Mantenimiento"
                                    editable
                                    :rules="rules.tecnico"
                            ></v-overflow-btn>
                            <v-textarea box
                                        :rows="1"
                                        v-model="mantenimiento.diagnostico_inicial"
                                        background-color="blue lighten-5"
                                        color="blue darken-4"
                                        label="Diagnostico inicial"
                            ></v-textarea>
                            <!--<v-select :items="['Correctivo','Preventivo']"
                                      background-color="blue lighten-5"
                                      v-model="mantenimiento.tipo_mantenimiento"
                                      color="blue darken-4"
                                      :rules="rules.tipo_mantenimiento"
                                      box
                                      label="Seleccione tipo de mantenimiento"
                            ></v-select>-->
                            <v-textarea box
                                        background-color="blue lighten-5"
                                        :rows="1"
                                        v-model="mantenimiento.observaciones"
                                        color="blue darken-4"
                                        label="Observaciones"
                            ></v-textarea>
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
    import Mantenimiento from '../models/Matenimiento'
    import axios from 'axios';

    export default {
        props: {
            equipo: {
                default: {}
            }

        },
        mounted(){
            this.getTecnicos()
        },
        data: () => ({
            // view
            dialog: false,
            valid: true,
            estados: [
                {state: 'Bueno', abbr: 'b'},
                {state: 'Dañado', abbr: 'd'},
                {state: 'En Reparación', abbr: 'r'},
            ],
            tipos: [
                {state: 'Equipo', abbr: 'e'},
                {state: 'Otro', abbr: 'o'},
            ],
            selectedTipoEquipo:null,

            rules: {
                tecnico: [
                    v => !!v || 'Tecnico es requerido',
                    // v => /.+@.+/.test(v) || 'E-mail must be valid'
                ],

                tipo_mantenimiento: [
                    v => !!v || 'Tipo de mantenimiento es requerido',
                    // v => /.+@.+/.test(v) || 'E-mail must be valid'
                ]
            },
            // model
            mantenimiento: new Mantenimiento(),
            tecnicos:[]
        }),
        methods: {
            getTecnicos(){
              axios.get(this.$urlApi.resourcesTecnico).then( response =>{
                  this.tecnicos = response.data
              })
            },
            submit: function () {
                if (this.$refs.form.validate()) {
                    if (!this.modeEdit) {
                        this.mantenimiento.equipo_id=this.equipo.id
                        this.create()
                    }
                }
            },
            create(){
                axios.post(this.$urlApi.resourcesMantenimiento,
                    this.mantenimiento
                ).then(response => {
                    this.mantenimiento = new Mantenimiento();
                    this.$toastr('success', '', 'TAREA REALIZADA CON ÉXITO');
                    this.dialog=false;
                    this.valid = true;
                    this.$emit('register-success');
                }).catch(errors => {
                    this.$notifyErrors(errors);
                });
            },
            openDialog() {
                // Object.assign(this.equipo, this.editData);
                this.dialog = true;
            }
        }
    }
</script>
