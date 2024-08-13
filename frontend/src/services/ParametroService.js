import http from "./http-common"

const getAll = async () => {
    return http.get("/parametros");
};

const post = async (body) => {
    return http.post("/parametros", body);
};

const put = async (body) => {
    return http.put(`/parametros/${body.idParametro}`, body);
};

const getParametro = async (body) => {
    return http.post("/parametros/alertas",body);
};

const ParametroService = {
    getAll,
    post,
    put,
    getParametro
};

export default ParametroService;