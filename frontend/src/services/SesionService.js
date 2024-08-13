import http from "./http-common";

const login = async (dispatch, setError, credenciales) => {

    setError(false);

    const response = await http.post("/seguridad/iniciar-sesion", credenciales);
    const token = response.data.token;
    const message = response;
    console.log(response.data)
    if (token) localStorage.setItem('user', JSON.stringify(response.data));
    dispatch({ type: "LOGIN_SUCCESS", idRol: JSON.parse(localStorage.getItem("user"))?.idRol });
    setError(false);

    return response.data;
};

export const isAuthenticated = () => {
    const user = localStorage.getItem('user');
    if (!user) {
        return {};
    }
    return JSON.parse(user);
};

const SesionService = {
    login,
    isAuthenticated
};

export default SesionService;