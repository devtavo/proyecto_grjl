import axios from "axios";

export const BASE_URL_API_WEB = 'http://78.46.16.8:2005/api';
export const BASE_URL_API_AGENT = 'http://78.46.16.8:3700/api';
export const BASE_URL_GEO_SERVER = 'http://78.46.16.8:8080/geoserver';

export default axios.create({
    baseURL: BASE_URL_API_WEB,
    headers: {
        'Content-type': 'application/json'
    }
});