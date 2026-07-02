const { obtenerCotizacion } = require("../services/marketDataService");

const obtenerCotizacionPorSimbolo = async (req, res) => {
  try {

    const { simbolo } = req.params;

    const datos = await obtenerCotizacion(simbolo.toUpperCase());

    if (datos.s !== "ok") {
      return res.status(404).json({
        mensaje: "No se encontró la acción"
      });
    }

    res.json({
      simbolo: datos.symbol[0],
      precio: datos.last[0],
      compra: datos.ask[0],
      venta: datos.bid[0],
      cambio: datos.change[0],
      porcentaje: datos.changepct[0],
      volumen: datos.volume[0]
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      mensaje: "Error al consultar MarketData"
    });

  }
};

module.exports = {
  obtenerCotizacionPorSimbolo
};
