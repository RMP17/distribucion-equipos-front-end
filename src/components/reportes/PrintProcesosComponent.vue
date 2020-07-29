<template>
    <div class="section-to-print" v-if="printData" >
        <div ref="printArea">
            <h2 class="text-uppercase text-xs-center">{{this.title}}</h2>
            <span>Total Procesos: {{count}}</span>
            <v-data-table
                    :headers="headersFormatted"
                    :items="printData"
                    disable-initial-sort
                    hide-actions
            >
                <template v-slot:items="props">
                    <td>{{ props.item.descripcion }}</td>
                    <td>{{ props.item.fecha }}</td>
                    <td>{{ props.item.fecha_final }}</td>
                    <td>{{ props.item.tipo }}</td>
                    <td>
                        <span v-if="props.item.estado">En proceso</span>
                        <span v-else>Finalizado</span>
                    </td>
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
