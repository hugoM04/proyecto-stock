import api from "./api";

export const obtenerHistorial = async(id)=>{

    const response = await api.get(`/portafolios/${id}/historial`);

    return response.data;

};
