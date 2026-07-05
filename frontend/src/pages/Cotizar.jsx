import { useEffect, useState } from "react";
import { obtenerAcciones } from "../services/accionesService";

// Diccionario de mapeo: Símbolo -> Dominio para renderizar los logos de las empresas
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

function Cotizar() {

    const [acciones, setAcciones] = useState([]);

    useEffect(() => {
        cargarAcciones();
    }, []);

    const cargarAcciones = async () => {
        try {
            const data = await obtenerAcciones();
            setAcciones(data);
        } catch (error) {
            console.error(error);
        }
    };

    // Función auxiliar para obtener el logo
    const obtenerUrlLogo = (simbolo) => {
        const dominio = DOMINIOS_EMPRESAS[simbolo];
        return dominio ? `https://logo.clearbit.com/${dominio}` : null;
    };

    return (
        <div className="container-fluid px-2 mt-2">
            
            {/* Encabezado de la página */}
            <div className="mb-4">
                <h1 className="h3 fw-bold text-dark mb-1">Cotizaciones de Mercado</h1>
                <p className="text-muted small">Lista general de activos disponibles y empresas registradas en la plataforma.</p>
            </div>

            {/* Tarjeta contenedora de la Tabla */}
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="card-header bg-white border-bottom border-light py-3 px-4">
                    <h5 className="mb-0 fw-bold d-flex align-items-center text-dark">
                        <i className="bi bi-list-stars text-primary me-2 fs-4"></i>
                        Activos Disponibles
                    </h5>
                </div>
                
                {/* Contenedor responsivo para la tabla */}
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0" style={{ minWidth: "600px" }}>
                        <thead className="table-light text-secondary text-uppercase fs-7 tracking-wider" style={{ backgroundColor: "#f8fafc" }}>
                            <tr>
                                <th className="py-3 px-4" style={{ width: "80px" }}>ID</th>
                                <th className="py-3">Activo</th>
                                <th className="py-3">Empresa</th>
                            </tr>
                        </thead>
                        <tbody>
                            {acciones.map((accion) => {
                                const urlLogo = obtenerUrlLogo(accion.simbolo);
                                return (
                                    <tr key={accion.id} className="border-bottom border-light-subtle">
                                        
                                        {/* ID con estilo tenue */}
                                        <td className="py-3 px-4 text-secondary small fw-medium">
                                            #{accion.id}
                                        </td>

                                        {/* Símbolo con Badge Azul Eléctrico Vivo */}
                                        <td className="py-3">
                                            <span className="badge px-3 py-2 rounded-3 text-primary" 
                                                  style={{ 
                                                      backgroundColor: "rgba(13, 110, 253, 0.08)", 
                                                      fontSize: "0.85rem",
                                                      fontWeight: "600"
                                                  }}>
                                                {accion.simbolo}
                                            </span>
                                        </td>

                                        {/* Logo y Nombre de la Empresa Alineados */}
                                        <td className="py-3">
                                            <div className="d-flex align-items-center">
                                                {urlLogo ? (
                                                    <img 
                                                        src={urlLogo} 
                                                        alt={accion.simbolo}
                                                        className="rounded-circle border border-light shadow-sm me-3"
                                                        style={{ width: "32px", height: "32px", objectFit: "contain", padding: "2px" }}
                                                        onError={(e) => { e.target.style.display = 'none'; }}
                                                    />
                                                ) : (
                                                    <div className="rounded-circle bg-secondary bg-opacity-10 d-flex align-items-center justify-content-center me-3" 
                                                         style={{ width: "32px", height: "32px" }}>
                                                        <i className="bi bi-building text-secondary small"></i>
                                                    </div>
                                                )}
                                                <span className="fw-semibold text-dark" style={{ fontSize: "0.95rem" }}>
                                                    {accion.nombre}
                                                </span>
                                            </div>
                                        </td>

                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}

export default Cotizar;