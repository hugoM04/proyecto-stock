const pool = require("../config/db");

// Obtener todas las compras
const obtenerCompras = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        c.id,
        p.nombre AS portafolio,
        a.simbolo,
        a.nombre AS accion,
        c.cantidad,
        c.precio_compra,
        c.fecha
      FROM compras c
      JOIN portafolios p ON c.portafolio_id = p.id
      JOIN acciones a ON c.accion_id = a.id
      ORDER BY c.fecha DESC;
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error al obtener las compras"
    });
  }
};

// Registrar una compra
const crearCompra = async (req, res) => {
  try {
    const {
      portafolio_id,
      accion_id,
      cantidad,
      precio_compra,
    } = req.body;

    if (!portafolio_id || !accion_id || !cantidad || !precio_compra) {
      return res.status(400).json({
        mensaje: "Todos los campos son obligatorios",
      });
    }

    // Validar portafolio
    const existePortafolio = await pool.query(
      "SELECT id FROM portafolios WHERE id = $1",
      [portafolio_id]
    );

    if (existePortafolio.rowCount === 0) {
      return res.status(404).json({
        mensaje: "El portafolio no existe",
      });
    }

    // Validar acción
    const existeAccion = await pool.query(
      "SELECT id FROM acciones WHERE id = $1",
      [accion_id]
    );

    if (existeAccion.rowCount === 0) {
      return res.status(404).json({
        mensaje: "La acción no existe",
      });
    }

    const result = await pool.query(
      `INSERT INTO compras
      (portafolio_id, accion_id, cantidad, precio_compra)
      VALUES ($1, $2, $3, $4)
      RETURNING *`,
      [portafolio_id, accion_id, cantidad, precio_compra]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error al registrar la compra",
    });
  }
};

module.exports = {
  obtenerCompras,
  crearCompra,
};
