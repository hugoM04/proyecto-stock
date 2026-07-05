const express = require("express");
const router = express.Router();

const {
  obtenerPortafolios,
  crearPortafolio,
  obtenerResumenPortafolio,
  obtenerHistorialPortafolio
} = require("../controllers/portafoliosController");

router.get("/", obtenerPortafolios);
router.post("/", crearPortafolio);
router.get("/:id/resumen", obtenerResumenPortafolio);
router.get("/:id/historial", obtenerHistorialPortafolio);

module.exports = router;
