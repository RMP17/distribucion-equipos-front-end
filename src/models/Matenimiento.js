export default class Matenimiento{
    constructor (
        id=null,
        diagnostico_inicial=null,
        tipo_mantenimiento=null,
        equipo_id=null,
        tecnico_id=null,
        observaciones=null,
        matenimiento_realizado=null,
    ) {
        this.id = id;
        this.diagnostico_inicial = diagnostico_inicial,
        this.tipo_mantenimiento = tipo_mantenimiento,
        this.equipo_id = equipo_id,
        this.tecnico_id = tecnico_id,
        this.observaciones = observaciones,
        this.matenimiento_realizado = matenimiento_realizado
    }
}


