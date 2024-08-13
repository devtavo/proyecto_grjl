import http from "./http-common"

const getAll = async () => {
    return http.get("/constructoras");
};

const post = async (body) => {
    return http.post("/constructoras", body);
};

const put = async (body) => {
    return http.put(`/constructoras/${body.id}`, body);
};

const SancionService = {
    getAll,
    post, 
    put,
};

export default SancionService;