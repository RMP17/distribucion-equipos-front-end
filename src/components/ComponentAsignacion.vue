<template>
    <div>
        <v-dialog v-model="dialog" scrollable persistent max-width="600px">
            <v-card>
                <v-card-title class="grey lighten-2">
                  <v-layout align-center justify-space-between fill-height>
                    <span class=title>Asignar</span>
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
                                    v-model="estacion.direccion"
                                    label="Dirección"
                            ></v-text-field>
                            <v-autocomplete
                                    color="blue darken-4"
                                    box
                                    background-color="blue lighten-5"
                                    v-model="searchTecnico.tecnico"
                                    :items="tecnicos"
                                    :loading="searchTecnico.isLoading"
                                    :search-input.sync="inputTecnico"
                                    hide-no-data
                                    hide-selected
                                    item-text="nombre"
                                    item-value="id"
                                    label="Técnico"
                                    placeholder="Comience a escribir para buscar"
                                    return-object
                            >
                                <template v-slot:item="{ item, index }">
                                    <v-layout align-center justify-space-between fill-height>
                                        <v-flex xs8>
                                            <span class="v-text-field--full-width">{{item.nombre }}</span>
                                        </v-flex>
                                        <v-flex class="text-xs-right">
                                            <span>{{item.ci }}</span>
                                        </v-flex>
                                    </v-layout>
                                </template>
                            </v-autocomplete>
                            <v-text-field
                                    color="blue darken-4"
                                    background-color="blue lighten-5"
                                    :rules="rules.nombre"
                                    v-model="estacion.kit_id"
                                    label="Número de Kit"
                                    box
                                    required
                            ></v-text-field>
                            <v-autocomplete
                                    color="blue darken-4"
                                    box
                                    background-color="blue lighten-5"
                                    v-model="searchNotario.notario"
                                    :items="notarios"
                                    :loading="searchTecnico.isLoading"
                                    :search-input.sync="inputNotario"
                                    hide-no-data
                                    hide-selected
                                    item-text="nombre"
                                    item-value="id"
                                    label="Notario"
                                    placeholder="Comience a escribir para buscar"
                                    return-object
                            ><template v-slot:item="{ item, index }">
                                    <v-layout align-center justify-space-between fill-height>
                                        <v-flex xs8>
                                            <span class="v-text-field--full-width">{{item.nombre }}</span>
                                        </v-flex>
                                        <v-flex class="text-xs-right">
                                            <span>{{item.ci }}</span>
                                        </v-flex>
                                    </v-layout>
                                </template>
                            </v-autocomplete>
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
    import Estacion from '../models/Estacion'
    import axios from 'axios';

    export default {
        props: {
            editData:{
                default:null
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
            },
            searchTecnico:{
                descriptionLimit: 60,
                entries: [],
                isLoading: false,
                tecnico:null,
                count:null
            },
            inputTecnico:null,

            searchNotario:{
                descriptionLimit: 60,
                entries: [],
                isLoading: false,
                notario:null,
                count:null
            },
            inputNotario:null,
            // model
            estacion: new Estacion(),
            selectedEstacion:null
        }),
        watch: {
            inputTecnico(val) {
                // Items have already been loaded
                if (this.tecnicos.length > 0) return

                // Items have already been requested
                if (this.searchTecnico.isLoading) return

                this.searchTecnico.isLoading = true

                // Lazily load input items
                fetch(this.$urlApi.resourcesTecnico)
                    .then(res => res.json())
                    .then(res => {

                        this.searchTecnico.count = res
                        this.searchTecnico.entries = res
                    })
                    .catch(err => {
                        console.log(err)
                    })
                    .finally(() => (this.searchTecnico.isLoading = false))
            },
            inputNotario(val) {
                // Items have already been loaded
                if (this.notarios.length > 0) return

                // Items have already been requested
                if (this.searchNotario.isLoading) return

                this.searchNotario.isLoading = true

                // Lazily load input items
                fetch(this.$urlApi.resourcesNotario)
                    .then(res => res.json())
                    .then(res => {

                        this.searchNotario.count = res
                        this.searchNotario.entries = res
                    })
                    .catch(err => {
                        console.log(err)
                    })
                    .finally(() => (this.searchNotario.isLoading = false))
            }
        },
        computed: {
            tecnicos() {
                return this.searchTecnico.entries.map(entry => {
                    const nombre = entry.nombre.length > this.searchTecnico.descriptionLimit
                        ? entry.nombre.slice(0, this.searchTecnico.descriptionLimit) + '...'
                        : entry.nombre

                    return Object.assign({}, entry, {nombre})
                })
            },
            notarios() {
                return this.searchNotario.entries.map(entry => {
                    const nombre = entry.nombre.length > this.searchNotario.descriptionLimit
                        ? entry.nombre.slice(0, this.searchNotario.descriptionLimit) + '...'
                        : entry.nombre

                    return Object.assign({}, entry, {nombre})
                })
            }
        },
        methods: {
            submit: function () {
                if (this.$refs.form.validate()) {
                    this.update();
                }
            },
            update(){
                let inputs= this.estacion;
                if(this.searchTecnico.tecnico){
                    inputs.tecnico_id=this.searchTecnico.tecnico.id;
                }
                if(this.searchNotario.notario){
                    inputs.notario_id=this.searchNotario.notario.id;
                }
                axios.put(this.$urlApi.resourcesEstacion+'/'+inputs.id,
                    inputs
                ).then(response => {
                    //Object.assign(this.editData, this.tecnico);
                    this.$toastr('success', '', 'TAREA REALIZADA CON ÉXITO');
                    this.dialog=false;
                    this.$nextTick(() => {
                        this.estacion = new Estacion();
                        this.searchNotario.notario=null;
                        this.valid = true;
                    });
                    this.$emit('registerSuccess');
                }).catch(errors => {
                    this.$notifyErrors(errors);
                });
            },
            openDialog(){
                Object.assign(this.estacion,this.editData);
                /*this.searchNotario.notario.id=this.estacion.notario_id;
                this.searchTecnico.tecnico.id=this.estacion.tecnico_id;*/
                this.dialog=true;
            }
        }
    }
</script>
