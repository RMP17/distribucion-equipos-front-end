<template>
    <v-card flat>
        <v-card-text>
            <v-form lazy-validation ref="form" v-model="valid">
                <v-text-field
                        @keydown.enter="getEquipoByNroSerie"
                        append-icon="search"
                        background-color="blue lighten-5"
                        box
                        color="blue darken-4"
                        label="Codigo activo (Presione ENTER para buscar)"
                        v-model="searchEquipo"
                ></v-text-field>
                <v-text-field
                        :value="(equipo && equipo.tipo_equipo) ?equipo.tipo_equipo.nombre:''"
                        background-color="blue lighten-5"
                        box
                        color="blue darken-4"
                        label="Tipo de Dispositivo"
                        readonly
                >
                </v-text-field>
                <v-overflow-btn
                        :items="tecnicos"
                        :rules="rules.tecnico"
                        background-color="blue lighten-5"
                        color="blue darken-4"
                        editable
                        item-text="nombre"
                        item-value="id"
                        label="Tecnico asignado a Mantenimiento"
                        menu-props="auto"
                        v-model="mantenimiento.tecnico_id"
                ></v-overflow-btn>
                <v-textarea :rows="1"
                            background-color="blue lighten-5"
                            box
                            color="blue darken-4"
                            label="Diagnostico inicial"
                            v-model="mantenimiento.diagnostico_inicial"
                ></v-textarea>
                <!--<v-select :items="['Correctivo','Preventivo']"
                          background-color="blue lighten-5"
                          v-model="mantenimiento.tipo_mantenimiento"
                          color="blue darken-4"
                          :rules="rules.tipo_mantenimiento"
                          box
                          label="Seleccione tipo de mantenimiento"
                ></v-select>-->
                <v-textarea :rows="1"
                            background-color="blue lighten-5"
                            box
                            color="blue darken-4"
                            label="Observaciones"
                            v-model="mantenimiento.observaciones"
                ></v-textarea>
            </v-form>
        </v-card-text>
        <v-card-actions justify-center>
            <v-layout justify-center>
                <v-btn @click="submit" class="text" color="info" depressed>Enviar a Mantenimiento</v-btn>
            </v-layout>
        </v-card-actions>
    </v-card>

</template>

<script>
    import Mantenimiento from '../../models/Matenimiento'
    import Equipo from '../../models/Equipo'
    import axios from 'axios';

    export default {
        mounted() {
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
            selectedTipoEquipo: null,

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
            tecnicos: [],
            equipo: new Equipo(),
            searchEquipo: ''
        }),
        methods: {
            getTecnicos() {
                axios.get(this.$urlApi.resourcesTecnico).then(response => {
                    this.tecnicos = response.data
                })
            },
            getEquipoByNroSerie() {
                if (this.searchEquipo) {
                    axios.get(this.$urlApi.getEquipoByNroSerie + this.searchEquipo).then(response => {
                        if (response.data.id) {
                            this.equipo = response.data
                        } else {
                            this.equipo = new Equipo
                            this.$toastr('error','','NO SE ENCONTRO DISPOSITIVO')
                        }
                    })
                }
            },
            submit: function () {
                if (this.$refs.form.validate()) {
                    if (!this.modeEdit) {
                        this.mantenimiento.equipo_id = this.equipo.id
                        this.create()
                    }
                }
            },
            create() {
                axios.post(this.$urlApi.resourcesMantenimiento,
                    this.mantenimiento
                ).then(response => {
                    this.mantenimiento = new Mantenimiento();
                    this.equipo = new Equipo();
                    this.$toastr('success', '', 'TAREA REALIZADA CON ÉXITO');
                    this.dialog = false;
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
