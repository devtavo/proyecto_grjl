import http from "./http-common"
const ID_ETT = 0;

const getAll = async (idEtt = ID_ETT) => {
    return http.get(`/conductores?idEtt=${idEtt}`);
};

const post = async (body) => {
    return http.post("/conductores", body);
};

const put = async (body) => {
    return http.put(`/conductores/${body.idConductor}`, body);
};

const ConductorService = {
    getAll,
    post,
    put
};

export default ConductorService;