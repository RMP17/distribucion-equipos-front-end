<template>
    <div>
        <h4 class="pa-2" style="border-bottom:5px solid skyblue">{{$route.meta.subname}}</h4>
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
                <v-text-field
                        :append-icon="show1 ? 'visibility_off' : 'visibility'"
                        :rules="[this.passwordConfirmationRule]"
                        :type="show1 ? 'text' : 'password'"
                        @click:append="show1 = !show1"
                        autocomplete="false"
                        background-color="blue lighten-5"
                        box
                        color="blue_darken_1"
                        label="Confirmar Contraseña"
                        required
                        v-model="usuario.confirmar_contrasenia"
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
                        label="Funcionario"
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
                                <v-radio :value="4" label="Administrador"></v-radio>
                            </v-flex>
                            <v-flex>
                                <v-radio :value="0" label="Técnico"></v-radio>
                            </v-flex>
                            <v-flex>
                                <v-radio :value="1" label="Técnico Auxiliar"></v-radio>
                            </v-flex>
                            <v-flex>
                                <v-radio :value="2" label="Coordinador"></v-radio>
                            </v-flex>
                        </v-layout>
                    </v-radio-group>
                </div>
                <div class="text-xs-center">
                    <v-btn @click="editUsuarioCancel" color="error" depressed
                           outline
                           round
                           small
                    >
                        <v-icon left>cancel</v-icon>
                        Cancelar
                    </v-btn>
                    <v-btn @click="submit" class="white--text" color="cyan accent-4"
                           depressed
                           round
                           small
                    >
                        <v-icon left>save</v-icon>
                        <span v-if="modeEdit">Actualizar</span>
                        <span v-else>Registrar</span>
                    </v-btn>
                </div>
            </v-form>
        </v-container>
        <v-container v-else>
            <v-btn @click="modeCreate=true" class="white--text" color="cyan accent-4"
                   depressed
                   round
                   small
            >
                <v-icon left>add</v-icon>
                Registrar
            </v-btn>
            <v-data-table
                    :headers="dataTable.headers"
                    :items="dataTable.usuarios"
                    disable-initial-sort
            >
                <template v-slot:items="props">
                    <td>{{ props.item.usuario }}</td>
                    <td>
                        <span v-if="props.item.nivel_acceso===4">Administrador</span>
                        <span v-if="props.item.nivel_acceso===0">Técnico</span>
                        <span v-if="props.item.nivel_acceso===1">Técnico Auxiliar</span>
                        <span v-if="props.item.nivel_acceso===2">Coordinador</span>
                    </td>
                    <td>{{ props.item.tecnico ? props.item.tecnico.nombre:'' }}</td>
                    <td>{{ props.item.coordinador ? props.item.coordinador.nombre:'' }}</td>
                    <td width="10%">
                        <v-layout row>
                            <v-btn @click="editUsuario(props.item)" class="white--text" color="success"
                                   depressed
                                   round
                                   small
                            >
                                <v-icon>edit</v-icon>
                                Editar
                            </v-btn>
                            <v-btn @click="removeUsuario(props.item)" class="white--text" color="error"
                                   depressed
                                   round
                                   small
                            >
                                <v-icon>delete</v-icon>
                                Quitar
                            </v-btn>
                        </v-layout>
                    </td>
                </template>
            </v-data-table>
        </v-container>
    </div>
</template>

<script>
    import Usuario from '../models/Usuario';
    import axios from 'axios';

    export default {
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
                        text: 'Coordinador',
                        value: 'coordinador.nombre'
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
                    v => !!v || 'Contraseña es requerido'
                    // v => /.+@.+/.test(v) || 'E-mail must be valid'
                ]
                // v => /.+@.+/.test(v) || 'E-mail must be valid'
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
            this.getUsuarios()
        },
        computed: {
            passwordConfirmationRule() {
                return () => (this.usuario.contrasenia === this.usuario.confirmar_contrasenia) || 'Las contraseñas debe coincidir'
            },
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
                    inputs.funcionario_id = this.searchTecnico.tecnico.id
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
                } else if (usuario.coordinador) {
                    this.searchTecnico.entries.push(usuario.coordinador);
                    this.searchTecnico.tecnico = usuario.coordinador;
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
                    inputs.funcionario_id = this.searchTecnico.tecnico.id
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
                fetch(this.$urlApi.resourcesPersonal)
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
