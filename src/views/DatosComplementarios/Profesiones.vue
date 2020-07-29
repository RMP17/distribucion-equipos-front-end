<template>
    <div>
        <h4 class="pa-2" style="border-bottom:5px solid skyblue">{{$route.meta.subname}}</h4>
        <v-container fluid>
            <v-layout row>
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
                        <v-layout class="justify-center" row>
                            <v-btn @click="editProfesion(props.item)"
                                   class="white--text" color="success"
                                   depressed
                                   round
                                   small
                            >
                                <v-icon>edit</v-icon>
                                Editar
                            </v-btn>
                            <v-btn @click="eliminarProfesion(props.item)"
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

            <component-profesion :edit-data="selectedProfesion" mode-edit ref="componentProfesion"/>
        </v-container>
    </div>
</template>

<script>
    import axios from 'axios'
    import ComponentProfesion from "@/components/ComponentProfesion"
    export default {

        components: {
            ComponentProfesion
        },
        mounted() {
            this.$nextTick(() => {
                this.getProfesiones();
            })
        },
        data: () => {
            return {
                smsConfirmacion:true,
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
            eliminarProfesion: function (profesion) {
                this.$swal().then(result=>{
                    if (result.isConfirmed){
                        axios.delete(this.$urlApi.resourcesProfesion+'/'+profesion.id
                        ).then(response => {
                            this.getProfesiones()
                            this.$toastr('success', '', 'TAREA REALIZADA CON ÉXITO');
                        }).catch(errors => {
                            this.$notifyErrors(errors)
                            console.log('error servidor')
                        });
                    }
                });
            },
            editProfesion(profesion) {
                this.selectedProfesion = profesion;
                this.$nextTick(() => {
                    this.$refs.componentProfesion.openDialog();
                });
            }
        },
        computed: {}
    }
</script>
