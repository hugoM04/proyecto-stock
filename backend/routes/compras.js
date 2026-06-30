const express = require("express");

const router = express.Router();

const {
  obtenerCompras,
  crearCompra
} = require("../controllers/comprasController");

router.get("/", obtenerCompras);

router.post("/", crearCompra);

module.exports = router;
