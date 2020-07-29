<template>
    <div v-if="printData && printData.equipos" class="section-to-print">
        <div ref="printArea">
            <div class="title text-xs-center pb-3">ACTA DE RECEPCIÓN - UNIDAD DE EMPADRONAMIENTO</div>
            <v-layout align-center justify-space-between row fill-height pb-3 >
                <span>Tipo de estación: <span class="font-weight-bold">{{ printData.tipo_estacion==='f' ? 'Fija':'Móvil'  }}</span></span>
                <span>Estación: <span class="font-weight-bold">{{ printData.nro_estacion  }}</span></span>
                <span>Nº Counter: <span class="font-weight-bold">{{ printData.nro_counter_r  }}</span></span>
            </v-layout>
            <table class="print-table"
                   style="min-width: 100%; border-collapse: collapse;"
            >
                <thead style="background: blanchedalmond">
                <th width="35%">ESTADO FÍSICO DE LOS EQUIPOS</th>
                <th>MODELO</th>
                <th>NÚMERO SERIAL</th>
                <th>ESTADO</th>
                <th >OBSERVACIONES</th>
                </thead>
                <tbody >
                <tr v-for="value in printData.equipos">
                    <template v-if="value.tipo==='e'">
                        <td class="caption">
                            {{value.tipo_equipo? value.tipo_equipo.nombre:''}} {{value.marca? value.marca.nombre:''}}
                            <span v-for="accesorio in value.accesorios">+{{ accesorio.nombre }}</span>
                        </td>
                        <td v-text="value.modelo? value.modelo.nombre:''" class="text-xs-center caption"></td>
                        <td v-text="value.nro_serie" class="text-xs-center caption"></td>
                        <td class="text-xs-center caption">
                            <span v-if="value.estado === 'b'">Bien</span>
                                    <span v-if="value.estado === 'r'">En reparación</span>
                                    <span v-if="value.estado === 'd'">De baja</span>
                        </td>
                        <td > {{ !devuelto? value.pivot.observacion:value.pivot.observacion_devolucion}} </td>
                    </template>
                </tr>
