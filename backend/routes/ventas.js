const express = require("express");

const router = express.Router();

const {
  obtenerVentas,
  crearVenta,
} = require("../controllers/ventasController");

router.get("/", obtenerVentas);
router.post("/", crearVenta);

module.exports = router;

