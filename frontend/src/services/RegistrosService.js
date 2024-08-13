import http from "./http-common"

const getAll = async () => {
    return http.get("/registros");
};

const post = async (body) => {
    return http.post("/registros", body);
};

const put = async (body) => {
    return http.put(`/registros/${body.id}`, body);
};


const RegistrosService = {
    getAll,
    post,
    put
};

export default RegistrosService;