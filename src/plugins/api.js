const url='http://localhost/enproceso/distribucion-equipos/back-end/public/api/';

export default {
    resourcesEquipo:url+'equipo',
    removeEquipoOfKit:url+'equipo/kit/remove',
    resourcesTecnico:url+'tecnico',
    resourcesNotario:url+'notario',
    resourcesPersonal:url+'personal',
    resourcesAccesorio:url+'accesorio',
    resourcesProEleRef:url+'pro-ele-ref',
    resourcesEstacion:url+'estacion',
    resourcesKit:url+'kit',
    addEquipoToKit:url+'kit/add-equipo',
    getEquiposByKit:url+'kit/equipos/',
    changeEstadoEquipo:url+'kit/change-estado-equipo',
};