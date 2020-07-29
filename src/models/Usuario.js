export default class Usuario{
    constructor (
        id = null,
        usuario = null,
        contrasenia = null,
        confirmar_contrasenia = null,
        nivel_acceso = 1,
        tecnico = null,
        coordinador = null,
    ) {
        this.id = id;
        this.usuario = usuario;
        this.contrasenia = contrasenia;
        this.confirmar_contrasenia = confirmar_contrasenia;
        this.nivel_acceso = nivel_acceso;
        this.tecnico = tecnico;
        this.coordinador = coordinador;
    }
}


