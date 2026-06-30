const express = require("express");
const router = express.Router();

const {
  obtenerPortafolios,
  crearPortafolio,
  obtenerResumenPortafolio
} = require("../controllers/portafoliosController");

router.get("/", obtenerPortafolios);
router.post("/", crearPortafolio);
router.get("/:id/resumen", obtenerResumenPortafolio);

module.exports = router;
