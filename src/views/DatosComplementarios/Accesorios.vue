<template>
    <div>
        <h4 class="pa-2" style="border-bottom:5px solid skyblue">{{$route.meta.subname}}</h4>
        <v-container fluid>
            <v-layout row>
                <AccesorioComponent @register-success="getAccesorios"/>
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
                    <td >
                        <v-layout class="justify-center" row>
                            <v-btn @click="editAccesorio(props.item)"
                                   class="white--text" color="success"
                                   depressed
                                   round
                                   small
                            >
                                <v-icon>edit</v-icon>
                                Editar
                            </v-btn>
                            <v-btn @click="eliminarAccesorio(props.item)"
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
            <AccesorioComponent :edit-data="selected" mode-edit ref="componentAccesorio"/>
        </v-container>
    </div>
</template>

<script>
    import axios from 'axios'
    import AccesorioComponent from "@/components/AccesorioComponent"

    export default {

        components: {
            AccesorioComponent
        },
        mounted() {
            this.$nextTick(() => {
                this.getAccesorios();
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
                    data: [],
                },
                selected: null,
                search: '',
            }
        },
        methods: {
            getAccesorios: function () {
                axios.get(this.$urlApi.resourcesAccesorio
                ).then(response => {
                    this.dataTable.data = response.data;
                }).catch(errors => {
                    console.log('error servidor')
                });
            },
            eliminarAccesorio: function (accesorio) {
                this.$swal().then(result=>{
                    if (result.isConfirmed){
                        axios.delete(this.$urlApi.resourcesAccesorio+'/'+accesorio.id
                        ).then(response => {
                            this.getAccesorios()
                            this.$toastr('success', '', 'TAREA REALIZADA CON ÉXITO');
                        }).catch(errors => {
                            this.$notifyErrors(errors)
                            console.log('error servidor')
                        });
                    }
                })
            },
            editAccesorio(accesorio) {
                this.selected = accesorio;
                this.$nextTick(() => {
                    this.$refs.componentAccesorio.openDialog();
                });
            }
        },
        computed: {}
    }
</script>
