import http from "./http-common"

const SENTIDO_RUTA = '1-2';

const getAll = async (idRuta, sentido ) => {
    return http.get(`/paraderos?idRuta=${idRuta}&sentido=${sentido}`);
};

const getParadas = async (idRuta, sentido ) => {
    return http.get(`/paradas?idRuta=${idRuta}&sentido=${sentido}`);
};

const post = async (body) => {
    return http.post("/paraderos", body);
};

const put = async (body) => {
    return http.put(`/paraderos/${body.idRuta}`, body);
};

const ParaderoService = {
    getAll,
    post,
    put,
    getParadas
};

export default ParaderoService;