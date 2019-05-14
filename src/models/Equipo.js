export default class Equipo{
    constructor (
        id=null,
        descripcion=null,
        tipo='e',
        codigo=null,
        modelo=null,
        nro_serie=null,
        estado='b',
        accesorios=[]
    ) {
        this.id = id;
        this.descripcion = descripcion;
        this.tipo = tipo;
        this.codigo = codigo;
        this.modelo = modelo;
        this.nro_serie = nro_serie;
        this.estado = estado;
        this.accesorios = accesorios;
    }
}


