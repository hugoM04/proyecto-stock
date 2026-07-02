const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API de Stock Manager funcionando");
});

app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      ok: true,
      servidor: result.rows[0].now,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      mensaje: "Error de conexión con PostgreSQL",
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en puerto ${PORT}`);
});

const accionesRoutes = require("./routes/acciones");

app.use("/api/acciones", accionesRoutes);

const portafoliosRoutes = require("./routes/portafolios");

app.use("/api/portafolios", portafoliosRoutes);

const comprasRoutes = require("./routes/compras");

app.use("/api/compras", comprasRoutes);

const ventasRoutes = require("./routes/ventas");

app.use("/api/ventas", ventasRoutes);

const cotizacionesRoutes = require("./routes/cotizaciones");

app.use("/api/cotizacion", cotizacionesRoutes);
