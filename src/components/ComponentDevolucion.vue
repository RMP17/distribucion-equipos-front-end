<template>
    <div>
        <v-dialog v-model="dialog" scrollable persistent max-width="600px">
            <template v-slot:activator="{ on }">
                <v-btn v-on="on"
                       :disabled="disabled"
                       class="white--text" color="cyan accent-4"
                       depressed
                       round
                       small
                >
                    <v-icon left>check</v-icon>
                    Devolver
                </v-btn>
            </template>
            <v-card>
                <v-card-title class="grey lighten-2">
                    <v-layout align-center justify-space-between fill-height>
                        <span class=title>Devolver equipos</span>
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
                                    :rules="rules.nro_counter_r_final"
                                    v-model="devolucion.nro_counter_r_final"
                                    required
                                    type="number"
                                    label="Counter R Final"
                            ></v-text-field>
                            <v-text-field
                                    color="blue darken-4"
                                    background-color="blue lighten-5"
                                    box
                                    :rules="rules.nro_counter_c_final"
                                    v-model="devolucion.nro_counter_c_final"
                                    required
                                    type="number"
                                    label="Counter C Final"
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

    export default {
        name:'ComponentDevolucion',
        props:['disabled'],
        data: () => ({
            // view
            dialog: false,
            valid: true,
            rules: {
                nro_counter_r_final: [
                    v => !!v || 'Counter R Final es requerido',
                ],
                nro_counter_c_final: [
                    v => !!v || 'Counter C Final es requerido',
                ],
            },
            // model
            devolucion: {
                nro_counter_r_final:null,
                nro_counter_c_final:null,
            },
        }),
        mounted() {
        },
        methods: {
            submit: function () {
                if (this.$refs.form.validate()) {
                    this.$emit('success',this.devolucion)
                    this.dialog = false;
                }
            },
        }
    }
</script>
