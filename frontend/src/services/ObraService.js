import http from "./http-common"

const getAll = async () => {
    return http.get("/obras");
};

const post = async (body) => {
    return http.post("/obras", body);
};

const put = async (body) => {
    return http.put(`/obras/${body.id}`, body);
};

const ObraService = {
    getAll,
    post, 
    put,
};

export default ObraService;