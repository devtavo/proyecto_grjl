import http from "./http-common";

const getAll = async () => {
    return http.get("/consultas");
};

const get = async (consultaId = 0, queryString = '') => {
    return http.get(`/consultas/${consultaId}?${queryString}`);
};

const getEmpresas = async (consultaId = 0, inicio, final) => {
    return http.get(`/consultas/${consultaId}/empresas/${inicio}/${final}`);
};

const getRutas = async (consultaId = 0, empresaId = 0,inicio,final) => {
    return http.get(`/consultas/${consultaId}/empresas/${empresaId}/rutas/${inicio}/${final}`);
};

const getVehiculos = async (consultaId = 0, empresaId = 0, rutaId = 0,inicio,final) => {
    return http.get(`/consultas/${consultaId}/empresas/${empresaId}/rutas/${rutaId}/vehiculos/${inicio}/${final}`);
};

const ConsultaService = {
    getAll,
    get,
    getEmpresas,
    getRutas,
    getVehiculos
};

export default ConsultaService;