import api from "./api";

export const obtenerResumen = async (id) => {

    const response = await api.get(`/portafolios/${id}/resumen`);

    return response.data;

};
