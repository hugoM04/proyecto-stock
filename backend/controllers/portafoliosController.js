const pool = require("../config/db");
const { obtenerCotizacion } = require("../services/marketDataService");

// Obtener todos los portafolios
const obtenerPortafolios = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, nombre, fecha_creacion
      FROM portafolios
      ORDER BY id ASC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener los portafolios" });
  }
};

// Crear un nuevo portafolio
const crearPortafolio = async (req, res) => {
  try {
    const { nombre } = req.body;

    if (!nombre || nombre.trim() === "") {
      return res.status(400).json({
        mensaje: "El nombre del portafolio es obligatorio",
      });
    }

    const result = await pool.query(
      `INSERT INTO portafolios (nombre)
       VALUES ($1)
       RETURNING *`,
      [nombre]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al crear el portafolio" });
  }
};

const obtenerResumenPortafolio = async (req, res) => {

    try {

        const { id } = req.params;

        // Verificar que exista el portafolio
        const portafolio = await pool.query(
            "SELECT * FROM portafolios WHERE id = $1",
            [id]
        );

        if (portafolio.rowCount === 0) {

            return res.status(404).json({
                mensaje: "El portafolio no existe"
            });

        }

        // Obtener resumen de compras y ventas
        const resumen = await pool.query(`

            SELECT

                a.id AS accion_id,
                a.simbolo,
                a.nombre,
                a.logo,

                COALESCE(c.total_compras,0) AS compradas,
                COALESCE(c.precio_promedio,0) AS precio_compra,

                COALESCE(v.total_ventas,0) AS vendidas,

                COALESCE(c.total_compras,0) -
                COALESCE(v.total_ventas,0) AS disponibles

            FROM acciones a

            LEFT JOIN (

                SELECT

                    accion_id,

                    SUM(cantidad) AS total_compras,

                    AVG(precio_compra) AS precio_promedio

                FROM compras

                WHERE portafolio_id = $1

                GROUP BY accion_id

            ) c

            ON a.id = c.accion_id

            LEFT JOIN (

                SELECT

                    accion_id,

                    SUM(cantidad) AS total_ventas

                FROM ventas

                WHERE portafolio_id = $1

                GROUP BY accion_id

            ) v

            ON a.id = v.accion_id

            WHERE c.total_compras IS NOT NULL
               OR v.total_ventas IS NOT NULL

            ORDER BY a.simbolo

        `,[id]);

        const acciones = [];

        let totalInvertido = 0;

        let valorActual = 0;

        for(const accion of resumen.rows){

            // Si ya no quedan acciones no se muestran
            if(Number(accion.disponibles) <= 0){

                continue;

            }

            const datos = await obtenerCotizacion(accion.simbolo);

            const precioActual = datos.last[0];

            const invertido =
                Number(accion.precio_compra) *
                Number(accion.disponibles);

            const actual =
                precioActual *
                Number(accion.disponibles);

            const ganancia =
                actual - invertido;

            totalInvertido += invertido;

            valorActual += actual;

            acciones.push({

                accion_id: accion.accion_id,

                simbolo: accion.simbolo,

                nombre: accion.nombre,

                logo: accion.logo,

                cantidad: Number(accion.disponibles),

                precioCompra: Number(accion.precio_compra),

                precioActual,

                valorActual: actual,

                ganancia

            });

        }

        res.json({

            portafolio: portafolio.rows[0].nombre,

            totalInvertido,

            valorActual,

            gananciaTotal: valorActual - totalInvertido,

            acciones

        });

    } catch(error){

        console.error(error);

        res.status(500).json({

            mensaje:"Error al obtener el resumen del portafolio"

        });

    }

};

const obtenerHistorialPortafolio = async (req, res) => {

    try{

        const { id } = req.params;

        const historial = await pool.query(`

            SELECT
                fecha,
                cantidad,
                precio_compra

            FROM compras

            WHERE portafolio_id=$1

            ORDER BY fecha ASC

        `,[id]);

        let acumulado = 0;

        const datos = historial.rows.map(item=>{

            acumulado += Number(item.cantidad) * Number(item.precio_compra);

            return{

                fecha:item.fecha,
                valor:acumulado

            };

        });

        res.json(datos);

    }catch(error){

        console.error(error);

        res.status(500).json({

            mensaje:"Error al obtener historial"

        });

    }

};

const eliminarPortafolio = async (req, res) => {
    const { id } = req.params;

    try {
        // 1. Limpiamos transacciones vinculadas (Sintaxis Postgres con $1)
        await pool.query("DELETE FROM compras WHERE portafolio_id = $1", [id]);
        await pool.query("DELETE FROM ventas WHERE portafolio_id = $1", [id]);

        // 2. Eliminamos el portafolio
        const query = "DELETE FROM portafolios WHERE id = $1";
        const result = await pool.query(query, [id]); 

        // Validamos usando rowCount (Sintaxis nativa de tu pool de Postgres)
        if (result.rowCount === 0) {
            return res.status(404).json({ mensaje: "El portafolio no existe." });
        }

        return res.json({ mensaje: "Portafolio eliminado correctamente." });
    } catch (error) {
        console.error("Error real en el backend al eliminar:", error);
        return res.status(500).json({ 
            mensaje: "Error interno en el servidor al intentar eliminar.",
            detalles: error.message 
        });
    }
};

module.exports = {
  obtenerPortafolios,
  crearPortafolio,
  obtenerResumenPortafolio,
  obtenerHistorialPortafolio,
  eliminarPortafolio 
};
