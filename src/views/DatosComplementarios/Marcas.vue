<template>
    <div>
        <h4 class="pa-2" style="border-bottom:5px solid skyblue">{{$route.meta.subname}}</h4>
        <v-container fluid>
            <v-layout row>
                <MarcaComponent @register-success="getMarcas"/>
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
                            <v-btn @click="editMarca(props.item)"
                                   class="white--text" color="success"
                                   depressed
                                   round
                                   small
                            >
                                <v-icon>edit</v-icon>
                                Editar
                            </v-btn>
                            <v-btn @click="eliminarMarca(props.item)"
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
            <MarcaComponent :edit-data="selected" mode-edit ref="componentMarca"/>
        </v-container>
    </div>
</template>

<script>
    import axios from 'axios'
    import MarcaComponent from "@/components/MarcaComponent"

    export default {

        components: {
            MarcaComponent
        },
        mounted() {
            this.$nextTick(() => {
                this.getMarcas();
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
            getMarcas: function () {
                axios.get(this.$urlApi.resourcesMarcas
                ).then(response => {
                    this.dataTable.data = response.data;
                }).catch(errors => {
                    console.log('error servidor')
                });
            },
            eliminarMarca: function (marca) {
                this.$swal().then(result => {
                    if (result.isConfirmed) {
                        axios.delete(this.$urlApi.resourcesMarcas + '/' + marca.id
                        ).then(response => {
                            this.getMarcas()
                            this.$toastr('success', '', 'TAREA REALIZADA CON ÉXITO');
                        }).catch(errors => {
                            this.$notifyErrors(errors)
                            console.log('error servidor')
                        });
                    }
                })
            },
            editMarca(marca) {
                this.selected = marca;
                this.$nextTick(() => {
                    this.$refs.componentMarca.openDialog();
                });
            }
        },
        computed: {}
    }
</script>
