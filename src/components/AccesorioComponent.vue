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
                        <span v-if="!modeEdit" class=title>Nuevo Accesorio</span>
                        <span v-else class=title>Editar Accesorio</span>
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
                                    v-model="accesorio.nombre"
                                    required
                                    label="Nombre del accesorio"
                            ></v-text-field>
                        </v-form>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" outline @click="dialog = false">Cerrar</v-btn>
                    <v-btn color="info" depressed class="text" type="submit">Guardar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import axios from 'axios';
    import Accesorio from "../models/Accesorio";

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
            accesorio: new Accesorio(),
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
                axios.post(this.$urlApi.resourcesAccesorio,
                    this.accesorio
                ).then(response => {
                    this.accesorio = new Accesorio();
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
                axios.put(this.$urlApi.resourcesAccesorio + '/' + this.accesorio.id,
                    this.accesorio
                ).then(response => {
                    Object.assign(this.editData, this.accesorio);
                    this.$toastr('success', '', 'TAREA REALIZADA CON ÉXITO');
                    this.dialog = false;
                    this.$nextTick(() => {
                        this.accesorio = new Accesorio();
                        this.valid = true;
                    });
                    this.$emit('register-success');
                }).catch(errors => {
                    this.$notifyErrors(errors);
                });
            },
            openDialog() {
                Object.assign(this.accesorio, this.editData);
                this.dialog = true;
            }
        }
    }
</script>
