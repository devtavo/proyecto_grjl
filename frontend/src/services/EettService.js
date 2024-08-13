import http from "./http-common"

const ID_ETT = 0;

const getAll = async (idEtt = ID_ETT) => {

    return http.get(`/eett?idEtt=${idEtt}`);

};

const post = async (body) => {
    return http.post("/eett", body);
};

const generarDiario = async () => {
    return http.post("/generarDiario");
};

const generaEnvio = async () => {
    return http.post("/envioCorreo");
};
const postViaje = async (body) => {
    return http.post("/eettViaje", body);
};

const put = async (body) => {
    return http.put(`/eett/${body.id}`, body);
};

const putViaje = async (body) => {
    return http.put(`/eettViaje/${body.id}`, body);
};


const EettService = {
    getAll,
    post,
    put,
    postViaje,
    putViaje,
    generarDiario,
    generaEnvio
};

export default EettService;