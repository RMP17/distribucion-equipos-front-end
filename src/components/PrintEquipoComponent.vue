<template>
    <div class="section-to-print" v-if="printData" >
        <div ref="printArea">
            <h2 class="text-uppercase text-xs-center">{{this.title}}</h2>
            <span>Total dispositivos: {{count}}</span>
            <!--<table class="print-table"
                   style="min-width: 100%; border-collapse: collapse;"
            >
                <thead style="background: blanchedalmond">
                <th width="35%">ESTADO FÍSICO DE LOS EQUIPOS</th>
                <th>MODELO</th>
                <th>NÚMERO SERIAL</th>
                <th >OBSERVACIONES</th>
                </thead>
                <tbody >
                <tr v-for="value in printData.equipos">
                    <template v-if="value.tipo==='e'">
                        <td class="caption">
                            {{value.nombre}} {{value.marca}}
                            <span v-for="accesorio in value.accesorios">+{{ accesorio.nombre }}</span>
                        </td>
                        <td v-text="value.modelo" class="text-xs-center caption"></td>
                        <td v-text="value.nro_serie" class="text-xs-center caption"></td>
                        <td > {{ !devuelto? value.pivot.observacion:value.pivot.observacion_devolucion}} </td>
                    </template>
                </tr>
                <tr style="background: blanchedalmond"><td colspan="4">OTROS</td></tr>
                <tr v-for="value in printData.equipos">
                    <template v-if="value.tipo==='o'">
                        <td class="caption">
                            {{value.nombre}} {{value.marca}}
                            <span v-for="accesorio in value.accesorios">+{{ accesorio.nombre }}</span>
                        </td>
                        <td v-text="value.modelo" class="text-xs-center caption"></td>
                        <td v-text="value.nro_serie" class="text-xs-center caption"></td>
                        <td ></td>
                    </template>
                </tr>
                </tbody>
            </table>-->
            <v-data-table
                    :headers="headersFormatted"
                    :items="printData"
                    disable-initial-sort
                    hide-actions
            >
                <!--class="elevation-1" elevacion de data table -->
                <template v-slot:items="props">
                    <td>{{ props.item.codigo_activo }}</td>
                    <td>{{ props.item.nro_serie }}</td>
                    <td>{{ props.item.service_tag }}</td>
                    <td>{{ props.item.tipo_equipo? props.item.tipo_equipo.nombre:'' }}</td>
                    <td>{{ props.item.marca? props.item.marca.nombre:'' }}</td>
                    <td>{{ props.item.modelo? props.item.modelo.nombre:'' }}</td>
                    <td>
                        <span v-if="props.item.estado === 'b'">Bueno</span>
                        <span v-if="props.item.estado === 'r'">En Reparación</span>
                        <span v-if="props.item.estado === 'd'">Dañado</span>
                    </td>
                    <td>{{ props.item.created_at }}</td>
                </template>
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
            print() {
                if (this.printData) {
                    this.$printCustom(this.$refs.printArea);
                } else {
                    this.$notifyErrorsLocal(['No tiene un kit asignado'])
                }
            },
        }
    }
</script>
<style scoped>
</style>
