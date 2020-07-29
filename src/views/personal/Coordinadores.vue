<template>
    <div>
        <h4 class="pa-2" style="border-bottom:5px solid skyblue">{{$route.meta.subname}}</h4>
        <v-container fluid>
            <v-layout row>
                <!--<component-equipo @register-success="getEquipos" />-->
                <component-coordinador :profesiones="profesiones" @register-success="getCoordinadores"/>
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
                    :items="dataTable.coordinadores"
                    :search="search"
                    disable-initial-sort
            >
                <template v-slot:items="props">
                    <td>{{ props.item.ci+' '+props.item.extension }}</td>
                    <td>{{ props.item.nombre }}</td>
                    <td>{{ props.item.apellido1 }}</td>
                    <td>{{ props.item.apellido2 }}</td>
                    <td>{{ props.item.celular+' '+props.item.empresa_telefonica }}</td>
                    <td>{{ props.item.profesion ? props.item.profesion.nombre:'' }}</td>

                    <td class="justify-center">
                        <v-btn @click="editCoordinador(props.item)"
                               class="white--text" color="success"
                               depressed
                               round
                               small
                        >
                            <v-icon>edit</v-icon>
                            Editar
                        </v-btn>
                        <v-btn @click="eliminarCoordinador(props.item)"
                               class="white--text" color="error"
                               depressed
                               round
                               small
                        >
                            <v-icon>delete</v-icon>
                            Eliminar
                        </v-btn>
                    </td>
                </template>
                <!--<v-alert v-slot:no-results :value="true" color="error" icon="warning">
                  Your search for "{{ search }}" found no results.
                </v-alert>-->
            </v-data-table>

            <!--components para editar-->
            <component-coordinador :edit-data="selectedCoordinador" :profesiones="profesiones" mode-edit
                                   ref="componentCoordinador"/>
        </v-container>
    </div>
</template>

<script>
    import axios from 'axios';
    import ComponentCoordinador from '@/components/ComponentCoordinador.vue';

    export default {

        components: {
            ComponentCoordinador
        },
        mounted() {
            this.$nextTick(() => {
                this.getCoordinadores();
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
                        {text: 'Acciones', sortable: false}
                    ],
                    coordinadores: [],
                },
                selectedCoordinador: null,
                search: '',
                profesiones: [],
            }
        },
        methods: {
            getCoordinadores: function () {
                axios.get(this.$urlApi.resourcesCoordinador
                ).then(response => {
                    console.log(response)
                    this.dataTable.coordinadores = response.data;
                }).catch(errors => {
                    console.log('error servidor')
                });
            },
            editCoordinador(coordinador) {
                this.selectedCoordinador = coordinador;
                this.$nextTick(() => {
                    this.$refs.componentCoordinador.openDialog();
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
            eliminarCoordinador(coordinadro) {
                this.$swal().then(result => {
                    if (result.isConfirmed) {
                        axios.delete(this.$urlApi.resourcesCoordinador + '/' + coordinadro.id
                        ).then(response => {
                            this.getCoordinadores()
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
