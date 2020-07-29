<template>
    <div class="section-to-print" v-if="printData" >
        <div ref="printArea">
            <h2 class="text-uppercase text-xs-center">{{this.title}}</h2>
            <span>Total dispositivos: {{count}}</span>
            <v-data-table
                    :headers="headersFormatted"
                    :items="printData"
                    disable-initial-sort
                    hide-actions
            >
                <template v-slot:items="props">
                    <td>
                        {{
                        (props.item.equipo)
                        ? props.item.equipo.codigo_activo:''
                        }}
                    </td>
                    <td>{{ props.item.tecnico ? props.item.tecnico.nombre:'' }}</td>
                    <td>
                        {{
                        (props.item.equipo && props.item.equipo.tipo_equipo)
                        ? props.item.equipo.tipo_equipo.nombre:''
                        }}
                    </td>
                    <td>{{props.item.created_at}}</td>
                    <td>
                        {{
                        props.item.equipo
                        ? props.item.equipo.nro_serie:''
                        }}
                    </td>
                    <!--
                    <td>
                        {{
                        (props.item.equipo && props.item.equipo.marca)
                        ? props.item.equipo.marca.nombre:''
                        }}
                    </td>
                    <td>
                        {{
                        (props.item.equipo && props.item.equipo.modelo)
                        ? props.item.equipo.modelo.nombre:''
                        }}
                    </td>-->
                    <!--<td>
                        <template v-if="props.item.equipo">
                            <span v-if="props.item.equipo.estado === 'b'">Bueno</span>
                            <span v-if="props.item.equipo.estado === 'd'">Dañado</span>
                            <span v-if="props.item.equipo.estado === 'r'">En Reparación</span>
                        </template>
                    </td>-->
                    <td>{{props.item.diagnostico_inicial}}</td>
                    <!--                    <td>{{props.item.tipo_mantenimiento}}</td>-->
                    <td>{{props.item.observaciones}}</td>
                </template>
                <!--<v-alert v-slot:no-results :value="true" color="error" icon="warning">
                  Your search for "{{ search }}" found no results.
                </v-alert>-->
            </v-data-table>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            printData: {
                default: null
            },
            headers: {
                default: []
            },
            title:{
                default:''
            }
        },
        data: () => ({}),
        computed: {
            headersFormatted() {
                const _headers = [...this.headers]
                _headers.pop()
                return _headers
            },
            count(){
                return this.printData.length
            }
        },
        methods: {
            print(){
                if (this.printData) {
                    this.$printCustom(this.$refs.printArea);
                } else {
                    this.$notifyErrorsLocal(['No tiene un kit asignado'])
                }
            }
        }
    }
</script>
<style scoped>
</style>
