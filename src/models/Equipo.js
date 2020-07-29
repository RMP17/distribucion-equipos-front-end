export default class Equipo {
    constructor(
        id = null,
        nombre = null,
        marca_id = null,
        modelo_id = null,
        tipo_equipo_id = null,
        tipo = 'e',
        codigo_activo = null,
        service_tag = null,
        modelo = null,
        nro_serie = null,
        estado = 'b',
        descripcion = '',
        origen = '',
        observaciones = '',
        condicion = '',
        created_at = null,
        updated_at = null,
        accesorios = []
    ) {
        this.id = id;
        this.nombre = nombre;
        this.marca_id = marca_id;
        this.modelo_id = modelo_id;
        this.tipo_equipo_id = tipo_equipo_id;
        this.tipo = tipo;
        this.codigo_activo = codigo_activo;
        this.modelo = modelo;
        this.nro_serie = nro_serie;
        this.estado = estado;
        this.descripcion = descripcion
        this.origen = origen
        this.observaciones = observaciones
        this.condicion = condicion
        this.service_tag = service_tag;
        this.created_at = created_at;
        this.updated_at = updated_at;
        this.accesorios = accesorios;
    }
}


