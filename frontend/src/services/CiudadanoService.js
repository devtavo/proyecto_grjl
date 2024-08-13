import http from "./http-common"

const getOpcionesRuta = async (body) => {
    return http.post("/getOpciones", body);
};

const getHashValido = async (body) => {
    return http.post("/getHashValido", body);
};

const CiudadanoService = {
    getOpcionesRuta,
    getHashValido
};

export default CiudadanoService;