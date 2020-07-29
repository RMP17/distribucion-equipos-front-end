<template>
    <div>
        <h4 class="pa-2" style="border-bottom:5px solid skyblue">{{$route.meta.subname}}</h4>
        <v-container fluid>
            <v-layout row>
                <component-tecnico @register-success="getTecnicos" :profesiones="profesiones"/>
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
                    :items="dataTable.tecnicos"
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
                    <td>{{ props.item.ci }} <b class="indigo--text">{{props.item.extension}}</b></td>
                    <td>{{ props.item.nombre }}</td>
                    <td>{{ props.item.apellido1 }}</td>
                    <td>{{ props.item.apellido2 }}</td>
                    <td>{{ props.item.celular+' '+props.item.empresa_telefonica }}</td>
                    <td>{{ props.item.profesion ? props.item.profesion.nombre:'' }}</td>
                    <td class="justify-center">
                        <v-layout column>
                            <v-btn @click="editTecnico(props.item)"
                                   class="white--text"
                                   color="success"
                                   depressed
                                   round
                                   small>
                                <v-icon>edit</v-icon>
                                Editar
                            </v-btn>
                            <v-btn @click="eliminarTecnico(props.item)"
                                   class="white--text" color="error"
                                   depressed
                                   round
                                   small
                            >
                                <v-icon>delete</v-icon>
                                Eliminar
                            </v-btn>
                        </v-layout>
                    </td>
                </template>
                <!--<v-alert v-slot:no-results :value="true" color="error" icon="warning">
                  Your search for "{{ search }}" found no results.
                </v-alert>-->
            </v-data-table>

            <!--components para editar-->
            <component-tecnico :edit-data="selectedTecnico" :profesiones="profesiones" mode-edit ref="componentTecnico"/>
        </v-container>
    </div>
</template>

<script>
    import axios from 'axios';
    import ComponentTecnico from '@/components/ComponentTecnico.vue';
    import ComponentUser from '../../components/ComponentUser.vue';

    export default {

        components: {
            ComponentTecnico,
            ComponentUser
        },
        mounted() {
            this.$nextTick(() => {
                this.getTecnicos();
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
                        {text: 'Profesión', value: 'profesion.nombre'},
                        {
                            text: 'Acciones',
                            sortable: false,
                        },
                    ],
                    tecnicos: [],
                },
                selectedTecnico: null,
                search: '',
                profesiones: [],
            }
        },
        methods: {
            getTecnicos: function () {
                axios.get(this.$urlApi.resourcesTecnico
                ).then(response => {
                    this.dataTable.tecnicos = response.data;
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
            editTecnico(tecnico) {
                this.selectedTecnico = tecnico;
                this.$nextTick(() => {
                    this.$refs.componentTecnico.openDialog();
                });
            },
            eliminarTecnico(tecnico) {
                this.$swal().then(result=>{
                    if (result.isConfirmed){
                        axios.delete(this.$urlApi.resourcesTecnico+'/'+tecnico.id
                        ).then(response => {
                            this.getTecnicos()
                            this.$toastr('success', '', 'TAREA REALIZADA CON ÉXITO')
                        }).catch(errors => {
                            this.$notifyErrors(errors)
                            console.log('error servidor')
                        });
                    }
                })
            }
        },
        computed: {}
    }
</script>
