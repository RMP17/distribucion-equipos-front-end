<template>
    <v-form lazy-validation ref="form" v-model="valid">
        <v-layout justify-center row>
            <v-flex xs4>
                <v-subheader class="mt-1 success--text subheading">Tipo de Dispositivo a registrar</v-subheader>
            </v-flex>
            <v-flex xs3>
                <v-select :items="tiposEquipos"
                          :rules="rules.tipos_equipos"
                          background-color="blue lighten-5"
                          box
                          color="blue darken-4"
                          item-text="nombre"
                          item-value="id"
                          label="Seleccione tipo de dispositivo"
                          v-model="equipo.tipo_equipo_id"
                ></v-select>
            </v-flex>
        </v-layout>
        <v-tabs color="cyan"
                dark
                slider-color="yellow"
                v-model="active"
        >
            <v-tab ripple>
                Registrar un nuevo Dispositivo
            </v-tab>
            <v-tab>
                Agregar Accesorios
            </v-tab>

            <v-tab-item>
                <v-card flat>
                    <v-card-text>
                        <v-layout row>
                            <v-flex xs6>
                                <v-select :items="marcas"
                                          :rules="rules.marca"
                                          background-color="blue lighten-5"
                                          box
                                          color="blue darken-4"
                                          item-text="nombre"
                                          item-value="id"
                                          label="Seleccione Marca"
                                          v-model="equipo.marca_id"
                                ></v-select>
                                <v-select :items="modelos"
                                          background-color="blue lighten-5"
                                          box
                                          color="blue darken-4"
                                          item-text="nombre"
                                          item-value="id"
                                          label="Seleccione el Modelo"
                                          v-model="equipo.modelo_id"
                                ></v-select>
                                <v-select :items="estados"
                                          :rules="rules.estado"
                                          background-color="blue lighten-5"
                                          box
                                          color="blue darken-4"
                                          item-text="state"
                                          item-value="abbr"
                                          label="Seleccione el estado"
                                          v-model="equipo.estado"
                                ></v-select>
                                <v-textarea :rows="1"
                                            background-color="blue lighten-5"
                                            box
                                            color="blue darken-4"
                                            label="Descripcion"
                                            v-model="equipo.descripcion"
                                ></v-textarea>
                            </v-flex>
                            <v-flex xs6>
                                <v-text-field
                                        background-color="blue lighten-5"
                                        box
                                        color="blue darken-4"
                                        label="Service tag"
                                        required
                                        v-model="equipo.service_tag"
                                ></v-text-field>
                                <v-text-field
                                        :rules="rules.codigo"
                                        background-color="blue lighten-5"
                                        box
                                        color="blue darken-4"
                                        label="Código de activo"
                                        required
                                        v-model="equipo.codigo_activo"
                                ></v-text-field>
                                <v-text-field
                                        :rules="rules.nro_serie"
                                        background-color="blue lighten-5"
                                        box
                                        color="blue darken-4"
                                        label="Número de serie"
                                        required
                                        v-model="equipo.nro_serie"
                                ></v-text-field>

                                <v-textarea :rows="1"
                                            background-color="blue lighten-5"
                                            box
                                            color="blue darken-4"
                                            label="Observaciones"
                                            v-model="equipo.observaciones"
                                ></v-textarea>
                            </v-flex>
                        </v-layout>
                    </v-card-text>
                    <v-card-actions>
                        <v-layout justify-center row>
                            <v-btn @click="submit" class="text" color="info" depressed>Guardar</v-btn>
                            <v-btn @click="limpiar" color="blue darken-1" outline>
                                {{ this.modeEdit? 'Cancelar':'Limpiar'}}
                            </v-btn>
                        </v-layout>
                    </v-card-actions>
                </v-card>
            </v-tab-item>

            <v-tab-item>
                <v-card flat>
                    <v-form ref="formAccesorio" v-model="valid">
                        <v-layout justify-center>
                            <v-flex xs4>
                                <v-select :items="tiposAccesorios"
                                          :rules="rules.tipos_accesorios"
                                          background-color="blue lighten-5"
                                          box
                                          color="blue darken-4"
                                          item-text="nombre"
                                          label="Tipo de accesorio"
                                          return-object
                                          v-model="tipoAccesorio"
                                ></v-select>
                            </v-flex>
                            <v-flex xs2>
                                <v-btn @click="addAccesorio"
                                       color="info"
                                       depressed
                                       large round>Agregar
                                </v-btn>
                            </v-flex>
                        </v-layout>
                    </v-form>
                    <v-flex offset-xs2 xs8>
                        <v-data-table
                                :headers="dataTableAccesorios.headers"
                                :items="dataTableAccesorios.data"
                                disable-initial-sort
                                hide-actions
                                item-key="index"
                        >
                            <!--class="elevation-1" elevacion de data table -->
                            <template v-slot:items="props">
                                <td>{{ props.item.nombre }}</td>
                                <td>
                                    <v-btn @click="quitarAccesorio(props.index)"
                                           class="white--text" color="info"
                                           depressed
                                           round
                                           small
                                    >
                                        <v-icon>delete</v-icon>
                                        Quitar
                                    </v-btn>
                                </td>
                            </template>
                        </v-data-table>
                    </v-flex>
                </v-card>
            </v-tab-item>

        </v-tabs>
    </v-form>
