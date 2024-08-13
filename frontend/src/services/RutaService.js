import http from "./http-common"

const getAll = async () => {
    return http.get("/rutas");
};

const getRutasHistorico = async (body) => {
    return http.post("/rutasHistorico",body);
};

const post = async (body) => {
    return http.post("/rutas", body);
};

const put = async (body) => {
    return http.put(`/rutas/${body.idRuta}`, body);
};

const getRutasValidacion = async (body)=>{
    return http.post("/rutasValidacion",body)
};

const getRutaValida = async (body)=>{
    return http.post("/rutaValida",body)
};

const getRutasEmpresa = async (body)=>{
    return http.post("/rutasEmpresa",body)
};

const uploadFile = async (idEtt,body)=>{
    const formData = new FormData();
    formData.append('file', body);
    formData.append('idEtt', idEtt);

    return http.post("/upload",formData)
};

const RutaService = {
    getAll,
    getRutasHistorico,
    post,
    put,
    getRutasValidacion,
    getRutaValida,
    getRutasEmpresa,
    uploadFile

};

export default RutaService;