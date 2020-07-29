<!--todo:Quitar si ya no se use, se cambio por la carpeta del mismo nombre-->
<template>
    <v-tabs
            background-color="indigo"
            fixed-tabs
    >
        <v-tab>
            Profesiones
        </v-tab>

        <v-tab>
            Puntos de empadronamiento
        </v-tab>

        <v-tab-item>
            <v-container fluid>
                <v-layout row>
                    <!--<component-equipo @register-success="getEquipos" />-->
                    <component-profesion @register-success="getProfesiones"/>
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
                        :items="dataTable.profesiones"
                        :search="search"
                        disable-initial-sort
                >
                    <template v-slot:items="props">
                        <td>{{ props.item.id }}</td>
                        <td>{{ props.item.nombre }}</td>
                        <td class="justify-center">
                            <v-btn @click="editProfesion(props.item)" class="square"
                                   color="info"
                                   flat
                                   title="Editar Profesion"
                            >
                                <v-icon>edit</v-icon>
                            </v-btn>
                        </td>
                    </template>
                    <!--<v-alert v-slot:no-results :value="true" color="error" icon="warning">
                      Your search for "{{ search }}" found no results.
                    </v-alert>-->
                </v-data-table>

                <component-profesion :edit-data="selectedProfesion" mode-edit ref="componentProfesion"/>
            </v-container>
        </v-tab-item>

        <v-tab-item>
            <v-container fluid>
                <v-layout row>
                    <component-punto @register-success="getPuntos"/>
                    <v-text-field
                            append-icon="search"
                            background-color="blue lighten-5"
                            class="pa-0"
                            color="blue darken-4"
                            hide-details
                            label="Buscar..."
                            single-line
                            v-model="searchPunto"
                    ></v-text-field>
                </v-layout>
                <v-data-table
                        :headers="dataTablePuntos.headers"
                        :items="dataTablePuntos.data"
                        :search="searchPunto"
                        disable-initial-sort
                >
                    <template v-slot:items="props">
                        <td>{{ props.item.id }}</td>
                        <td>{{ props.item.descripcion }}</td>
                        <td class="justify-center">
                            <v-btn @click="editPunto(props.item)" class="square"
                                   color="info"
                                   flat
                                   title="Editar Punto de Empadronamiento"
                            >
                                <v-icon>edit</v-icon>
                            </v-btn>
                        </td>
                    </template>
                    <!--<v-alert v-slot:no-results :value="true" color="error" icon="warning">
                      Your search for "{{ search }}" found no results.
                    </v-alert>-->
                </v-data-table>

                <component-profesion :edit-data="selectedProfesion" mode-edit ref="componentProfesion"/>
                <component-punto :edit-data="selectedPunto" mode-edit ref="componentPunto"/>
            </v-container>
        </v-tab-item>
    </v-tabs>
</template>

<script>
    import axios from 'axios'
    import ComponentProfesion from "../components/ComponentProfesion"
    import ComponentPunto from "../components/ComponentPunto"

    export default {

        components: {
            ComponentProfesion,
            ComponentPunto
        },
        mounted() {
            this.$nextTick(() => {
                this.getProfesiones();
                this.getPuntos();
            })
        },
        data: () => {
            return {

                dataTable: {
                    headers: [
                        {text: 'ID', align: 'left', sortable: true, value: 'id', width:'1%'},
                        {text: 'Nombre', value: 'nombre'},
                        {text: 'Acciones', sortable: false,width:'1%'},
                    ],
                    profesiones: [],
                },
                selectedProfesion: null,
                search: '',

                dataTablePuntos: {
                    headers: [
                        {text: 'ID', align: 'left', sortable: true, value: 'id', width:'1%'},
                        {text: 'Descripcion', value: 'descripcion'},
                        {text: 'Acciones', sortable: false,width:'1%'},
                    ],
                    data: [],
                },
                selectedPunto: null,
                searchPunto: '',
            }
        },
        methods: {
            getProfesiones: function () {
                axios.get(this.$urlApi.resourcesProfesion
                ).then(response => {
                    this.dataTable.profesiones = response.data;
                }).catch(errors => {
                    console.log('error servidor')
                });
            },
            getPuntos: function () {
                axios.get(this.$urlApi.resourcesPuntos
                ).then(response => {
                    this.dataTablePuntos.data = response.data;
                }).catch(errors => {
                    console.log('error servidor')
                });
            },
            editProfesion(profesion) {
                this.selectedProfesion = profesion;
                this.$nextTick(() => {
                    this.$refs.componentProfesion.openDialog();
                });
            },
            editPunto(punto) {
                this.selectedPunto = punto;
                this.$nextTick(() => {
                    this.$refs.componentPunto.openDialog();
                });
            }
        },
        computed: {}
    }
</script>
