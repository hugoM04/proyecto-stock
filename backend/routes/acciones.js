const express = require("express");
const router = express.Router();

const {
  obtenerAcciones,
} = require("../controllers/accionesController");

router.get("/", obtenerAcciones);

module.exports = router;
