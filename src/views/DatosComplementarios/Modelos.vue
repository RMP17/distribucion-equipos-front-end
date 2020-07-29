<template>
    <div>
        <h4 class="pa-2" style="border-bottom:5px solid skyblue">{{$route.meta.subname}}</h4>
        <v-container fluid>
            <v-layout row>
                <ModeloComponent @register-success="getModelos"/>
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
                    :items="dataTable.data"
                    :search="search"
                    disable-initial-sort
            >
                <template v-slot:items="props">
                    <td>{{ props.item.id }}</td>
                    <td>{{ props.item.nombre }}</td>
                    <td>
                        <v-layout class="justify-center" row>
                            <v-btn @click="editModelo(props.item)"
                                   class="white--text" color="success"
                                   depressed
                                   round
                                   small
                            >
                                <v-icon>edit</v-icon>
                                Editar
                            </v-btn>
                            <v-btn @click="eliminarModelo(props.item)"
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
            <ModeloComponent :edit-data="selected" mode-edit ref="componentModelo"/>
        </v-container>
    </div>
</template>

<script>
    import axios from 'axios'
    import ModeloComponent from "@/components/ModeloComponent"

    export default {

        components: {
            ModeloComponent
        },
        mounted() {
            this.$nextTick(() => {
                this.getModelos();
            })
        },
        data: () => {
            return {

                dataTable: {
                    headers: [
                        {text: 'ID', align: 'left', sortable: true, value: 'id', width: '1%'},
                        {text: 'Nombre', value: 'nombre'},
                        {text: 'Acciones', sortable: false, width: '1%'},
                    ],
                    data: [],
                },
                selected: null,
                search: '',
            }
        },
        methods: {
            getModelos: function () {
                axios.get(this.$urlApi.resourcesModelos
                ).then(response => {
                    this.dataTable.data = response.data;
                }).catch(errors => {
                    console.log('error servidor')
                });
            },
            eliminarModelo: function (modelo) {
                this.$swal().then(result => {
                    if (result.isConfirmed) {
                        axios.delete(this.$urlApi.resourcesModelos + '/' + modelo.id
                        ).then(response => {
                            this.getModelos()
                            this.$toastr('success', '', 'TAREA REALIZADA CON ÉXITO');
                        }).catch(errors => {
                            this.$notifyErrors(errors)
                            console.log('error servidor')
                        });
                    }
                })
            },
            editModelo(modelo) {
                this.selected = modelo;
                this.$nextTick(() => {
                    this.$refs.componentModelo.openDialog();
                });
            }
        },
        computed: {}
    }
</script>
