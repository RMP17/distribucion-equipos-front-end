export default class Persona{
    constructor (
        id = null,
        ci = null,
        nombre = null,
        apellido1 = null,
        apellido2 = null,
        extension = null,
        celular = null,
        empresa_telefonica = null,
        profesion = null
    ) {
        this.id = id;
        this.ci = ci;
        this.nombre = nombre;
        this.apellido1 = apellido1;
        this.apellido2 = apellido2;
        this.extension = extension;
        this.celular = celular;
        this.empresa_telefonica = empresa_telefonica;
        this.profesion = profesion;
    }
}


