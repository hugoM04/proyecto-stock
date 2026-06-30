const express = require("express");
const router = express.Router();

const {
  obtenerPortafolios,
  crearPortafolio,
} = require("../controllers/portafoliosController");

router.get("/", obtenerPortafolios);
router.post("/", crearPortafolio);

module.exports = router;
