<template>
    <div>
        <h4 class="pa-2" style="border-bottom:5px solid skyblue">{{$route.meta.subname}}</h4>
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
                    <td>
                        <v-layout class="justify-center" row>
                            <v-btn @click="editPunto(props.item)"
                                   class="white--text" color="success"
                                   depressed
                                   round
                                   small
                            >
                                <v-icon>edit</v-icon>
                                Editar
                            </v-btn>
                            <v-btn @click="eliminarPunto(props.item)"
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
            <component-punto :edit-data="selectedPunto" mode-edit ref="componentPunto"/>
        </v-container>
    </div>
</template>

<script>
    import axios from 'axios'
    import ComponentPunto from "@/components/ComponentPunto"

    export default {

        components: {
            ComponentPunto
        },
        mounted() {
            this.$nextTick(() => {
                this.getPuntos();
            })
        },
        data: () => {
            return {

                dataTablePuntos: {
                    headers: [
                        {text: 'ID', align: 'left', sortable: true, value: 'id', width: '1%'},
                        {text: 'Descripcion', value: 'descripcion'},
                        {text: 'Acciones', sortable: false, width: '1%'},
                    ],
                    data: [],
                },
                selectedPunto: null,
                searchPunto: '',
            }
        },
        methods: {
            getPuntos: function () {
                axios.get(this.$urlApi.resourcesPuntos
                ).then(response => {
                    this.dataTablePuntos.data = response.data;
                }).catch(errors => {
                    console.log('error servidor')
                });
            },
            eliminarPunto: function (punto) {
                this.$swal().then(result => {
                    if (result.isConfirmed) {
                        axios.delete(this.$urlApi.resourcesPuntos + '/' + punto.id
                        ).then(response => {
                            this.getPuntos()
                            this.$toastr('success', '', 'TAREA REALIZADA CON ÉXITO');
                        }).catch(errors => {
                            this.$notifyErrors(errors)
                            console.log('error servidor')
                        })
                    }
                })
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
