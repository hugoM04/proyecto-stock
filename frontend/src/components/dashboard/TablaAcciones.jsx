import { LOGOS } from "../../utils/logos";

function TablaAcciones({ acciones = [] }) {
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
                            <th className="py-3">Análisis (Ganancia / Pérdida)</th>
                        </tr>
                    </thead>

                    <tbody>
                        {acciones.map((accion) => {
                            const cantidad = Number(accion.cantidad || 0);
                            const esPositivo = accion.ganancia >= 0;

                            // LÓGICA HÍBRIDA DE LOGOS CONSERVADA:
                            let srcFinal = LOGOS[accion.simbolo];

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

                                    {/* Cantidad (Valida si está en 0 para avisar de forma elegante que se vendió todo) */}
                                    <td className="py-3 text-center fw-medium">
                                        {cantidad === 0 ? (
                                            <span className="text-muted small bg-light px-2 py-1 rounded fw-semibold" style={{ fontSize: "0.8rem" }}>
                                                Sin acciones (Vendido)
                                            </span>
                                        ) : (
                                            <span className="text-secondary fw-semibold">{cantidad}</span>
                                        )}
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

                                    {/* Análisis Visual de Ganancia / Pérdida */}
                                    <td className="py-3">
                                        <div className="d-inline-flex align-items-center p-2 rounded-3"
                                             style={{
                                                 background: esPositivo ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
                                                 border: esPositivo ? "1px solid rgba(16, 185, 129, 0.2)" : "1px solid rgba(239, 68, 68, 0.2)"
                                             }}>
                                            <span className={`fw-bold me-2 ${esPositivo ? "text-success" : "text-danger"}`} style={{ fontSize: "0.9rem" }}>
                                                {esPositivo ? "📈 Ganando:" : "📉 Perdiendo:"} {esPositivo ? "+" : ""}${accion.ganancia.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </span>
                                            <span className={`badge px-1.5 py-0.5 rounded-2 text-white ${esPositivo ? "bg-success" : "bg-danger"}`}
                                                  style={{ fontSize: "0.7rem" }}>
                                                <i className={`bi ${esPositivo ? "bi-caret-up-fill" : "bi-caret-down-fill"}`}></i>
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
