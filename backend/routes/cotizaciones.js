const express = require("express");

const router = express.Router();

const {
    obtenerCotizacionPorSimbolo
} = require("../controllers/cotizacionesController");

router.get("/:simbolo", obtenerCotizacionPorSimbolo);

module.exports = router;
