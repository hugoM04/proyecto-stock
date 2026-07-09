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

        // Obtener resumen de compras y ventas agrupadas con cálculos de rendimiento por venta
        const resumen = await pool.query(`
            SELECT
                a.id AS accion_id,
                a.simbolo,
                a.nombre,
                a.logo,
                COALESCE(c.total_compras, 0) AS compradas,
                COALESCE(c.precio_promedio, 0) AS precio_compra,
                COALESCE(v.total_ventas, 0) AS vendidas,
                COALESCE(v.precio_venta_promedio, 0) AS precio_venta,
                -- Cantidad que queda disponible
                COALESCE(c.total_compras, 0) - COALESCE(v.total_ventas, 0) AS disponibles,
                -- 💡 TU PETICIÓN: Ganancia realizada real guardada de las ventas hechas
                COALESCE(v.total_rendimiento, 0) AS ganancia_ventas
            FROM acciones a
            LEFT JOIN (
                SELECT
                    accion_id,
                    SUM(cantidad) AS total_compras,
                    AVG(precio_compra) AS precio_promedio
                FROM compras
                WHERE portafolio_id = $1
                GROUP BY accion_id
            ) c ON a.id = c.accion_id
            LEFT JOIN (
                SELECT
                    accion_id,
                    SUM(cantidad) AS total_ventas,
                    AVG(precio_venta) AS precio_venta_promedio,
                    -- Sumamos el rendimiento calculado acumulado de esta acción
                    SUM(COALESCE(rendimiento_calculado, 0)) AS total_rendimiento
                FROM ventas
                WHERE portafolio_id = $1 AND estado = 'completada'
                GROUP BY accion_id
            ) v ON a.id = v.accion_id
            WHERE c.total_compras IS NOT NULL OR v.total_ventas IS NOT NULL
            ORDER BY a.simbolo
        `, [id]);

        // Historial real de ventas individuales para el componente lateral
        // (Pendientes y Completadas)
	const ventasHistorial = await pool.query(`
	    SELECT
	        v.id,
	        a.simbolo,
	        v.cantidad,
	        v.precio_venta,
	        v.rendimiento_calculado,
	        v.tipo_orden,     -- 💡 Agregado para saber si es mercado o límite
	        v.estado,         -- 💡 Agregado para renderizar 'pendiente' o 'completada' en React
	        v.fecha
	    FROM ventas v
	    JOIN acciones a ON v.accion_id = a.id
	    WHERE v.portafolio_id = $1 -- 🚀 Quitamos el filtro: AND v.estado = 'completada'
	    ORDER BY v.fecha DESC
	    LIMIT 10
	`, [id]);

        const acciones = [];
        let totalInvertido = 0;
        let valorActual = 0;
        let gananciaTotalAcumulada = 0;

        for (const accion of resumen.rows) {
            // 🚀 CORRECCIÓN CLAVE: Eliminamos el 'continue' para que NUNCA desapariencia la acción del portafolio.
            const cantidadDisponibles = Number(accion.disponibles);

            const datos = await obtenerCotizacion(accion.simbolo);
            const precioActual = datos.last[0];

            // Rendimiento de lo que aún mantienes flotando en el mercado
            const invertido = Number(accion.precio_compra) * cantidadDisponibles;
            const actual = precioActual * cantidadDisponibles;
            const gananciaFlotante = actual - invertido;

            // Ganancia fija realizada por tus ventas (Ej: Los 100 pesos de diferencia por acción vendida)
            const gananciaPorVentasRealizadas = Number(accion.ganancia_ventas);

            totalInvertido += invertido;
            valorActual += actual;
            
            // La ganancia de esta acción es lo latente del mercado + lo que ya le ganaste vendiendo caro
            const gananciaFinalAccion = gananciaFlotante + gananciaPorVentasRealizadas;
            gananciaTotalAcumulada += gananciaFinalAccion;

            acciones.push({
                accion_id: accion.accion_id,
                simbolo: accion.simbolo,
                nombre: accion.nombre,
                logo: accion.logo,
                cantidad: cantidadDisponibles, // Mostrará 0 si vendiste todo, pero seguirá visible
                precioCompra: Number(accion.precio_compra),
                precioActual,
                valorActual: actual,
                // Mandamos la ganancia combinada (Mercado actual + tus ventas ganadas fijas)
                ganancia: gananciaFinalAccion,
                gananciaRealizadaVenta: gananciaPorVentasRealizadas
            });
        }

        res.json({
            portafolio: portafolio.rows[0].nombre,
            totalInvertido,
            valorActual,
            gananciaTotal: gananciaTotalAcumulada,
            acciones,
            ventas: ventasHistorial.rows
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: "Error al obtener el resumen del portafolio"
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