<!--                <tr style="background: blanchedalmond"><td colspan="4">OTROS</td></tr>-->
                <tr v-for="value in printData.equipos">
                    <template v-if="value.tipo==='o'">
                        <td class="caption">
                            {{value.tipo_equipo? value.tipo_equipo.nombre:''}} {{value.marca? value.marca.nombre:''}}
                            <span v-for="accesorio in value.accesorios">+{{ accesorio.nombre }}</span>
                        </td>
                        <td v-text="value.modelo? value.modelo.nombre:''" class="text-xs-center caption"></td>
                        <td v-text="value.nro_serie" class="text-xs-center caption"></td>
                        <td ></td>
                    </template>
                </tr>
                </tbody>
            </table>
            <!--<table class="print-table mt-3"
                   style="min-width: 100%; border-collapse: collapse;"
            >
                <thead style="background: blanchedalmond">
                <tr>
                    <th rowspan="2" width="35%">ESTADO FÍSICO DE LOS EQUIPOS</th>
                    <th colspan="2">CONDICIÓN</th>
                    <th rowspan="2" width="35%">OBSERVACIONES</th>
                </tr>
                <tr>
                    <th width="15%">buena</th>
                    <th width="15%">mala</th>
                </tr>
                </thead>
                <tbody >
                <tr v-for="value in printData.equipos">
                    <template v-if="value.tipo==='e'">
                        <td class="caption">
                            {{value.tipo_equipo? value.tipo_equipo.nombre:''}} {{value.marca? value.marca.nombre:''}}
                            <span v-for="accesorio in value.accesorios">+{{ accesorio.nombre }}</span>
                        </td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </template>
                </tr>
                <tr style="background: blanchedalmond"><td colspan="4">OTROS</td></tr>
                <tr v-for="value in printData.equipos">
                    <template v-if="value.tipo==='o'">
                        <td class="caption">
                            {{value.tipo_equipo? value.tipo_equipo.nombre:''}} {{value.marca? value.marca.nombre:''}}
                            <span v-for="accesorio in value.accesorios">+{{ accesorio.nombre }}</span>
                        </td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </template>
                </tr>
                </tbody>
            </table>-->
            <!--<table class="print-table mt-3"
                   style="min-width: 100%; border-collapse: collapse;"
            >
                <thead style="background: blanchedalmond">
                <tr>
                    <th rowspan="2" width="35%">Resultado Tester</th>
                    <th colspan="2">FUNCIÓN</th>
                    <th rowspan="2" width="35%">OBSERVACIONES</th>
                </tr>
                <tr>
                    <th width="15%">CORRECTA</th>
                    <th width="15%">INCORECTA</th>
                </tr>
                </thead>
                <tbody >
                <tr v-for="value in printData.equipos">
                    <template v-if="value.tipo==='e'">
                        <td class="caption">
                            {{value.tipo_equipo? value.tipo_equipo.nombre:''}} {{value.marca? value.marca.nombre:''}}
                            <span v-for="accesorio in value.accesorios">+{{ accesorio.nombre }}</span>
                        </td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </template>
                </tr>
                </tbody>
            </table>-->
            <!--<table class="print-table mt-3"
                   style="min-width: 100%; border-collapse: collapse;"
            >
                <thead style="background: blanchedalmond">
                <tr>
                    <th rowspan="2" width="35%">PRUEBAS</th>
                    <th colspan="2">RESULTADO</th>
                    <th rowspan="2" width="35%">OBSERVACIONES</th>
                </tr>
                <tr>
                    <th width="15%">SI</th>
                    <th width="15%">NO</th>
                </tr>
                </thead>
                <tbody>
                <tr >
                    <td>¿Obtención de respaldo de Datos?</td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr >
                    <td>¿Obtención de respaldo de Logs?</td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr >
                    <td>¿Obtención de reporte Gral. Estadístico de Nuevos Registros?</td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr >
                    <td>¿Obtención de reporte Gral. Estadístico de Cambio de Domicilio?</td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr >
                    <td>¿Impresión de Checkconfig?</td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                </tbody>
            </table>-->

            <!--<table class="print-table mt-3 font-weight-bold"
                   style="min-width: 100%; border-collapse: collapse;"
            >
                <tr>
                    <td style="background: blanchedalmond" colspan="2" width="70%">NOTARIO : {{ printData.notario ? printData.notario.nombre: '' }}</td>
                    <th rowspan="2"><br><br>FIRMA NOTARIO</th>
                </tr>
                <tr style="background: blanchedalmond">
                    <td>C.I. : {{ printData.notario ? printData.notario.ci:'' }}</td>
                    <td width="35%">FECHA : {{!devuelto? printData.fecha_hora_entrega: printData.fecha_hora_devolucion}}</td>
                </tr>
                <tr>
                    <td style="background: blanchedalmond" colspan="2">
                        {{ !devuelto? 'ENTREGADO POR : ':'RECIBIDO POR : '}} {{ printData.tecnico ? printData.tecnico.nombre:'' }}
                    </td>
                    <th rowspan="2"><br><br>FIRMA RESPONSABLE TICs</th>
                </tr>
                <tr>
                </tr>
            </table>-->
            <span class="caption"><span class="font-weight-bold">NOTA:</span>
            El Formulario 002 debidamente llenado y firmado por el personal que realizo  deberá estar acompañado por la impresion resultante de las pruebas de Tester y la impresión resultante de el momento de su entrega al personal responsable de la Revsión de equipos de Estaciones de Registro Biométrico
        </span>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            printData:{
                default:null
            },
            devuelto:false
        },
        data: () => ({

        }),
        watch: {
        },
        computed: {
            dateNow(){
                let today = new Date();
                console.log(today);
                let dd = today.getDate();
                let mm = today.getMonth() + 1; //January is 0!
                let yyyy = today.getFullYear();

                if (dd < 10) {
                    dd = '0' + dd;
                }

                if (mm < 10) {
                    mm = '0' + mm;
                }

                return today = yyyy + '-' + mm + '-' + dd;
            },
        },
        methods: {
            printAsignacion(){
                if(this.printData && this.printData.equipos){
                    this.$printCustom(this.$refs.printArea);
                } else {
                    this.$notifyErrorsLocal(['No tiene un kit asignado'])
                }
            },
        }
    }
</script>
