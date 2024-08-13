import axios from "axios";
import http, { BASE_URL_API_AGENT } from "./http-common";

const getAll = async () => {
    return http.get("/emv");
};

const post = async (body) => {
    return http.post("/emv", body);
};

const put = async (body) => {
    return http.put(`/emv/${body.idEmv}`, body);
};

const refreshToken = async (body) => {
    return axios.post(`${BASE_URL_API_AGENT}/users/refresh-token`, body);
}


const EmvService = {
    getAll,
    post,
    put,
    refreshToken
};

export default EmvService;