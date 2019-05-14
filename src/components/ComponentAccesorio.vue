<template>
    <div>
        <v-dialog v-model="dialog" persistent max-width="600" origin="top center">
            <v-card>
                <v-card-title class="grey lighten-2">
                    <v-layout align-center justify-space-between fill-height>
                        <span class=title>Accesorios</span>
                        <v-btn color="secondary" flat
                               @click="dialog=!dialog"
                               class="square">
                            <v-icon>close</v-icon>
                        </v-btn>
                    </v-layout>
                </v-card-title>
                <v-card-text>
                    <v-container >
                        <v-form v-model="valid" ref="formAccesorio">
                            <v-layout>
                                <v-flex xs12 md8>
                                    <v-select :items="tipos_accesorios"
                                              v-model="accesorio.tipo_accesorio"
                                              background-color="blue lighten-5"
                                              color="blue darken-4"
                                              item-text="state"
                                              item-value="abbr"
                                              :rules="rules.tipos_accesorios"
                                              box
                                              label="Tipo de accesorio"
                                    ></v-select>
                                </v-flex>
                                <v-flex xs12 md4 >
                                    <v-btn color="info" depressed large left @click="submit">Registrar</v-btn>
                                </v-flex>
                            </v-layout>
                        </v-form>
                        <v-data-table
                                disable-initial-sort
                                :headers="dataTable.headers"
                                :items="dataTable.accesorios"
                        >
                            <!--class="elevation-1" elevacion de data table -->
                            <template v-slot:items="props">
                                <td>{{ props.item.tipo_accesorio }}</td>
                            </template>
                        </v-data-table>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" outline @click="dialog = false">Cerrar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import Accesorio from '@/models/Accesorio';
    import axios from 'axios';

    export default {
        props: {
            idEquipo:{
                default:null
            }
            /*modeEdit: {
                type: Boolean,
                default: false
            }*/
        },
        data: () => ({
            // view
            dataTable:{
                headers: [
                    {
                        text: 'Accesorio',
                        //sortable: false,
                        value: 'tipo_accesorio'
                    },
                    // { text: 'Código', value: 'codigo' },
                ],
                accesorios:[],
            },
            valid: false,
            dialog: false,
            rules: {
                tipos_accesorios: [
                    v => !!v || 'Accesorio es requerido',
                    /*v => (v && v.length <= 10) || 'Name must be less than 10 characters'*/
                ],
            },
            tipos_accesorios: [
                {state: 'Cable de conexión USB', abbr: 'Cable de conexión USB'},
                {state: 'Cable de poder', abbr: 'Cable de poder'},
                {state: 'Transformador', abbr: 'Transformador'},
            ],
            // model
            accesorio: new Accesorio()
        }),
        computed:{

        },
        methods:{
            submit:function () {
                if (this.$refs.formAccesorio.validate()) {
                    axios.post(this.$urlApi.resourcesAccesorio,
                        this.accesorio
                    ).then( response => {
                        this.accesorio = new Accesorio();
                        this.accesorio.equipo_id = this.idEquipo;
                        this.$toastr('success', '','TAREA REALIZADA CON ÉXITO');
                        this.valid=true;
                        this.getAccesoriosEquiposById(this.idEquipo);
                    }).catch( errors => {
                        this.$notifyErrors(errors);
                    });
                }
            },
            openDialog() {
                this.accesorio.equipo_id=this.idEquipo;
                this.getAccesoriosEquiposById(this.idEquipo);
                this.dialog = true;
            },
            getAccesoriosEquiposById(idEquipo){
                axios.get(this.$urlApi.resourcesAccesorio+'/'+idEquipo
                ).then( response => {
                    this.dataTable.accesorios=response.data;
                }).catch( errors => {
                    console.log('error servidor')
                });
            }
        }
    }
</script>