</template>

<script>
    import Equipo from '../../models/Equipo'
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
        created() {
            if (this.modeEdit) {
                this.equipo = {...this.editData}
                this.dataTableAccesorios.data = this.editData.accesorios
            }
        },
        mounted() {
            // this.equipo.tipo={state: 'Cámara fotográfica', abbr: {nombre: 'Cámara fotográfica', tipo: 'e'}};
            this.getMarcas();
            this.getModelos();
            this.getTiposEquipos();
            this.getAccesorios();
        },
        data: () => ({
            // view
            dialog: false,
            active: null,
            valid: true,
            estados: [
                {state: 'Bueno', abbr: 'b'},
                {state: 'Dañado', abbr: 'd'},
                {state: 'En Reparación', abbr: 'r'},
            ],
            /*tipos: [
                {state: 'Equipo', abbr: 'e'},
                {state: 'Otro', abbr: 'o'},
            ],*/
            selectedTipoEquipo: null,
            rules: {
                marca: [
                    v => !!v || 'Marca es requerido',
                    /*v => (v && v.length <= 10) || 'Name must be less than 10 characters'*/
                ],
                estado: [
                    v => !!v || 'Estado es requerido',
                    /*v => (v && v.length <= 10) || 'Name must be less than 10 characters'*/
                ],
                condicion: [
                    v => !!v || 'Condición es requerido',
                    /*v => (v && v.length <= 10) || 'Name must be less than 10 characters'*/
                ],
                /* tipo_equipo: [
                     v => !!v || 'Tipo de equipo es requerido',
                     /!*v => (v && v.length <= 10) || 'Name must be less than 10 characters'*!/
                 ],*/
                codigo: [
                    v => !!v || 'Código es requerido',
                    // v => /.+@.+/.test(v) || 'E-mail must be valid'
                ],
                tipos_equipos: [
                    v => !!v || 'Tipo es requerido',
                    // v => /.+@.+/.test(v) || 'E-mail must be valid'
                ],
                modelo: [
                    v => !!v || 'Modelo es requerido',
                    // v => /.+@.+/.test(v) || 'E-mail must be valid'
                ],
                nro_serie: [
                    v => !!v || 'Número de serie es requerido',
                    // v => /.+@.+/.test(v) || 'E-mail must be valid'
                ],
            },
            // model
            equipo: new Equipo(),
            marcas: [],
            modelos: [],
            tiposEquipos: [],
            tiposAccesorios: [],
            tipoAccesorio: null,
            dataTableAccesorios: {
                headers: [
                    {
                        text: 'Accesorio',
                        //sortable: false,
                        value: 'nombre',
                    }, {
                        text: 'Acciones',
                        sortable: false,
                        width: '1%'
                    },
                    // { text: 'Código', value: 'codigo' },
                ],
                data: [],
            },
        }),
        methods: {
            getMarcas() {
                axios.get(this.$urlApi.resourcesMarcas).then(response => {
                    this.marcas = response.data
                })
            },
            getAccesorios() {
                axios.get(this.$urlApi.resourcesAccesorio).then(response => {
                    this.tiposAccesorios = response.data
                })
            },
            getModelos() {
                axios.get(this.$urlApi.resourcesModelos).then(response => {
                    this.modelos = response.data
                })
            },
            getTiposEquipos() {
                axios.get(this.$urlApi.resourcesTiposEquipos).then(response => {
                    this.tiposEquipos = response.data
                })
            },
            submit: function () {
                if (this.$refs.form.validate()) {
                    this.equipo.accesorios = this.dataTableAccesorios.data
                    if (!this.modeEdit) {
                        this.create()
                    } else {
                        this.update();
                    }
                }
            },
            create() {
                axios.post(this.$urlApi.resourcesEquipo,
                    this.equipo
                ).then(response => {
                    this.equipo = new Equipo();
                    this.dataTableAccesorios.data = [];
                    this.$toastr('success', '', 'TAREA REALIZADA CON ÉXITO');
                    // this.dialog=false;
                    this.valid = true;
                    this.$emit('register-success');
                }).catch(errors => {
                    this.$notifyErrors(errors);
                });
            },
            update() {
                axios.put(this.$urlApi.resourcesEquipo + '/' + this.equipo.id,
                    this.equipo
                ).then(response => {
                    this.$toastr('success', '', 'TAREA REALIZADA CON ÉXITO');
                    // this.dialog = false;
                    this.$nextTick(() => {
                        this.equipo = new Equipo();
                        this.valid = true;
                    });
                    this.$emit('register-success');
                }).catch(errors => {
                    this.$notifyErrors(errors);
                });
            },
            addAccesorio() {
                if (this.tipoAccesorio) {
                    this.dataTableAccesorios.data.push(this.tipoAccesorio)
                    this.tipoAccesorio = null
                }
            },
            quitarAccesorio(index) {

                this.dataTableAccesorios.data.splice(index, 1)
            },
            limpiar() {
                this.dataTableAccesorios.data = []
                this.equipo = new Equipo
                this.$emit('cancel')
            }
        },
    }
</script>
