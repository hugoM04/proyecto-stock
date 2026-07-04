const axios = require("axios");

const TOKEN = process.env.MARKETDATA_TOKEN;
const BASE_URL = process.env.MARKETDATA_BASE_URL;

/**
 * Obtener cotización de uno o varios símbolos.
 * @param {string} simbolos Ejemplo: "AAPL" o "AAPL,META,IBM"
 */
const obtenerCotizacion = async (simbolos) => {
  try {

    const url = `${BASE_URL}?token=${TOKEN}&symbols=${simbolos}`;

    const response = await axios.get(url);

    return response.data;

  } catch (error) {

    console.error("Error MarketData:", error.message);

    if (error.response) {

        throw new Error("MarketData respondió con un error.");

    }

    if (error.request) {

        throw new Error("No fue posible conectar con MarketData.");

    }

    throw new Error("Error inesperado al consultar MarketData.");

   }
};

module.exports = {
  obtenerCotizacion
};
