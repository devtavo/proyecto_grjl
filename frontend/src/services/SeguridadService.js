import http from "./http-common"

const getAll = async () => {
    return http.get("/seguridad");
};

const getRoles = async () => {
    return http.get("/seguridadRoles");
};

const post = async (body) => {
    return http.post("/seguridad", body);
};

const put = async (body) => {
    return http.put(`/seguridad/${body.idPersona}`, body);
};


const SeguridadService = {
    getAll,
    getRoles,
    post,
    put
};

export default SeguridadService;