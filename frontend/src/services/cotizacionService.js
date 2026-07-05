import api from "./api";

export const obtenerCotizacion = async (simbolo) => {

    const response = await api.get(`/cotizacion/${simbolo}`);

    return response.data;

};
