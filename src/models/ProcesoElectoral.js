export default class ProcesoElectoral{
    constructor (
        id=null,
        descripcion=null,
        tipo=null,
        fecha=null,
        fecha_final=null,
        activo=null,
    ) {
        this.id = id;
        this.descripcion = descripcion;
        this.tipo = tipo;
        this.fecha = fecha;
        this.fecha_final = fecha_final;
        this.activo = activo;
    }
}


