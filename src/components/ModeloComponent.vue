<template>
    <div>
        <v-dialog v-model="dialog" scrollable persistent max-width="600px">
            <template v-slot:activator="{ on }" v-if="!modeEdit">
                <v-btn v-on="on" class="white--text"
                       color="cyan accent-4"
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
                        <span v-if="!modeEdit" class=title>Nuevo Modelo</span>
                        <span v-else class=title>Editar Modelo</span>
                        <v-btn color="secondary" flat
                               @click="dialog=!dialog"
                               class="square">
                            <v-icon>close</v-icon>
                        </v-btn>
                    </v-layout>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="submit"
                        >
                            <v-text-field
                                    color="blue darken-4"
                                    background-color="blue lighten-5"
                                    box
                                    :rules="rules.nombre"
                                    v-model="modelo.nombre"
                                    required
                                    label="Nombre del modelo"
                            ></v-text-field>
                        </v-form>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" outline @click="dialog = false">Cerrar</v-btn>
                    <v-btn color="info" depressed class="text" @click="submit">Guardar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import axios from 'axios';
    import Modelo from "../models/Modelo";

    export default {
        name:'ComponentPunto',
        props: {
            editData: {
                default: null
            },
            modeEdit: {
                type: Boolean,
                default: false
            }
        },
        data: () => ({
            // view
            dialog: false,
            valid: true,
            rules: {
                nombre: [
                    v => !!v || 'Nombre es requerido',
                    // v => /.+@.+/.test(v) || 'E-mail must be valid'
                ],
            },
            // model
            modelo: new Modelo(),
        }),
        mounted() {
        },
        methods: {
            submit: function () {
                if (this.$refs.form.validate()) {
                    if (!this.modeEdit) {
                        this.create()
                    } else {
                        this.update();
                    }
                }
            },
            create() {
                    axios.post(this.$urlApi.resourcesModelos,
                    this.modelo
                ).then(response => {
                    this.modelo = new Modelo();
                    this.$toastr('success', '', 'TAREA REALIZADA CON ÉXITO');
                    // this.dialog=false;
                    this.$nextTick(() => {
                        this.valid = true;
                    });
                    this.$emit('register-success');
                }).catch(errors => {
                    this.$notifyErrors(errors);
                });
            },
            update() {
                axios.put(this.$urlApi.resourcesModelos + '/' + this.modelo.id,
                    this.modelo
                ).then(response => {
                    Object.assign(this.editData, this.modelo);
                    this.$toastr('success', '', 'TAREA REALIZADA CON ÉXITO');
                    this.dialog = false;
                    this.$nextTick(() => {
                        this.modelo = new Modelo();
                        this.valid = true;
                    });
                    this.$emit('register-success');
                }).catch(errors => {
                    this.$notifyErrors(errors);
                });
            },
            openDialog() {
                Object.assign(this.modelo, this.editData);
                this.dialog = true;
            }
        }
    }
</script>
