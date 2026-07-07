import { LOGOS } from "../../utils/logos";

function TablaAcciones({ acciones }) {
    return (
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden mt-4">

            {/* Cabecera de la tarjeta */}
            <div className="card-header bg-white border-bottom border-light py-3 px-4">
                <h5 className="mb-0 fw-bold d-flex align-items-center text-dark">
                    <i className="bi bi-grid-3x3-gap text-primary me-2 fs-4"></i>
                    Acciones del Portafolio
                </h5>
            </div>

            {/* Contenedor responsivo */}
            <div className="table-responsive">
                <table className="table table-hover align-middle mb-0" style={{ minWidth: "800px" }}>

                    <thead className="table-light text-secondary text-uppercase fs-7 tracking-wider" style={{ backgroundColor: "#f8fafc" }}>
                        <tr>
                            <th className="py-3 px-4">Símbolo</th>
                            <th className="py-3">Empresa</th>
                            <th className="py-3 text-center">Cantidad</th>
                            <th className="py-3">Precio Compra</th>
                            <th className="py-3">Precio Actual</th>
                            <th className="py-3">Valor Actual</th>
                            <th className="py-3">Ganancia / Pérdida</th>
                        </tr>
                    </thead>

                    <tbody>
                        {acciones.map((accion) => {
                            const esPositivo = accion.ganancia >= 0;

                            // LÓGICA HÍBRIDA:
                            // 1. Intentamos buscar primero en tu archivo local estático (LOGOS)
                            let srcFinal = LOGOS[accion.simbolo];

                            // 2. Si no existe en el archivo local, armamos la ruta dinámica del servidor usando lo que venga de la BD
                            if (!srcFinal && accion.logo) {
                                srcFinal = accion.logo.startsWith('http') 
                                    ? accion.logo 
                                    : `https://hugo.teamtesvg.site/proyecto-stock/uploads/logos/${accion.logo}`;
                            }

                            return (
                                <tr key={accion.accion_id} className="border-bottom border-light-subtle">

                                    {/* Símbolo con Badge */}
                                    <td className="py-3 px-4">
                                        <span className="badge px-2.5 py-2 rounded-3 text-dark bg-light font-monospace fw-bold"
                                              style={{ fontSize: "0.85rem", border: "1px solid #e2e8f0" }}>
                                            {accion.simbolo}
                                        </span>
                                    </td>

                                    {/* Logo e Identificador de la Empresa */}
                                    <td className="py-3">
                                        <div className="d-flex align-items-center">
                                            {srcFinal ? (
                                                <div
                                                    className="d-flex align-items-center justify-content-center bg-white border rounded-3 shadow-sm me-3"
                                                    style={{ width: "38px", height: "38px" }}
                                                >
                                                    <img
                                                        src={srcFinal}
                                                        alt={accion.simbolo}
                                                        onError={(e) => {
                                                            // Si por alguna razón la imagen falla, ponemos el edificio gris
                                                            e.target.style.display = 'none';
                                                            e.target.parentNode.innerHTML = '<i class="bi bi-building text-muted"></i>';
                                                        }}
                                                        style={{
                                                            width: "26px",
                                                            height: "26px",
                                                            objectFit: "contain"
                                                        }}
                                                    />
                                                </div>
                                            ) : (
                                                // Si no tiene logo local ni en BD, se renderiza el edificio directamente
                                                <div
                                                    className="rounded-3 bg-light border d-flex align-items-center justify-content-center me-3 text-secondary"
                                                    style={{ width: "38px", height: "38px" }}
                                                >
                                                    <i className="bi bi-building"></i>
                                                </div>
                                            )}

                                            <span className="fw-semibold text-dark" style={{ fontSize: "0.95rem" }}>
                                                {accion.nombre}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Cantidad */}
                                    <td className="py-3 text-center fw-medium text-secondary">
                                        {accion.cantidad}
                                    </td>

                                    {/* Precios */}
                                    <td className="py-3 text-dark fw-medium">
                                        ${accion.precioCompra.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </td>

                                    <td className="py-3 fw-semibold text-success">
                                        ${accion.precioActual.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </td>

                                    <td className="py-3 text-dark fw-semibold">
                                        ${accion.valorActual.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </td>

                                    {/* Ganancia */}
                                    <td className="py-3">
                                        <div className="d-flex align-items-center">
                                            <span className={`fw-bold me-2 ${esPositivo ? "text-success" : "text-danger"}`}>
                                                {esPositivo ? "+" : ""}${accion.ganancia.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </span>
                                            <span className={`badge px-2 py-1 rounded-2 small ${esPositivo ? "bg-success bg-opacity-10 text-success" : "bg-danger bg-opacity-10 text-danger"}`}
                                                  style={{ fontSize: "0.75rem" }}>
                                                <i className={`bi ${esPositivo ? "bi-arrow-up-right" : "bi-arrow-down-right"}`}></i>
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
    );
}

export default TablaAcciones;
