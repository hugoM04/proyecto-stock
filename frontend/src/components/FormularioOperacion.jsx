import { useEffect, useState } from "react";
import { LOGOS } from "../utils/logos";
import { obtenerAcciones } from "../services/accionesService";
import { obtenerPortafolios } from "../services/portafoliosService";
import api from "../services/api";
import { registrarCompra } from "../services/comprasService";
import { registrarVenta } from "../services/ventasService";

function FormularioOperacion({ tipo }) {
    const [acciones, setAcciones] = useState([]);
    const [portafolios, setPortafolios] = useState([]);

    const [accionSeleccionada, setAccionSeleccionada] = useState("");
    const [portafolioSeleccionado, setPortafolioSeleccionado] = useState("");
    const [cantidad, setCantidad] = useState("");
    const [cotizacion, setCotizacion] = useState(null);
    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(false);

    // Estado extra para renderizar el logo del activo seleccionado actualmente
    const [simboloActivo, setSimboloActivo] = useState("");

    // Efecto encargado de reaccionar al cambio de acción
    useEffect(() => {
        // 1. Limpiamos por completo la cotización previa para evitar que se quede pegada
        setCotizacion(null);

        // 2. Si hay un símbolo activo seleccionado, hacemos la petición de inmediato
        if (simboloActivo) {
            obtenerPrecio(simboloActivo);
        }
    }, [simboloActivo]); // Reacciona cada vez que cambia el símbolo del activo

    // Efecto para inicializar los selectores
    useEffect(() => {
        cargarAcciones();
        cargarPortafolios();
    }, []);

    const cargarAcciones = async () => {
        try {
            const data = await obtenerAcciones();
            setAcciones(data);
        } catch (error) {
            console.error(error);
        }
    };

    const cargarPortafolios = async () => {
        try {
            const data = await obtenerPortafolios();
            setPortafolios(data);
        } catch (error) {
            console.error(error);
        }
    };

    const obtenerPrecio = async (simbolo) => {
        try {
            const response = await api.get(`/cotizacion/${simbolo}`);
            setCotizacion(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const guardarOperacion = async () => {
        setMensaje("");
        setError("");

        if (!portafolioSeleccionado) {
            setError("Seleccione un portafolio.");
            return;
        }
        if (!accionSeleccionada) {
            setError("Seleccione una acción.");
            return;
        }
        if (!cantidad) {
            setError("Ingrese una cantidad.");
            return;
        }
        if (Number(cantidad) <= 0) {
            setError("La cantidad debe ser mayor que cero.");
            return;
        }

        try {
            setCargando(true);
            const datos = {
                portafolio_id: Number(portafolioSeleccionado),
                accion_id: Number(accionSeleccionada),
                cantidad: Number(cantidad)
            };

            if (tipo === "compra") {
                await registrarCompra(datos);
            } else {
                await registrarVenta(datos);
            }

            setMensaje("Operación registrada correctamente.");
            setCantidad("");
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.mensaje || "Ocurrió un error.");
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="container-fluid px-2 mt-2">
            <div className="mb-4">
                <h1 className="h3 fw-bold text-dark mb-1">
                    {tipo === "compra" ? "Comprar Acciones" : "Vender Acciones"}
                </h1>
                <p className="text-muted small">Registra transacciones en tu portafolio de manera inmediata.</p>
            </div>

            <div className="card border-0 shadow-sm rounded-4 overflow-hidden" style={{ maxWidth: "600px" }}>
                <div className="card-header bg-white border-bottom border-light py-3 px-4">
                    <h5 className="mb-0 fw-bold d-flex align-items-center text-dark">
                        <i className={`bi ${tipo === "compra" ? "bi-cart-plus text-success" : "bi-cash-stack text-danger"} me-2 fs-4`}></i>
                        {tipo === "compra" ? "Formulario de Compra" : "Formulario de Venta"}
                    </h5>
                </div>

                <div className="card-body p-4">
                    {/* Portafolio */}
                    <div className="mb-3">
                        <label className="form-label fw-semibold text-secondary small text-uppercase tracking-wider">
                            Portafolio de Destino
                        </label>
                        <select
                            className="form-select form-select-lg border-light-subtle rounded-3"
                            style={{ fontSize: "0.95rem" }}
                            value={portafolioSeleccionado}
                            onChange={(e) => setPortafolioSeleccionado(e.target.value)}
                        >
                            <option value="">Seleccione un portafolio</option>
                            {portafolios.map((p) => (
                                <option key={p.id} value={p.id}>
                                    💼 {p.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Acción */}
                    <div className="mb-3">
                        <label className="form-label fw-semibold text-secondary small text-uppercase tracking-wider d-flex justify-content-between align-items-center">
                            <span>Seleccionar Activo / Acción</span>
                            {simboloActivo && (
                                <img
                                    src={acciones.find(a => a.simbolo === simboloActivo)?.logo || LOGOS[simboloActivo] || "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=100"}
                                    alt={simboloActivo}
                                    className="rounded-circle border bg-white p-1 shadow-sm"
                                    style={{ width: "36px", height: "36px", objectFit: "contain" }}
                                />
                            )}
                        </label>
                        <select
                            className="form-select form-select-lg border-light-subtle rounded-3"
                            style={{ fontSize: "0.95rem" }}
                            value={accionSeleccionada}
                            onChange={(e) => {
                                setAccionSeleccionada(e.target.value);
                                if (e.target.value === "") {
                                    setSimboloActivo("");
                                    return;
                                }
                                const optionSeleccionada = e.target.options[e.target.selectedIndex];
                                const simbolo = optionSeleccionada.dataset.simbolo;
                                setSimboloActivo(simbolo);
                            }}
                        >
                            <option value="">Seleccione una acción</option>
                            {acciones.map((a) => (
                                <option key={a.id} value={a.id} data-simbolo={a.simbolo}>
                                    {a.simbolo} - {a.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Precio Actual */}
                    {cotizacion && (
                        <div className="alert border-0 rounded-4 p-4 mb-4" style={{ background: "#f8fafc", border: "1px solid #e5e7eb" }}>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <small className="text-secondary d-block mb-1">
                                        <i className="bi bi-lightning-charge-fill text-success me-1"></i> Precio en tiempo real
                                    </small>
                                    <h3 className="mb-0 fw-bold text-dark">${Number(cotizacion.precio).toFixed(2)}</h3>
                                </div>
                                {simboloActivo && (
                                    <img
                                        src={acciones.find(a => a.simbolo === simboloActivo)?.logo || LOGOS[simboloActivo] || "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=100"}
                                        style={{ width: "52px", height: "52px", objectFit: "contain" }}
                                        alt="Logo"
                                    />
                                )}
                            </div>
                        </div>
                    )}

                    {/* Cantidad */}
                    <div className="mb-4">
                        <label className="form-label fw-semibold text-secondary small text-uppercase tracking-wider">
                            Cantidad de Unidades
                        </label>
                        <input
                            type="number"
                            className="form-control rounded-4 py-3"
                            placeholder="Ej. 10 acciones"
                            value={cantidad}
                            onChange={(e) => setCantidad(e.target.value)}
                        />
                    </div>

                    {/* Total estimado */}
                    {cotizacion && cantidad > 0 && (
                        <div className="alert alert-light border rounded-4 mb-4">
                            <div className="d-flex justify-content-between">
                                <span className="text-secondary">Total estimado</span>
                                <strong className="text-dark">
                                    ${(Number(cotizacion.precio) * Number(cantidad)).toFixed(2)}
                                </strong>
                            </div>
                        </div>
                    )}

                    {/* Alertas de Mensaje y Error */}
                    {mensaje && (
                        <div className="alert alert-success border-0 rounded-3 p-3 mb-3 d-flex align-items-center">
                            <i className="bi bi-check-circle-fill me-2 fs-5"></i>
                            <div>{mensaje}</div>
                        </div>
                    )}

                    {error && (
                        <div className="alert alert-danger border-0 rounded-3 p-3 mb-3 d-flex align-items-center">
                            <i className="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
                            <div>{error}</div>
                        </div>
                    )}

                    {/* Botón de Envió */}
                    <button
                        disabled={cargando}
                        className="btn btn-lg w-100 rounded-3 fw-bold py-2.5 text-white shadow-sm border-0"
                        style={{
                            background: cargando
                                ? "#64748b"
                                : tipo === "compra"
                                    ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                                    : "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                            transition: "all 0.2s ease",
                            fontSize: "1rem"
                        }}
                        onClick={guardarOperacion}
                    >
                        {cargando ? (
                            <span className="d-flex align-items-center justify-content-center">
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Procesando orden...
                            </span>
                        ) : tipo === "compra" ? "Confirmar Compra" : "Confirmar Venta"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default FormularioOperacion;
