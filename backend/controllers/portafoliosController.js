const pool = require("../config/db");

// Obtener todos los portafolios
const obtenerPortafolios = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, nombre, fecha_creacion
      FROM portafolios
      ORDER BY id ASC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener los portafolios" });
  }
};

// Crear un nuevo portafolio
const crearPortafolio = async (req, res) => {
  try {
    const { nombre } = req.body;

    if (!nombre || nombre.trim() === "") {
      return res.status(400).json({
        mensaje: "El nombre del portafolio es obligatorio",
      });
    }

    const result = await pool.query(
      `INSERT INTO portafolios (nombre)
       VALUES ($1)
       RETURNING *`,
      [nombre]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al crear el portafolio" });
  }
};

const obtenerResumenPortafolio = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que el portafolio exista
    const portafolio = await pool.query(
      "SELECT * FROM portafolios WHERE id = $1",
      [id]
    );

    if (portafolio.rowCount === 0) {
      return res.status(404).json({
        mensaje: "El portafolio no existe"
      });
    }

    // Obtener el resumen de acciones
    const resumen = await pool.query(`
      SELECT
        a.id AS accion_id,
        a.simbolo,
        a.nombre,
        COALESCE(c.total_compras,0) AS compradas,
        COALESCE(v.total_ventas,0) AS vendidas,
        COALESCE(c.total_compras,0) - COALESCE(v.total_ventas,0) AS disponibles
      FROM acciones a

      LEFT JOIN (
        SELECT accion_id,
               SUM(cantidad) AS total_compras
        FROM compras
        WHERE portafolio_id = $1
        GROUP BY accion_id
      ) c ON a.id = c.accion_id

      LEFT JOIN (
        SELECT accion_id,
               SUM(cantidad) AS total_ventas
        FROM ventas
        WHERE portafolio_id = $1
        GROUP BY accion_id
      ) v ON a.id = v.accion_id

      WHERE c.total_compras IS NOT NULL
         OR v.total_ventas IS NOT NULL

      ORDER BY a.simbolo;
    `, [id]);

    res.json({
      portafolio: portafolio.rows[0].nombre,
      acciones: resumen.rows
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error al obtener el resumen del portafolio"
    });
  }
};


module.exports = {
  obtenerPortafolios,
  crearPortafolio,
  obtenerResumenPortafolio
};
