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

module.exports = {
  obtenerPortafolios,
  crearPortafolio,
};
