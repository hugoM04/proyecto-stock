import api from "./api";

export const registrarVenta = async (datos) => {

    const response = await api.post("/ventas", datos);

    return response.data;

};
