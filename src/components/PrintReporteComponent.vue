<template>
    <div class="section-to-print" v-if="printData" >
        <div ref="printArea">
            <h2 class="text-uppercase text-xs-center">{{this.title}}</h2>
            <span>Total registros: {{count}}</span>
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
                <template v-slot:items="props">
                    <td>{{ props.item.nro_estacion }}</td>
                    <td>{{ props.item.nro_counter_c }}</td>
                    <td>{{ props.item.nro_counter_c_final }}</td>
                    <td>{{ props.item.nro_counter_c_final ? props.item.nro_counter_c_final - props.item.nro_counter_c:'' }}</td>
                    <td>{{ props.item.nro_counter_r }}</td>
                    <td>{{ props.item.nro_counter_r_final }}</td>
                    <td>{{ props.item.nro_counter_r_final? props.item.nro_counter_r_final-props.item.nro_counter_r:'' }}</td>
                    <td>
                        <span v-if="props.item.tipo_estacion === 'f'">Fija</span>
                        <span v-else>Móvil</span>
                    </td>
                    <td>
                        {{
                        props.item.punto_empadronamiento ?
                        props.item.punto_empadronamiento.descripcion:''
                        }}
                    </td>
                    <td>{{ props.item.tecnico ? props.item.tecnico.nombre:'' }}</td>
                    <td>{{ props.item.notario ? props.item.notario.nombre:'' }}</td>
                    <td>{{ props.item.notario ? props.item.notario.ci:'' }}</td>
                    <td>{{ props.item.notario ? props.item.notario.extension:'' }}</td>
                    <td>{{ props.item.notario ? props.item.notario.celular:'' }}</td>
                    <td>{{ props.item.notario ? props.item.notario.empresa_telefonica:'' }}</td>
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
                const _headers = this.headers
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
