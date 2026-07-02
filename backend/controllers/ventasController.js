const pool = require("../config/db");

// Obtener todas las ventas
const obtenerVentas = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        v.id,
        p.nombre AS portafolio,
        a.simbolo,
        a.nombre AS accion,
        v.cantidad,
        v.precio_venta,
        v.fecha
      FROM ventas v
      JOIN portafolios p ON v.portafolio_id = p.id
      JOIN acciones a ON v.accion_id = a.id
      ORDER BY v.fecha DESC
    `);

    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error al obtener las ventas",
    });
  }
};

// Registrar una venta
const crearVenta = async (req, res) => {
  try {
    const {
      portafolio_id,
      accion_id,
      cantidad
    } = req.body;

    if (!portafolio_id || !accion_id || !cantidad || !precio_venta) {
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

    // Total comprado
    const compras = await pool.query(
      `
      SELECT COALESCE(SUM(cantidad), 0) AS total
      FROM compras
      WHERE portafolio_id = $1
        AND accion_id = $2
      `,
      [portafolio_id, accion_id]
    );

    // Total vendido
    const ventas = await pool.query(
      `
      SELECT COALESCE(SUM(cantidad), 0) AS total
      FROM ventas
      WHERE portafolio_id = $1
        AND accion_id = $2
      `,
      [portafolio_id, accion_id]
    );

    const totalComprado = Number(compras.rows[0].total);
    const totalVendido = Number(ventas.rows[0].total);

    const disponibles = totalComprado - totalVendido;

    if (cantidad > disponibles) {
      return res.status(400).json({
        mensaje: `No es posible vender ${cantidad} acciones. Solo hay ${disponibles} disponibles.`,
      });
    }

    const result = await pool.query(
      `
      INSERT INTO ventas
      (portafolio_id, accion_id, cantidad, precio_venta)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [portafolio_id, accion_id, cantidad, precio_venta]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error al registrar la venta",
    });
  }
};

module.exports = {
  obtenerVentas,
  crearVenta,
};
