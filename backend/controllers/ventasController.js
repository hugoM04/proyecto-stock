const pool = require("../config/db");
const { obtenerCotizacion } = require("../services/marketDataService");

// Obtener todas las ventas
const obtenerVentas = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        v.id,
        p.nombre AS portafolio,
        a.simbolo,
        a.nombre AS accion,
        v.cantidad,
        v.precio_venta,
        v.tipo_orden,
        v.precio_limite,
        v.estado,
        v.rendimiento_calculado,
        v.fecha
      FROM ventas v
      JOIN portafolios p ON v.portafolio_id = p.id
      JOIN acciones a ON v.accion_id = a.id
      ORDER BY v.fecha DESC
    `);

    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error al obtener las ventas",
    });
  }
};

// Registrar una venta (Mercado o Límite)
const crearVenta = async (req, res) => {
  try {
    const {
      portafolio_id,
      accion_id,
      cantidad,
      tipo_orden,     // 'mercado' o 'limite' (Enviado desde React)
      precio_limite   // El precio que quiere el usuario (Si es limite)
    } = req.body;

    if (!portafolio_id || !accion_id || !cantidad) {
      return res.status(400).json({
        mensaje: "Todos los campos son obligatorios",
      });
    }

    if (cantidad <= 0) {
      return res.status(400).json({
        mensaje: "La cantidad debe ser mayor que cero.",
      });
    }

    // Validar portafolio
    const existePortafolio = await pool.query(
      "SELECT id FROM portafolios WHERE id = $1",
      [portafolio_id]
    );

    if (existePortafolio.rowCount === 0) {
      return res.status(404).json({
        mensaje: "El portafolio no existe",
      });
    }

    // Validar acción
    const existeAccion = await pool.query(
      "SELECT id, simbolo FROM acciones WHERE id = $1",
      [accion_id]
    );

    if (existeAccion.rowCount === 0) {
      return res.status(404).json({
        mensaje: "La acción no existe",
      });
    }

 

	const simbolo = existeAccion.rows[0].simbolo;

	// 1. Determinar valores según el tipo de orden
	const esLimite = tipo_orden === 'limite';

	// 💡 CAMBIO AQUÍ: Ahora todas pasan directamente a 'completada' aunque sean límite
	const estado = 'completada'; 

	let precio_final = null;

	if (esLimite) {
	  if (!precio_limite || precio_limite <= 0) {
	    return res.status(400).json({
	      mensaje: "Debe especificar un precio límite válido.",
	    });
	  }
	  // Tomamos el precio inventado/fijado por el usuario como el precio final de la venta
	  precio_final = precio_limite; 
	} else {
	  // Si es a mercado, mantiene la cotización real actual
	  const datos = await obtenerCotizacion(simbolo);
	  precio_final = datos.last[0];
	}

	// ... (Aquí dejas igual los queries de compras y ventas de validación de existencias) ...

	// --- MODIFICAR LA LÓGICA DE ANÁLISIS DE RENDIMIENTO ---
	// Como ahora 'estado' SIEMPRE será 'completada', calculará el rendimiento al instante
	let rendimiento_calculado = null;

	if (estado === 'completada') {
	  const historialCompras = await pool.query(
	    `
	    SELECT
	      COALESCE(AVG(precio_compra), 0) AS precio_promedio
	    FROM compras
	    WHERE portafolio_id = $1 AND accion_id = $2
	    `,
	    [portafolio_id, accion_id]
	  );

	  let precioPromedioCompra = Number(historialCompras.rows[0].precio_promedio);

	  if (precioPromedioCompra === 0) {
	    precioPromedioCompra = precio_final;
	  }

	  // Rendimiento Real utilizando el 'precio_final' (que será el límite si fue personalizada)
	  rendimiento_calculado = (Number(precio_final) - precioPromedioCompra) * Number(cantidad);
	}

    // 2. Insertar incluyendo las nuevas columnas y el análisis de rendimiento
    const result = await pool.query(
      `
      INSERT INTO ventas
      (portafolio_id, accion_id, cantidad, precio_venta, tipo_orden, precio_limite, estado, rendimiento_calculado)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
      `,
      [
        portafolio_id,
        accion_id,
        cantidad,
        precio_final,
        tipo_orden || 'mercado',
        esLimite ? precio_limite : null,
        estado,
        rendimiento_calculado
      ]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "No fue posible registrar la venta. Intente nuevamente.",
    });
  }
};

module.exports = {
  obtenerVentas,
  crearVenta,
};
