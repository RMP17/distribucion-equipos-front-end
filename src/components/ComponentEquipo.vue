<template>
    <div>
        <v-dialog v-model="dialog" persistent max-width="600px">
            <template v-slot:activator="{ on }" v-if="!modeEdit">
                <v-btn @click="modeCreate=true"
                       v-on="on"
                       class="white--text" color="cyan accent-4"
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
                        <span v-if="!modeEdit" class=title>Nuevo dispositivo</span>
                        <span v-else class=title>Editar dispositivo</span>
                        <v-btn color="secondary" flat
                               @click="dialog=!dialog"
                               class="square">
                            <v-icon>close</v-icon>
                        </v-btn>
                    </v-layout>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-form ref="form" v-model="valid" lazy-validation
                        >
                            <v-select :items="tiposEquipos"
                                      background-color="blue lighten-5"
                                      v-model="equipo.tipo_equipo_id"
                                      color="blue darken-4"
                                      item-text="nombre"
                                      item-value="id"
                                      :rules="rules.tipos_equipos"
                                      box
                                      label="Seleccione tipo de dispositivo"
                            ></v-select>
                            <!--<v-text-field
                                    color="blue darken-4"
                                    background-color="blue lighten-5"
                                    box
                                    :rules="rules.marca"
                                    v-model="equipo.marca"
                                    label="Marca"
                                    required
                            ></v-text-field>-->
                            <v-select :items="marcas"
                                      background-color="blue lighten-5"
                                      v-model="equipo.marca_id"
                                      color="blue darken-4"
                                      item-text="nombre"
                                      item-value="id"
                                      :rules="rules.marca"
                                      box
                                      label="Seleccione Marca"
                            ></v-select>
                            <v-select :items="modelos"
                                      background-color="blue lighten-5"
                                      v-model="equipo.modelo_id"
                                      color="blue darken-4"
                                      item-text="nombre"
                                      item-value="id"
                                      box
                                      label="Seleccione el Modelo"
                            ></v-select>
                            <!--<v-text-field
                                    color="blue darken-4"
                                    background-color="blue lighten-5"
                                    :rules="rules.modelo"
                                    v-model="equipo.modelo"
                                    label="Modelo"
                                    box
                                    required
                            ></v-text-field>-->
                            <v-text-field
                                    color="blue darken-4"
                                    background-color="blue lighten-5"
                                    v-model="equipo.service_tag"
                                    label="Service tag"
                                    box
                                    required
                            ></v-text-field>
                            <v-text-field
                                    color="blue darken-4"
                                    background-color="blue lighten-5"
                                    :rules="rules.codigo"
                                    v-model="equipo.codigo_activo"
                                    label="Código de activo"
                                    box
                                    required
                            ></v-text-field>
                            <v-text-field
                                    color="blue darken-4"
                                    background-color="blue lighten-5"
                                    v-model="equipo.nro_serie"
                                    :rules="rules.nro_serie"
                                    label="Número de serie"
                                    box
                                    required
                            ></v-text-field>
                            <v-select :items="estados"
                                      background-color="blue lighten-5"
                                      v-model="equipo.estado"
                                      color="blue darken-4"
                                      :rules="rules.estado"
                                      item-text="state"
                                      item-value="abbr"
                                      box
                                      label="Seleccione el estado"
                            ></v-select>
                            <!--<v-select :items="['Almacenes','Prestamo']"
                                      background-color="blue lighten-5"
                                      v-model="equipo.origen"
                                      color="blue darken-4"
                                      :rules="rules.origen"
                                      box
                                      label="Seleccione el origen del dispositivo"
                            ></v-select>-->
                            <v-textarea box
                                        :rows="1"
                                        v-model="equipo.descripcion"
                                        background-color="blue lighten-5"
                                        color="blue darken-4"
                                        label="Descripcion"
                            ></v-textarea>
                            <v-textarea box
                                        background-color="blue lighten-5"
                                        :rows="1"
                                        v-model="equipo.observaciones"
                                        color="blue darken-4"
                                        label="Observaciones"
                            ></v-textarea>
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
    import Equipo from '../models/Equipo'
    import axios from 'axios';
    import api from "../plugins/api";

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
        mounted(){
          // this.equipo.tipo={state: 'Cámara fotográfica', abbr: {nombre: 'Cámara fotográfica', tipo: 'e'}};
          this.getMarcas();
          this.getModelos();
          this.getTiposEquipos();
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
            /*tipos_equipos: [
                {state: 'Computadora portátil', abbr: {nombre: 'Computadora portátil', tipo: 'e'}},
                {state: 'Monitor', abbr: {nombre: 'Monitor', tipo: 'e'}},
                {state: 'Teclado', abbr: {nombre: 'Teclado', tipo: 'e'}},
                {state: 'Escáner de imágemes', abbr: {nombre: 'Escáner de imágemes', tipo: 'e'}},
                {state: 'Impresora', abbr: {nombre: 'Impresora', tipo: 'e'}},
                {state: 'Pad Firmas', abbr: {nombre: 'Pad Firmas', tipo: 'e'}},
                {state: 'Cámara fotográfica', abbr: {nombre: 'Cámara fotográfica', tipo: 'e'}},
                {state: 'Deca dactilar', abbr: {nombre: 'Deca dactilar', tipo: 'e'}},
                {state: 'HUB(USB)', abbr: {nombre: 'HUB(USB)', tipo: 'e'}},
                {
                    state: 'Fuente estabilizadora de energiá',
                    abbr: {nombre: 'Fuente estabilizadora de energiá', tipo: 'e'}
                },
                {
                    state: 'Cable extensor de energía (amarillo/rojo)',
                    abbr: {nombre: 'Cable extensor de energía (amarillo/rojo)', tipo: 'o'}
                },
                {state: 'Tripode cámara', abbr: {nombre: 'Tripode cámara', tipo: 'o'}},
                {
                    state: 'Banner blanco(una base + tres barillas + un seguro)',
                    abbr: {nombre: 'Banner blanco(una base + tres barillas + un seguro)', tipo: 'o'}
                },
                {state: 'Adaptador de corriente(3 a 2 )', abbr: {nombre: 'Adaptador de corriente(3 a 2 )', tipo: 'o'}},
            ],*/
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
            marcas:[],
            modelos:[],
            tiposEquipos:[],
        }),
        methods: {
            getMarcas(){
              axios.get(api.resourcesMarcas).then( response =>{
                  this.marcas = response.data
              })
            },
            getModelos(){
              axios.get(api.resourcesModelos).then( response =>{
                  this.modelos = response.data
              })
            },
            getTiposEquipos(){
              axios.get(api.resourcesTiposEquipos).then( response =>{
                  this.tiposEquipos = response.data
              })
            },
            submit: function () {
                if (this.$refs.form.validate()) {
                    if (!this.modeEdit) {
                        this.create()
                    } else {
                        this.update();
                    }
                }
            },
            create(){
                axios.post(this.$urlApi.resourcesEquipo,
                    this.equipo
                ).then(response => {
                    this.equipo = new Equipo();
                    this.$toastr('success', '', 'TAREA REALIZADA CON ÉXITO');
                    // this.dialog=false;
                    this.valid = true;
                    this.$emit('register-success');
                }).catch(errors => {
                    this.$notifyErrors(errors);
                });
            },
            update(){
                axios.put(this.$urlApi.resourcesEquipo+'/'+this.equipo.id,
                    this.equipo
                ).then(response => {
                    this.$toastr('success', '', 'TAREA REALIZADA CON ÉXITO');
                    this.dialog = false;
                    this.$nextTick(() => {
                        this.equipo = new Equipo();
                        this.valid = true;
                    });
                    this.$emit('register-success');
                }).catch(errors => {
                    this.$notifyErrors(errors);
                });
            },
            openDialog() {
                Object.assign(this.equipo, this.editData);
                this.dialog = true;
            }
        }
    }
</script>
