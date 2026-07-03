import api from "./api";

export const obtenerAcciones = async () => {

    const response = await api.get("/acciones");

    return response.data;

};
