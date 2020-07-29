<template>
    <v-form @submit.prevent="submit" lazy-validation ref="formProcesosElectorales" v-model="valid">
        <v-card flat>
            <v-card-text>
                <v-text-field
                        :rules="rules.descripcion"
                        background-color="blue lighten-5"
                        box
                        color="blue darken-4"
                        label="Descripción del Proceso Electoral"
                        v-model="procesoElectoral.descripcion"
                ></v-text-field>
                <v-select :items="tiposProcesos"
                          box
                          v-model="procesoElectoral.tipo"
                          color="blue darken-4"
                          background-color="blue lighten-5"
                          label="Seleccione tipo de proceso"
                ></v-select>
                <v-menu
                        :close-on-content-click="false"
                        :nudge-right="40"
                        full-width
                        lazy
                        min-width="290px"
                        offset-y
                        transition="scale-transition"
                        v-model="menu"
                >
                    <template v-slot:activator="{ on }">
                        <v-text-field
                                :rules="rules.fecha"
                                append-icon="event"
                                background-color="blue lighten-5"
                                box
                                color="blue darken-4"
                                label="Fecha de Inicio del proceso"
                                readonly
                                v-model="procesoElectoral.fecha"
                                v-on="on"
                        ></v-text-field>
                    </template>
                    <v-date-picker @input="menu = false"
                                   header-color="primary"
                                   locale="es-mx"
                                   no-title
                                   v-model="procesoElectoral.fecha"></v-date-picker>
                </v-menu>
                <v-menu
                        :close-on-content-click="false"
                        :nudge-right="40"
                        full-width
                        lazy
                        min-width="290px"
                        offset-y
                        transition="scale-transition"
                        v-model="menu2"
                >
                    <template v-slot:activator="{ on }">
                        <v-text-field
                                :rules="rules.fecha"
                                append-icon="event"
                                background-color="blue lighten-5"
                                box
                                color="blue darken-4"
                                label="Fecha final del proceso"
                                readonly
                                v-model="procesoElectoral.fecha_final"
                                v-on="on"
                        ></v-text-field>
                    </template>
                    <v-date-picker @input="menu2 = false"
                                   header-color="primary"
                                   locale="es-mx"
                                   no-title
                                   v-model="procesoElectoral.fecha_final"></v-date-picker>
                </v-menu>
            </v-card-text>
            <v-card-actions>
                <v-layout justify-center row>
                    <v-btn @click="submit" class="white--text"
                           color="info" depressed round
                    >Guardar</v-btn>

                    <v-btn @click="limpiar" color="error"
                           depressed outline round
                    >{{ modeEdit ? 'Cancelar':'Limipiar'}}</v-btn>
                </v-layout>
            </v-card-actions>
        </v-card>
    </v-form>
</template>

<script>
    import ProcesoElectoral from '../../models/ProcesoElectoral'
    import axios from 'axios';

    export default {
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
            menu: false,
            menu2: false,
            valid: true,
            tiposProcesos: ['Nacional','Departamental','Municipal'],
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
        created() {
            if (this.modeEdit) {
                this.procesoElectoral = {...this.editData}
            }        },
        mounted() {
        },
        methods: {
            submit: function () {
                if (this.$refs.formProcesosElectorales.validate()) {
                    if (!this.modeEdit) {
                        this.create()
                    } else {
                        this.update();
                    }
                }
            },
            create() {
                axios.post(this.$urlApi.resourcesProEleRef,
                    this.procesoElectoral
                ).then(response => {
                    this.procesoElectoral = new ProcesoElectoral();
                    this.$toastr('success', '', 'TAREA REALIZADA CON ÉXITO');
                    this.$nextTick(() => {
                        this.valid = true;
                    });
                    this.$emit('register-success');
                }).catch(errors => {
                    this.$notifyErrors(errors);
                });
            },
            update() {
                axios.put(this.$urlApi.resourcesProEleRef + '/' + this.procesoElectoral.id,
                    this.procesoElectoral
                ).then(response => {
                    this.$toastr('success', '', 'TAREA REALIZADA CON ÉXITO');
                    this.$nextTick(() => {
                        this.procesoElectoral = new ProcesoElectoral();
                    });
                    this.$emit('register-success');
                }).catch(errors => {
                    this.$notifyErrors(errors);
                });
            },
            limpiar() {
                this.procesoElectoral = new ProcesoElectoral
                this.$emit('cancel')
            }
            /*openDialog(){
                Object.assign(this.tecnico,this.editData);
                this.dialog=true;
            }*/
        }
    }
</script>
