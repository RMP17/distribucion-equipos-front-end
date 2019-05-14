import Persona from './Persona'

export default class Notario extends Persona{
    constructor(
        tipo_estacion=null,
        nro_estacion=null,
        experiencia_procesos_anteriores=null
    ) {
        super();
        this.tipo_estacion=tipo_estacion;
        this.nro_estacion=nro_estacion;
        this.experiencia_procesos_anteriores=experiencia_procesos_anteriores;
    }
}


