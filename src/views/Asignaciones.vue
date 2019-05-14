<template>
    <v-container fluid>
        <v-layout row>
            <v-text-field
                    color="blue darken-4"
                    background-color="blue lighten-5"
                    class="pa-0"
                    v-model="search"
                    append-icon="search"
                    label="Buscar..."
                    single-line
                    hide-details
            ></v-text-field>
        </v-layout>
        <v-data-table
                disable-initial-sort
                :headers="dataTable.headers"
                :items="dataTable.estaciones"
                :search="search"
        >
            <template v-slot:items="props">
                <td>{{ props.item.nro_estacion }}</td>
                <td>{{ props.item.nro_counter_c }}</td>
                <td>{{ props.item.nro_counter_r }}</td>
                <td>
                    <span v-if="props.item.tipo_estacion === 'f'">Fija</span>
                    <span v-else>Móvil</span>
                </td>
                <td>{{ props.item.direccion }}</td>
                <td>{{ props.item.tecnico ? props.item.tecnico.nombre_completo:'' }}</td>
                <td>{{ props.item.kit ? props.item.kit.id:'' }}</td>
                <td>{{ props.item.notario ? props.item.notario.nombre_completo:'' }}</td>
                <td>{{ props.item.notario ? props.item.notario.ci:'' }}</td>
                <td>{{ props.item.notario ? props.item.notario.extension:'' }}</td>
                <td>{{ props.item.notario ? props.item.notario.celular:'' }}</td>
                <td>{{ props.item.notario ? props.item.notario.empresa_telefonica:'' }}</td>
                <td class="justify-center">
                    <v-btn color="info"
                           @click="editEstacion(props.item)"
                           flat
                           class="square"
                           title="Accesorios">
                        <v-icon>edit</v-icon>
                    </v-btn>
                    <v-btn color="info"
                           @click="getEquiposByKit(props.item)"
                           flat
                           class="square"
                           title="Imprimir">
                        <v-icon >print</v-icon>
                    </v-btn>
                    <v-btn color="accent"
                           @click="getEquiposByKit(props.item)"
                           flat
                           class="square"
                           title="Imprimir">
                        <v-icon >print</v-icon>
                    </v-btn>
                </td>
            </template>
            <v-alert v-slot:no-results :value="true" color="error" icon="warning">
                Your search for "{{ search }}" found no results.
            </v-alert>
        </v-data-table>
        <component-asignacion ref="componentsAsignacion" :edit-data="selectedEstacion" @registerSuccess="getEstaciones" />
        <component-print-asignacion :print-data="printEstacion" ref="componentPrintAsignacion"/>
    </v-container>
</template>

<script>
    import ComponentEquipo from '../components/ComponentEquipo.vue'
    import axios from 'axios';
    import ComponentAccesorio from "../components/ComponentAccesorio.vue";
    import ComponentAsignacion from "../components/ComponentAsignacion.vue";
    import ComponentPrintAsignacion from "../components/ComponentPrintAsignacion.vue";

    export default {
        components: {
            ComponentAccesorio,
            ComponentEquipo,
            ComponentAsignacion,
            ComponentPrintAsignacion
        },
        mounted() {
            this.$nextTick(() => {
                this.getEstaciones();
            })
        },
        data() {
            return {
                dataTable: {
                    headers: [
                        {
                            text: 'Nro Estación',
                            // align: 'left',
                            //sortable: false,
                            value: 'nro_estacion'
                        },
                        {text: 'Nro Counter C', value: 'nro_counter_c'},
                        {text: 'Nro Counter R', value: 'nro_counter_r'},
                        {text: 'Tipo de estación', value: 'tipo_estacion'},
                        {text: 'Dirección', value: 'direccion'},
                        {text: 'Tecnico', value: 'tecnico.nombre_completo'},
                        {text: 'Nro Kit', value: 'kit.id'},
                        {text: 'Notario', value: 'notario.nombre_completo'},
                        {text: 'C.I.', value: 'notario.ci'},
                        {text: 'Ext.', value: 'notario.extension'},
                        {text: 'Celular', value: 'notario.extension'},
                        {text: 'Emp. Tel.', value: 'notario.empresa_telefonica'},
                        {text: '',  sortable: false, value: ''},
                    ],
                    estaciones: [],
                },
                search: '',
                selectedEstacion: null,
                printEstacion: null,
            }
        },
        computed: {

        },
        methods: {
            getEstaciones: function () {
                axios.get(this.$urlApi.resourcesEstacion
                ).then(response => {
                    this.dataTable.estaciones = response.data;
                }).catch(errors => {
                    console.log('error servidor')
                });
            },
            editEstacion(estacion) {
                this.selectedEstacion = estacion;
                this.$nextTick(() => {
                    this.$refs.componentsAsignacion.openDialog();
                });
            },
            getEquiposByKit(estacion) {
                axios.get(this.$urlApi.getEquiposByKit+estacion.kit_id
                ).then(response => {
                    this.printEstacion = estacion;
                    this.printEstacion.equipos = response.data;
                }).catch(errors => {
                    console.log('error servidor')
                }).then(response => {
                    this.$refs.componentPrintAsignacion.printAsignacion();
                });
            },
        }
    }
</script>
