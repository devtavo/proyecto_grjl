import http from "./http-common";

const getAll = async () => {
    return http.get("/hexagonos");
};

const HexagonoService = {
    getAll
};

export default HexagonoService;