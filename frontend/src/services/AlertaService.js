import http from "./http-common"

const getAll = async () => {
    return http.get("/alertas");
};

const get = async (id = 1, body) => {
    return http.post(`/alertas/${id}`, body);
};

const post = async (body) => {
    return http.post("/alertas", body);
};

const put = async (body) => {
    return http.put(`/alertas/${body.idAlerta}`, body);
};

const AlertaService = {
    getAll,
    get,
    post,
    put
};

export default AlertaService;