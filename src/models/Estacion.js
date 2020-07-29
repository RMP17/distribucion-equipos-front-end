export default class Estacion {
    constructor(
        id = null,
        nro_estacion = null,
        nro_counter_c = null,
        nro_counter_r = null,
        tipo_estacion = 'f',
        direccion = null,
        pro_ele_ref_id = null,
        tecnico_id = null,
        notario_id = null,
        kit_id = null,
        punto_empadronamiento_id = null,
    ) {
        this.id = id;
        this.nro_estacion = nro_estacion;
        this.nro_counter_c = nro_counter_c;
        this.nro_counter_r = nro_counter_r;
        this.tipo_estacion = tipo_estacion;
        this.direccion = direccion;
        this.pro_ele_ref_id = pro_ele_ref_id;
        this.tecnico_id = tecnico_id;
        this.notario_id = notario_id;
        this.kit_id = kit_id;
        this.punto_empadronamiento_id = punto_empadronamiento_id;
    }
}


