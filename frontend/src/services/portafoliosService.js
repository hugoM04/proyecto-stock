import api from "./api";

export const obtenerPortafolios = async () => {

    const response = await api.get("/portafolios");

    return response.data;

};
