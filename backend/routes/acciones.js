const express = require("express");
const router = express.Router();

const {
  obtenerAcciones,
  crearAccion,
  eliminarAccion
} = require("../controllers/accionesController");

// Ruta original para listar
router.get("/", obtenerAcciones);

// Nuevas rutas para tu formulario de administración
router.post("/", crearAccion);
router.delete("/:simbolo", eliminarAccion);

module.exports = router;
