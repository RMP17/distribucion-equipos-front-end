const url='http://127.0.0.1:8000/api/';

export default {
    login:url+'login',
    register:url+'register',
    logout:url+'logout',

    resourcesUsuarios:url+'users',

    resourcesEquipo:url+'equipo',
    removeEquipoOfKit:url+'equipo/kit/remove',
    resourcesTecnico:url+'tecnico',
    resourcesNotario:url+'notario',
    resourcesProfesion:url+'profesiones',
    resourcesPuntos:url+'puntos',
    resourcesMarcas:url+'marcas',
    resourcesModelos:url+'modelos',
    resourcesPersonal:url+'personal',
    resourcesCoordinador:url+'coordinadores',
    resourcesAccesorio:url+'accesorio',
    resourcesProEleRef:url+'pro-ele-ref',
    resourcesEstacion:url+'estacion',
    resourcesTiposEquipos:url+'tipos-equipos',
    resourcesMantenimiento:url+'mantenimientos',
    // resourcesKit:url+'kit',
    addEquipoToEstacion:url+'estacion/add-equipo',
    saveObservacion:url+'estacion/save-observacion',
    entregarDevolver:url+'estacion/entregar',
    getEquiposByEstacion:url+'estacion/equipos/',
    // changeEstadoEquipo:url+'estacion/change-estado-equipo', // NO se esta usando
    changeEstadoEquipo:url+'equipo/change-status/',
    assignNotario:url+'estacion/assign-notario',
    contratarNotario:url+'notario/contratado/',
    reporteEstacion:url+'estacion/reporte/',
    getEquipoByNroSerie:url+'equipo/nro-serie/',
    // returnEquipment:url+'estaciones/return-equipment/',
};
