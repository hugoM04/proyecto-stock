import { useEffect, useState } from "react";

import { obtenerAcciones } from "../services/accionesService";
import { obtenerPortafolios } from "../services/portafoliosService";
import api from "../services/api";
import { registrarCompra } from "../services/comprasService";
import { registrarVenta } from "../services/ventasService";

// 1. Diccionario de mapeo: Símbolo -> Dominio de la empresa para los logos
const DOMINIOS_EMPRESAS = {
    AAPL: "apple.com",
    AMZN: "amazon.com",
    GOOGL: "google.com",
    IBM: "ibm.com",
    META: "meta.com",
    MSFT: "microsoft.com",
    NVDA: "nvidia.com",
    TSLA: "tesla.com"
};

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

    useEffect(() => {
        cargarAcciones();
        cargarPortafolios();
    }, []);

    const cargarAcciones = async () => {
        try{
            const data = await obtenerAcciones();
            setAcciones(data);
        }catch(error){
            console.error(error);
        }
    };

    const cargarPortafolios = async () => {
        try{
            const data = await obtenerPortafolios();
            setPortafolios(data);
        }catch(error){
            console.error(error);
        }
    };

    const obtenerPrecio = async (simbolo) => {
        try{
            const response = await api.get(`/cotizacion/${simbolo}`);
            setCotizacion(response.data);
        }catch(error){
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

    // 2. Función auxiliar para obtener la URL del logo
    const obtenerUrlLogo = (simbolo) => {
        const dominio = DOMINIOS_EMPRESAS[simbolo];
        return dominio 
            ? `https://logo.clearbit.com/${dominio}` 
            : null;
    };

    return (
        <div className="container-fluid px-2 mt-2">
            
            <div className="mb-4">
                <h1 className="h3 fw-bold text-dark mb-1">
                    {tipo === "compra" ? "Nueva Compra" : "Nueva Venta"}
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
                            onChange={(e)=>setPortafolioSeleccionado(e.target.value)}
                        >
                            <option value="">Seleccione un portafolio</option>
                            {
                                portafolios.map((p)=>(
                                    <option key={p.id} value={p.id}>
                                        💼 {p.nombre}
                                    </option>
                                ))
                            }
                        </select>
                    </div>

                    {/* Acción con previsualización del logo seleccionado */}
                    <div className="mb-3">
                        <label className="form-label fw-semibold text-secondary small text-uppercase tracking-wider d-flex justify-content-between align-items-center">
                            <span>Seleccionar Activo / Acción</span>
                            
                            {/* 3. Muestra el logo real de forma dinámica aquí arriba si hay una acción seleccionada */}
                            {simboloActivo && obtenerUrlLogo(simboloActivo) && (
                                <img 
                                    src={obtenerUrlLogo(simboloActivo)} 
                                    alt={simboloActivo}
                                    className="rounded-circle shadow-sm border border-light"
                                    style={{ width: "24px", height: "24px", objectFit: "contain" }}
                                    onError={(e) => { e.target.style.display = 'none'; }} // Esconde el logo si falla la carga
                                />
                            )}
                        </label>
                        
                        <select
                            className="form-select form-select-lg border-light-subtle rounded-3"
                            style={{ fontSize: "0.95rem" }}
                            value={accionSeleccionada}
                            onChange={(e)=>{
                                setAccionSeleccionada(e.target.value);
                                
                                if(e.target.value === "") {
                                    setSimboloActivo("");
                                    setCotizacion(null);
                                    return;
                                }

                                const optionSeleccionada = e.target.options[e.target.selectedIndex];
                                const simbolo = optionSeleccionada.dataset.simbolo;
                                
                                setSimboloActivo(simbolo);
                                obtenerPrecio(simbolo);
                            }}
                        >
                            <option value="">Seleccione una acción</option>
                            {
                                acciones.map((a)=>(
                                    <option key={a.id} value={a.id} data-simbolo={a.simbolo}>
                                        {a.simbolo} - {a.nombre}
                                    </option>
                                ))
                            }
                        </select>
                    </div>

                    {/* Precio Actual Estilizado */}
                    {
                        cotizacion && (
                            <div className="alert border-0 rounded-3 p-3 mb-3 d-flex align-items-center justify-content-between" 
                                 style={{ backgroundColor: "#f0fdf4", color: "#16a34a" }}>
                                <span className="fw-medium">
                                    <i className="bi bi-lightning-charge-fill me-2"></i>
                                    Precio de mercado actual:
                                </span>
                                <strong className="fs-5">${cotizacion.precio}</strong>
                            </div>
                        )
                    }

                    {/* Cantidad */}
                    <div className="mb-4">
                        <label className="form-label fw-semibold text-secondary small text-uppercase tracking-wider">
                            Cantidad de Unidades
                        </label>
                        <input
                            type="number"
                            min="1"
                            className="form-control form-control-lg border-light-subtle rounded-3"
                            style={{ fontSize: "0.95rem" }}
                            placeholder="Ej. 10"
                            value={cantidad}
                            onChange={(e)=>setCantidad(e.target.value)}
                        />
                    </div>

                    {/* Alertas de Mensaje y Error */}
                    {
                       mensaje &&
                       <div className="alert alert-success border-0 rounded-3 p-3 mb-3 d-flex align-items-center">
                           <i className="bi bi-check-circle-fill me-2 fs-5"></i>
                           <div>{mensaje}</div>
                       </div>
                    }

                    {
                       error &&
                       <div className="alert alert-danger border-0 rounded-3 p-3 mb-3 d-flex align-items-center">
                           <i className="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
                           <div>{error}</div>
                       </div>
                    }

                    {/* Botón */}
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
                        {
                            cargando
                            ? (
                                <span className="d-flex align-items-center justify-content-center">
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Procesando orden...
                                </span>
                            )
                            : tipo === "compra" ? "Confirmar Compra" : "Confirmar Venta"
                        }
                    </button>

                </div>

            </div>

        </div>
    );
}

export default FormularioOperacion;