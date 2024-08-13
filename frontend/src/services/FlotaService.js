import http from "./http-common"

const getAll = async (flotaId) => {
    return http.get(`/flota/${flotaId}`);
};

const getVehiculosValidacion = async (body) => {
    return http.post("/flotaValidacion", body);
};

const post = async (body) => {
    return http.post(`/flota/${body.idEtt}`, body);
};

const put = async (body) => {
    return http.put(`/flota/${body.placaVehiculo}`, body);
};

const putRuta = async (body) => {
    return http.put(`/flota/${body.idEtt}/${body.placaVehiculo}`, body);
};

const FlotaService = {
    getAll,
    getVehiculosValidacion,
    post,
    put,
    putRuta
};

export default FlotaService;