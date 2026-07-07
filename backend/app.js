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

// Endpoint para agregar una nueva empresa/acción
app.post("/api/acciones", async (req, res) => {
    const { nombre, simbolo, logo } = req.body;
    
    if (!nombre || !simbolo) {
        return res.status(400).json({ error: "Nombre y símbolo son obligatorios" });
    }

    try {
        // Guardamos el símbolo siempre en mayúsculas
        const simboloMayus = simbolo.toUpperCase();
        
        // El logo puede ser una URL de imagen de internet o un string vacío si no ponen
        const urlLogo = logo || "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=100";

        const [result] = await db.query(
            "INSERT INTO acciones (nombre, simbolo, logo) VALUES (?, ?, ?)",
            [nombre, simboloMayus, urlLogo]
        );

        res.status(201).json({ message: "Empresa agregada con éxito", id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al agregar la empresa en la base de datos" });
    }
});

// Endpoint para eliminar una empresa/acción
app.delete("/api/acciones/:simbolo", async (req, res) => {
    const { simbolo } = req.params;

    try {
        const [result] = await db.query("DELETE FROM acciones WHERE simbolo = ?", [simbolo.toUpperCase()]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "La empresa no existe" });
        }

        res.json({ message: `Empresa ${simbolo} eliminada correctamente` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al eliminar la empresa. Asegúrate de que no tenga transacciones asociadas." });
    }
});
