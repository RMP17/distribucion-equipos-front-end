<template>
    <div>
        <v-dialog v-model="dialog" scrollable persistent max-width="600px">
            <template v-slot:activator="{ on }" v-if="!modeEdit">
                <!--<v-btn color="info" flat
                       class="square" v-on="on" title="Nuevo técnico">
                    <v-icon size="20">build</v-icon>
                </v-btn>-->
                <v-btn @click="modeCreate=true" class="white--text" color="cyan accent-4"
                       depressed
                       v-on="on"
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
                    <span v-if="!modeEdit" class=title>Nuevo Técnico</span>
                    <span v-else class=title>Editar Técnico</span>
                    <v-btn color="secondary" flat
                           @click="dialog=!dialog"
                           class="square"><v-icon >close</v-icon></v-btn>
                  </v-layout>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-form ref="form" v-model="valid" lazy-validation
                        >
                            <v-text-field
                                    color="blue darken-4"
                                    background-color="blue lighten-5"
                                    box
                                    :rules="rules.ci"
                                    v-model="tecnico.ci"
                                    label="Cédula de identidad"
                            ></v-text-field>
                            <v-select :items="extension"
                                      v-model="tecnico.extension"
                                      background-color="blue lighten-5"
                                      color="blue darken-4"
                                      item-text="state"
                                      item-value="abbr"
                                      :rules="rules.extension"
                                      box
                                      label="Expedido"
                            ></v-select>
                            <v-text-field
                                    color="blue darken-4"
                                    background-color="blue lighten-5"
                                    :rules="rules.nombre"
                                    v-model="tecnico.nombre"
                                    label="Nombre"
                                    box
                                    required
                            ></v-text-field>
                            <v-text-field
                                    color="blue darken-4"
                                    background-color="blue lighten-5"
                                    v-model="tecnico.apellido1"
                                    label="Primer Apellido"
                                    box
                                    required
                            ></v-text-field>
                            <v-text-field
                                    color="blue darken-4"
                                    background-color="blue lighten-5"
                                    v-model="tecnico.apellido2"
                                    label="Segundo Apellido"
                                    box
                                    required
                            ></v-text-field>
                            <v-text-field
                                    color="blue darken-4"
                                    v-model="tecnico.celular"
                                    background-color="blue lighten-5"
                                    :rules="rules.celular"
                                    label="Celular"
                                    box
                            ></v-text-field>
                            <v-select :items="telefonica"
                                      v-model="tecnico.empresa_telefonica"
                                      background-color="blue lighten-5"
                                      color="blue darken-4"
                                      box
                                      label="Empresa telefónica"
                            ></v-select>
                            <v-overflow-btn
                                    v-model="tecnico.profesion"
                                    :items="profesiones"
                                    item-text="nombre"
                                    item-value="id"
                                    background-color="blue lighten-5"
                                    color="blue darken-4"
                                    label="Profesión"
                                    editable
                                    return-object
                            ></v-overflow-btn>
                            <!--item-value="text"-->
                        </v-form>
                    </v-container>
                </v-card-text>
                <v-card-actions >
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" outline @click="dialog = false">Cerrar</v-btn>
                    <v-btn color="info" depressed class="text" @click="submit">Enviar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import Tecnico from '../models/Tecnico'
    import axios from 'axios';

    export default {
        name:'TecnicoComponent',
        props: {
            editData:{
                default:null
            },
            modeEdit:{
                type:Boolean,
                default:false
            },
            profesiones:{
                type:Array,
                default:[]
            }
        },
        data: () => ({
            // view
            dialog: false,
            valid: true,
            rules: {
                ci: [
                    v => !!v || 'Cédula de identidad es requerido',
                    /*v => (v && v.length <= 10) || 'Name must be less than 10 characters'*/
                ],
                extension: [
                    v => !!v || 'Extensión requerido',
                    // v => /.+@.+/.test(v) || 'E-mail must be valid'
                ],
                nombre: [
                    v => !!v || 'Nombre es requerido',
                    // v => /.+@.+/.test(v) || 'E-mail must be valid'
                ],
                apellido1: [
                    v => !!v || 'Primer Apellido es requerido',
                    // v => /.+@.+/.test(v) || 'E-mail must be valid'
                ],
                celular: [
                    v => !!v || 'Celular es requerido',
                    // v => /.+@.+/.test(v) || 'E-mail must be valid'
                ],
                profesion: [
                    v => !!v || 'Prefesion es requerido',
                ],
            },

            extension: [
                {state: 'LP - La Paz', abbr: 'LP'},
                {state: 'OR - Oruro', abbr: 'OR'},
                {state: 'PT - Potosi', abbr: 'PT'},
                {state: 'CB - Cochabamba', abbr: 'CB'},
                {state: 'SC - Santa Cruz', abbr: 'SC'},
                {state: 'BN - Beni', abbr: 'BN'},
                {state: 'PA - Pando', abbr: 'PA'},
                {state: 'TJ - Tarija', abbr: 'TJ'},
                {state: 'CH - Chuquisaca', abbr: 'CH'},
            ],
            telefonica: [
                'Entel',
                'Viva',
                'Tigo',
            ],
            // model
            tecnico: new Tecnico(),
        }),
        methods: {
            submit: function () {
                if (this.$refs.form.validate()) {
                    this.tecnico.profesion_id = this.tecnico.profesion.id || null
                    if(!this.modeEdit){
                        this.create()
                    } else {
                        this.update();
                    }
                }
            },
            create(){
                axios.post(this.$urlApi.resourcesTecnico,
                    this.tecnico
                ).then(response => {
                    this.tecnico = new Tecnico();
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
            },
            openDialog(){
                Object.assign(this.tecnico,this.editData);
                this.dialog=true;
            }
        }
    }
</script>
