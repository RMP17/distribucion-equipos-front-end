<template>
    <div>
        <v-dialog max-width="1000px" persistent scrollable v-model="dialog">
            <template v-slot:activator="{ on }">
                <v-btn @click="getUsuarios" class="square" color="info"
                       flat title="Usuarios" v-on="on">
                    <v-icon>account_circle</v-icon>
                </v-btn>
            </template>
            <v-card>
                <v-card-title class="grey lighten-2">
                    <v-layout align-center fill-height justify-space-between>
                        <span class="title">Usuarios</span>
                        <div>
                            <v-btn :title="!modeCreate ? 'Nuevo usuario':'Ver usuarios'" @click="modeCreate=!modeCreate" class="square"
                                   color="info"
                                   flat
                                   v-if="!modeEdit">
                                <v-icon> {{ !modeCreate ? 'add':'visibility'}}</v-icon>
                            </v-btn>
                            <v-btn @click="dialog=!dialog" class="square"
                                   color="secondary"
                                   flat>
                                <v-icon>close</v-icon>
                            </v-btn>
                        </div>
                    </v-layout>
                </v-card-title>
                <v-card-text>
                    <v-container v-if="modeCreate">
                        <v-form lazy-validation ref="formUser" v-model="valid">
                            <v-text-field
                                    :rules="rules.usuario"
                                    background-color="blue lighten-5"
                                    box
                                    color="blue darken-4"
                                    label="Nombre de usuario"
                                    required
                                    v-model="usuario.usuario"
                            ></v-text-field>
                            <v-text-field
                                    :append-icon="show1 ? 'visibility_off' : 'visibility'"
                                    :type="show1 ? 'text' : 'password'"
                                    @click:append="show1 = !show1"
                                    autocomplete="false"
                                    background-color="blue lighten-5"
                                    box
                                    color="blue_darken_1"
                                    label="Contraseña"
                                    required
                                    v-model="usuario.contrasenia"
                            ></v-text-field>
                            <v-autocomplete
                                    :items="tecnicos"
                                    :loading="searchTecnico.isLoading"
                                    :search-input.sync="inputTecnico"
                                    background-color="blue lighten-5"
                                    box
                                    color="blue darken-4"
                                    hide-no-data
                                    hide-selected
                                    item-text="nombre"
                                    item-value="id"
                                    label="Técnico"
                                    placeholder="Comience a escribir para buscar"
                                    return-object
                                    v-model="searchTecnico.tecnico"
                            >
                                <template v-slot:item="{ item, index }">
                                    <v-layout align-center fill-height justify-space-between>
                                        <v-flex xs8>
                                            <span class="v-text-field--full-width">{{item.nombre }}</span>
                                        </v-flex>
                                        <v-flex class="text-xs-right">
                                            <span>{{item.ci }}</span>
                                        </v-flex>
                                    </v-layout>
                                </template>
                            </v-autocomplete>
                            <div class="flex-center">
                                <v-radio-group style="margin: 0!important;" v-model.number="usuario.nivel_acceso">
                                    <v-layout>
                                        <v-flex>
                                            <v-radio :value="0" label="Técnico"></v-radio>
                                        </v-flex>
                                        <v-flex>
                                            <v-radio :value="1" label="Auxiliar Técnico"></v-radio>
                                        </v-flex>
                                        <v-flex>
                                            <v-radio :value="2" label="Coordinador"></v-radio>
                                        </v-flex>
                                    </v-layout>
                                </v-radio-group>
                            </div>
                        </v-form>
                    </v-container>
                    <v-container v-else>
                        <v-data-table
                                :headers="dataTable.headers"
                                :items="dataTable.usuarios"
                                disable-initial-sort
                        >
                            <template v-slot:items="props">
                                <td>{{ props.item.usuario }}</td>
                                <td>
                                    <span v-if="props.item.nivel_acceso===0">Técnico</span>
                                    <span v-else>Técnico auxiliar</span>
                                </td>
                                <td>{{ props.item.tecnico ? props.item.tecnico.nombre:'' }}</td>
                                <td width="10%">
                                    <v-btn @click="editUsuario(props.item)"
                                           class="square"
                                           color="info"
                                           flat
                                           title="Editar">
                                        <v-icon>edit</v-icon>
                                    </v-btn>
                                    <v-btn @click="removeUsuario(props.item)" class="square"
                                           color="error"
                                           flat
                                           title="Quitar">
                                        <v-icon>remove</v-icon>
                                    </v-btn>
                                </td>
                            </template>
                        </v-data-table>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click="dialog = false" color="blue darken-1" outline v-if="!modeEdit">Cerrar</v-btn>
                    <v-btn @click="editUsuarioCancel" color="error" outline v-else>Cancelar</v-btn>
                    <v-btn @click="submit" class="text" color="info" depressed v-if="modeCreate">
                        <span v-if="modeEdit">Actualizar</span>
                        <span v-else>Enviar</span>
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import Usuario from '../models/Usuario';
    import axios from 'axios';

    export default {
        components: {
        },
        data: () => ({
            // view
            show1: false,
            dialog: false,
            valid: true,
            modeCreate: false,
            modeEdit: false,
            dataTable: {
                headers: [
                    {
                        text: 'Nombre de usuario',
                        value: 'usuario'
                    },
                    {
                        text: 'Nivel de acceso',
                        value: 'nivel_acceso'
                    },
                    {
                        text: 'Técnico',
                        value: 'tecnico.nombre'
                    },
                    {
                        text: ' ',
                        value: ' ',
                        sortable: false,
                    },
                ],
                usuarios: [],
            },
            rules: {
                usuario: [
                    v => !!v || 'Nombre de usuario es requerido',
                    /*v => (v && v.length <= 10) || 'Name must be less than 10 characters'*/
                ],
                contrasenia: [
                    v => !!v || 'Contraseña es requerido',
                    // v => /.+@.+/.test(v) || 'E-mail must be valid'
                ]
            },
            searchTecnico: {
                descriptionLimit: 60,
                entries: [],
                isLoading: false,
                tecnico: null,
                count: null
            },
            inputTecnico: null,
            // model
            usuario: new Usuario(),
        }),
        mounted() {
            // this.getProcesosElectorales();
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
        },
        methods: {
            submit: function () {
                if (this.$refs.formUser.validate()) {
                    if (!this.modeEdit) {
                        this.create()
                    } else {
                        this.update();
                    }
                }
            },
            create() {
                let inputs = {...this.usuario};
                if (this.searchTecnico.tecnico) {
                    inputs.tecnico_id = this.searchTecnico.tecnico.id
                }
                axios.post(this.$urlApi.register, inputs
                ).then(response => {
                    this.usuario = new Usuario();
                    this.$toastr('success', '', 'TAREA REALIZADA CON ÉXITO');
                    this.searchTecnico.tecnico = null;
                    this.getUsuarios();
                    // this.$emit('register-success');
                }).catch(errors => {
                    this.$notifyErrors(errors);
                });
            },
            getUsuarios() {
                axios.get(this.$urlApi.resourcesUsuarios
                ).then(response => {
                    this.dataTable.usuarios = response.data;
                }).catch(errors => {

                });

            },
            editUsuario(usuario) {
                this.modeEdit = true;
                this.modeCreate = true;
                this.usuario = usuario;
                if (usuario.tecnico) {
                    this.searchTecnico.entries.push(usuario.tecnico);
                    this.searchTecnico.tecnico = usuario.tecnico;
                } else {
                    this.searchTecnico.tecnico = null;
                }
            },
            editUsuarioCancel() {
                this.modeEdit = false;
                this.modeCreate = false;
                this.usuario = new Usuario();
                this.searchTecnico.tecnico = null;
            },
            update() {
                let inputs = {...this.usuario};
                if (this.searchTecnico.tecnico) {
                    inputs.tecnico_id = this.searchTecnico.tecnico.id
                }
                axios.put(this.$urlApi.resourcesUsuarios + '/' + this.usuario.id,
                    inputs
                ).then(response => {
                    this.$toastr('success', '', 'TAREA REALIZADA CON ÉXITO');
                    this.editUsuarioCancel();
                    this.getUsuarios();
                }).catch(errors => {
                    this.$notifyErrors(errors);
                });
            },

            removeUsuario(usuario) {
                this.$swal().then(result => {
                    if (result.isConfirmed) {
                        axios.delete(this.$urlApi.resourcesUsuarios + '/' + usuario.id
                        ).then(response => {
                            this.getUsuarios();
                            this.$toastr('success', '', 'TAREA REALIZADA CON ÉXITO');
                        }).catch(errors => {
                            console.log('error de servidor')
                            this.$notifyErrors(errors);
                        })
                    }
                })
            },
            /*openDialog(){
                Object.assign(this.tecnico,this.editData);
                this.dialog=true;
            }*/
        },
        watch: {
            inputTecnico(val) {
                // Items have already been loaded
                if (this.tecnicos.length > 1) return

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
            }
        },
    }
</script>
