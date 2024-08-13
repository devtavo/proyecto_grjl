import http from "./http-common"

const getConstructora = async (body) => {
    return http.get("/constructora", body);
};

const getTransportista = async (body) => {
    return http.get("/transportista", body);
};

const getObras = async (body) => {
    return http.get("/obras", body);
};

const getValidaConstancia = async (inicio,final,body) => {
    return http.post(`/getValidaConstancia/${inicio}/${final}`, body);
};

const generarConstancia = async (body) => {
    return http.post("/generarConstancia",body);
};

const ValidacionService = {
    getConstructora,
    getTransportista,
    getObras,
    getValidaConstancia,
    generarConstancia
};

export default ValidacionService;