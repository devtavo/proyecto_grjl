import http from "./http-common";

const getAll = async () => {
    return http.get("/reportes");
};

const getSubsidio = async () => {
    return http.get("/subsidio");
};

const getEmpresas = async (reporteId = 0, inicio, final) => {
    return http.get(`/reportes/${reporteId}/empresas/${inicio}/${final}`);
};

const getRutas = async (reporteId = 0, empresaId = 0, inicio, final) => {
    return http.get(`/reportes/${reporteId}/empresas/${empresaId}/rutas/${inicio}/${final}`);
};

const getVehiculos = async (reporteId = 0, empresaId = 0, rutaId = 0, inicio, final) => {
    return http.get(`/reportes/${reporteId}/empresas/${empresaId}/rutas/${rutaId}/vehiculos/${inicio}/${final}`);
};

const ReporteService = {
    getAll,
    getEmpresas,
    getRutas,
    getVehiculos,
    getSubsidio
};

export default ReporteService;