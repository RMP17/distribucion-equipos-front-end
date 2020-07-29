<template>
    <div>
        <h4 class="pa-2" style="border-bottom:5px solid skyblue">{{$route.meta.subname}}</h4>
        <v-container fluid>
            <v-layout row>
                <!--<component-equipo @register-success="getEquipos" />-->
                <component-notario :profesiones="profesiones" @register-success="getNotario"/>
                <v-text-field
                        append-icon="search"
                        background-color="blue lighten-5"
                        class="pa-0"
                        color="blue darken-4"
                        hide-details
                        label="Buscar..."
                        single-line
                        v-model="search"
                ></v-text-field>
            </v-layout>
            <v-data-table
                    :headers="dataTable.headers"
                    :items="dataTable.personal"
                    :search="search"
                    disable-initial-sort
            >
                <!--class="elevation-1" elevacion de data table -->
                <template slot="headerCell" slot-scope="props">
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
          <span v-on="on">
            {{ props.header.text }}
          </span>
                        </template>
                        <span>
            {{ props.header.title ? props.header.title:props.header.text }}
          </span>
                    </v-tooltip>
                </template>
                <template v-slot:items="props">
                    <td>{{ props.item.ci+' '+props.item.extension }}</td>
                    <td>{{ props.item.nombre }}</td>
                    <td>{{ props.item.apellido1 }}</td>
                    <td>{{ props.item.apellido2 }}</td>
                    <td>{{ props.item.celular+' '+props.item.empresa_telefonica }}</td>
                    <td>{{ props.item.profesion.nombre? props.item.profesion.nombre:'' }}</td>
                    <!--<td>{{ props.item.experiencia_procesos_anteriores ? 'SI':'NO'}}</td>
                    <td>{{ props.item.nro_estacion }}</td>
                    <td>{{ props.item.tipo_estacion }}</td>-->
                    <td>{{ props.item.contratado==1 ? 'SI': 'NO' }}</td>
                    <td>
                        <v-layout column>
                            <v-btn @click="editNotario(props.item)" class="white--text" color="success"
                                   depressed
                                   round
                                   small
                            >
                                <v-icon>edit</v-icon>
                                Editar
                            </v-btn>
                            <v-btn :disabled="props.item.contratado==1"
                                   @click="contratarNotario(props.item)"
                                   class="white--text"
                                   color="info"
                                   depressed
                                   round
                                   small>
                                <v-icon>assignment_ind</v-icon>
                                Contratar
                            </v-btn>
                            <v-btn @click="eliminarNotario(props.item)"
                                   class="white--text" color="error"
                                   depressed
                                   round
                                   small
                            >
                                <v-icon>delete</v-icon>
                                Eliminar
                            </v-btn>
                        </v-layout>
                        <!--<v-icon class="mr-2" @click="editItem(props.item)">
                          edit
                        </v-icon>-->
                    </td>
                </template>
                <!--<v-alert v-slot:no-results :value="true" color="error" icon="warning">
                  Your search for "{{ search }}" found no results.
                </v-alert>-->
            </v-data-table>

            <!--components para editar-->
            <component-notario
                    :edit-data="selectedNotario"
                    :profesiones="profesiones"
                    mode-edit ref="componentNotario"/>
        </v-container>
    </div>
</template>

<script>
    import axios from 'axios';
    import ComponentNotario from '@/components/ComponentNotario.vue';

    export default {

        components: {
            ComponentNotario
        },
        mounted() {
            this.$nextTick(() => {
                this.getNotario();
                this.getProfesiones();
            })
        },
        data: () => {
            return {

                dataTable: {
                    headers: [
                        {
                            text: 'C.I.',
                            align: 'left',
                            title: 'Cédula de identidad',
                            //sortable: false,
                            value: 'ci'
                        },
                        {text: 'Nombre', value: 'nombre'},
                        {text: 'Primer Apellido', value: 'apellido1'},
                        {text: 'Segundo Apellido', value: 'apellido2'},
                        {text: 'Celular - Empresa', value: 'celular'},
                        {text: 'Profesión', value: 'profesion'},
                        /*{
                            text: 'Exp. Pro. Ant.',
                            title: 'Experiencia en procesos anteriores',
                            value: 'experiencia_procesos_anteriores'
                        },
                        {text: 'Nro de estacion', value: 'nro_estacion'},
                        {text: 'Tipo de estación', value: 'tipo_estacion'},*/
                        {text: 'Contratado', value: 'contratado'},
                        {
                            text: 'Acciones',
                            sortable: false,
                        },
                    ],
                    personal: [],
                },
                selectedNotario: null,
                search: '',
                profesiones: [],
            }
        },
        methods: {
            getNotario: function () {
                axios.get(this.$urlApi.resourcesNotario
                ).then(response => {
                    this.dataTable.personal = response.data;
                }).catch(errors => {
                    console.log('error servidor')
                });
            },
            getProfesiones: function () {
                axios.get(this.$urlApi.resourcesProfesion
                ).then(response => {
                    this.profesiones = response.data;
                }).catch(errors => {
                    console.log('error servidor')
                });
            },
            editNotario(notario) {
                this.selectedNotario = notario;
                this.$nextTick(() => {
                    this.$refs.componentNotario.openDialog();
                });
            },
            contratarNotario(notario) {
                this.$swal().then(result => {
                    if (result.isConfirmed) {
                        axios.patch(this.$urlApi.contratarNotario + notario.id
                        ).then(response => {
                            notario.contratado = 1
                            this.$toastr('success', '', 'TAREA REALIZADA CON ÉXITO')
                        }).catch(errors => {
                            console.log('error servidor')
                        });
                    }
                })
            },
            eliminarNotario(notario) {
                this.$swal().then(result => {
                    if (result.isConfirmed) {
                        axios.delete(this.$urlApi.resourcesNotario + '/' + notario.id
                        ).then(response => {
                            this.getNotario()
                            this.$toastr('success', '', 'TAREA REALIZADA CON ÉXITO')
                        }).catch(errors => {
                            this.$notifyErrors(errors)
                            console.log('error servidor')
                        })
                    }
                })
            }
        },
        computed: {}
    }
</script>
