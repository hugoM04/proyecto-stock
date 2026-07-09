import { useEffect, useState } from "react";
import { obtenerResumen } from "../services/resumenPortafolioService";
import ResumenCards from "../components/dashboard/ResumenCards";
import TablaAcciones from "../components/dashboard/TablaAcciones";
import GraficaPortafolio from "../components/dashboard/GraficaPortafolio";
import HistorialVentas from "../components/dashboard/HistorialVentas"; 
import { obtenerHistorial } from "../services/historialService";
import { obtenerPortafolios } from "../services/portafoliosService";
import FormularioPortafolio from "../components/FormularioPortafolio";
import api from "../services/api"; 

function Portafolios() {
    const [resumen, setResumen] = useState(null);
    const [historial, setHistorial] = useState([]);
    const [portafolios, setPortafolios] = useState([]);
    const [portafolioSeleccionado, setPortafolioSeleccionado] = useState("");
    const [cargandoDatos, setCargandoDatos] = useState(false);
    const [eliminando, setEliminando] = useState(false);
    const [pestanaActiva, setPestanaActiva] = useState("ver");

    useEffect(() => {
        cargarPortafolios();
    }, []);

    useEffect(() => {
        if (portafolioSeleccionado) {
            cargarDatosPortafolio();
        } else {
            setResumen(null);
            setHistorial([]);
        }
    }, [portafolioSeleccionado]);

    const cargarPortafolios = async (idASeleccionar = null) => {
        try {
            const data = await obtenerPortafolios();
            setPortafolios(data);

            if (data.length > 0) {
                if (idASeleccionar) {
                    setPortafolioSeleccionado(idASeleccionar);
                } else if (!portafolioSeleccionado || !data.some(p => p.id === portafolioSeleccionado)) {
                    setPortafolioSeleccionado(data[0].id);
                }
            } else {
                setPortafolioSeleccionado("");
            }
        } catch (error) {
            console.error("Error al cargar portafolios:", error);
        }
    };

    const cargarDatosPortafolio = async () => {
        try {
            setCargandoDatos(true);
            const [dataResumen, dataHistorial] = await Promise.all([
                obtenerResumen(portafolioSeleccionado),
                obtenerHistorial(portafolioSeleccionado)
            ]);
            setResumen(dataResumen);
            setHistorial(dataHistorial);
        } catch (error) {
            console.error("Error al cargar detalles del portafolio:", error);
        } finally {
            setCargandoDatos(false);
        }
    };

    const eliminarPortafolioActivo = async () => {
        if (!portafolioSeleccionado) {
            alert("Por favor, selecciona un portafolio válido.");
            return;
        }

        const portafolioActual = portafolios.find(p => String(p.id) === String(portafolioSeleccionado));

        if (!portafolioActual) {
            alert("No se pudo encontrar la información del portafolio seleccionado.");
            return;
        }

        const confirmar = window.confirm(`¿Estás seguro de que deseas eliminar el portafolio "${portafolioActual.nombre}"? Esta acción borrará todo su historial de transacciones y no se puede deshacer.`);

        if (!confirmar) return;

        try {
            setEliminando(true);
            await api.delete(`/portafolios/${portafolioSeleccionado}`);

            alert("Portafolio eliminado correctamente.");

            setPortafolioSeleccionado("");
            await cargarPortafolios();
        } catch (error) {
            console.error("Error al eliminar portafolio:", error);
            alert(error.response?.data?.mensaje || "Error al intentar eliminar el portafolio.");
        } finally {
            setEliminando(false);
        }
    };

    const manejarPortafolioCreado = async () => {
        await cargarPortafolios();
        setPestanaActiva("ver");
    };

    return (
        <div className="container-fluid px-3">
            {/* Menú de Navegación por Pestañas */}
            <ul className="nav nav-tabs border-bottom-0 mb-4" style={{ gap: "5px" }}>
                <li className="nav-item">
                    <button
                        className={`nav-link border-0 fw-semibold px-4 py-2.5 rounded-3 d-flex align-items-center ${
                            pestanaActiva === "ver" ? "bg-white text-primary shadow-sm" : "text-secondary bg-transparent"
                        }`}
                        onClick={() => setPestanaActiva("ver")}
                    >
                        <i className="bi bi-pie-chart-fill me-2"></i>
                        Ver Portafolios
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link border-0 fw-semibold px-4 py-2.5 rounded-3 d-flex align-items-center ${
                            pestanaActiva === "crear" ? "bg-white text-primary shadow-sm" : "text-secondary bg-transparent"
                        }`}
                        onClick={() => setPestanaActiva("crear")}
                    >
                        <i className="bi bi-folder-plus me-2"></i>
                        Nuevo Portafolio
                    </button>
                </li>
            </ul>

            {/* CONTENIDO */}
            {pestanaActiva === "ver" ? (
                <>
                    {portafolios.length === 0 ? (
                        <div className="text-center py-5 bg-white rounded-4 shadow-sm border border-light p-4" style={{ maxWidth: "500px", margin: "20px auto" }}>
                            <i className="bi bi-folder2-open text-muted" style={{ fontSize: "3rem" }}></i>
                            <h3 className="h5 fw-bold mt-3 text-dark">No tienes portafolios creados</h3>
                            <p className="text-muted small mb-4">Comienza creando tu primer portafolio para poder simular tus inversiones.</p>
                            <button className="btn btn-primary btn-sm rounded-3 px-4" onClick={() => setPestanaActiva("crear")}>
                                <i className="bi bi-plus-lg me-1"></i> Crear mi primer portafolio
                            </button>
                        </div>
                    ) : (
                        <div>
                            {/* Selector de portafolio + Botón de Eliminar */}
                            <div className="mb-4" style={{ maxWidth: "450px" }}>
                                <label className="form-label fw-semibold text-secondary small text-uppercase mb-2">
                                    Seleccionar portafolio activo
                                </label>
                                <div className="d-flex gap-2">
                                    <select
                                        className="form-select rounded-3 shadow-sm"
                                        value={portafolioSeleccionado}
                                        onChange={(e) => setPortafolioSeleccionado(e.target.value)}
                                        disabled={cargandoDatos || eliminando}
                                    >
                                        {portafolios.map((p) => (
                                            <option key={p.id} value={p.id}>
                                                {p.nombre}
                                            </option>
                                        ))}
                                    </select>

                                    <button
                                        type="button"
                                        className="btn btn-danger rounded-3 px-3 d-flex align-items-center shadow-sm text-white"
                                        onClick={eliminarPortafolioActivo}
                                        title="Eliminar este portafolio"
                                        disabled={cargandoDatos || eliminando}
                                    >
                                        {eliminando ? (
                                            <span className="spinner-border spinner-border-sm" role="status"></span>
                                        ) : (
                                            <i className="bi bi-trash-fill"></i>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {cargandoDatos || !resumen ? (
                                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Cargando...</span>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <div className="mb-4">
                                        <h1 className="h3 fw-bold text-dark mb-1">{resumen.portafolio}</h1>
                                        <p className="text-muted small">Revisión general de tus activos y rendimiento en tiempo real.</p>
                                    </div>

                                    <div className="mb-4">
                                        <ResumenCards resumen={resumen} />
                                    </div>

                                    {/* 📈 FILA 1: La Gráfica abarca el 100% del ancho de la pantalla */}
                                    <div className="row mb-4">
                                        <div className="col-12">
                                            <GraficaPortafolio historial={historial} />
                                        </div>
                                    </div>

                                    {/* 🕒 FILA 2: El Historial de Operaciones va justo debajo de la gráfica */}
                                    <div className="row mb-4">
                                        <div className="col-12">
                                            <div className="card border-0 shadow-sm rounded-4 p-4">
                                                <h5 className="fw-bold text-dark mb-3">Historial Reciente de Operaciones</h5>
                                                {/* Contenedor deslizante con Scroll vertical limitado para evitar deformaciones */}
                                                <div className="overflow-auto" style={{ maxHeight: "250px", paddingRight: "5px" }}>
                                                    <HistorialVentas ventas={resumen.ventas || []} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 📊 FILA 3: Las Acciones Compradas van abajo del todo */}
                                    <div className="row mb-4">
                                        <div className="col-12">
                                            <TablaAcciones acciones={resumen.acciones} />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </>
            ) : (
                <div className="fade-in">
                    <FormularioPortafolio onPortafolioCreado={manejarPortafolioCreado} />
                </div>
            )}
        </div>
    );
}

export default Portafolios;
