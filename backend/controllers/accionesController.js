const pool = require("../config/db");

const obtenerAcciones = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, simbolo, nombre FROM acciones ORDER BY simbolo ASC"
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error al obtener las acciones",
    });
  }
};

module.exports = {
  obtenerAcciones,
};
