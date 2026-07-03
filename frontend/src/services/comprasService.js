import api from "./api";

export const registrarCompra = async (datos) => {

    const response = await api.post("/compras", datos);

    return response.data;

};
