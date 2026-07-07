const pool = require("../config/db");

// 1. OBTENER ACCIONES: Modificado para incluir el logo y mandarlo al frontend
const obtenerAcciones = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, simbolo, nombre, logo FROM acciones ORDER BY simbolo ASC"
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error al obtener las acciones",
    });
  }
};

// 2. CREAR ACCIÓN: Recibe el formulario del frontend y lo guarda en Postgres
const crearAccion = async (req, res) => {
  const { nombre, simbolo, logo } = req.body;

  if (!nombre || !simbolo) {
    return res.status(400).json({ error: "Nombre y símbolo son obligatorios" });
  }

  try {
    const simboloMayus = simbolo.toUpperCase();
    // Logo por defecto en caso de que el usuario no ponga una URL válida
    const urlLogo = logo || "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=100";

    const query = "INSERT INTO acciones (nombre, simbolo, logo) VALUES ($1, $2, $3) RETURNING id";
    const result = await pool.query(query, [nombre, simboloMayus, urlLogo]);

    res.status(201).json({ 
      mensaje: "Empresa agregada con éxito", 
      id: result.rows[0].id 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      error: "Error interno al insertar la empresa en la base de datos" 
    });
  }
};

// 3. ELIMINAR ACCIÓN: Borra de la base de datos validando si existe
const eliminarAccion = async (req, res) => {
  const { simbolo } = req.params;

  try {
    const query = "DELETE FROM acciones WHERE simbolo = $1";
    const result = await pool.query(query, [simbolo.toUpperCase()]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "La empresa no existe" });
    }

    res.json({ mensaje: `Empresa ${simbolo} eliminada correctamente` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      error: "No se puede eliminar la empresa. Asegúrate de que no tenga compras o ventas asociadas en el historial." 
    });
  }
};

module.exports = {
  obtenerAcciones,
  crearAccion,
  eliminarAccion
};
