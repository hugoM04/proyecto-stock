import axios from "axios";

const api = axios.create({
    baseURL: "/proyecto-stock/api"
});

// Petición para registrar una nueva empresa/acción
export const agregarAccion = async (datos) => {
    const response = await api.post("/acciones", datos);
    return response.data;
};

// Petición para eliminar una empresa/acción usando su símbolo
export const eliminarAccion = async (simbolo) => {
    const response = await api.delete(`/acciones/${simbolo}`);
    return response.data;
};

export default api;
