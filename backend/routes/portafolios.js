const express = require("express");
const router = express.Router();

const {
  obtenerPortafolios,
  crearPortafolio,
  obtenerResumenPortafolio,
  obtenerHistorialPortafolio,
  eliminarPortafolio // <--- 1. Agregado aquí
} = require("../controllers/portafoliosController");

router.get("/", obtenerPortafolios);
router.post("/", crearPortafolio);
router.get("/:id/resumen", obtenerResumenPortafolio);
router.get("/:id/historial", obtenerHistorialPortafolio);
router.delete("/:id", eliminarPortafolio); // <--- 2. Agregado aquí

module.exports = router;
