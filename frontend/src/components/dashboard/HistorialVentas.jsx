import React from "react";

function HistorialVentas({ ventas = [] }) {
    return (
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden mt-4 bg-white">
            {/* Cabecera */}
            <div className="card-header bg-white border-bottom border-light py-3 px-4">
                <h5 className="mb-0 fw-bold d-flex align-items-center text-dark">
                    <i className="bi bi-journal-check text-success me-2 fs-4"></i>
                    Rendimiento de Ventas Históricas
                </h5>
                <p className="text-muted small mb-0 mt-1">Historial general de operaciones (Mercado y Límite) del portafolio.</p>
            </div>

            {ventas.length === 0 ? (
                <div className="text-center py-5 bg-white">
                    <i className="bi bi-clock-history text-muted" style={{ fontSize: "2.5rem" }}></i>
                    <p className="text-secondary small mt-2 mb-0 fw-medium">No se han registrado operaciones en este portafolio aún.</p>
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0" style={{ minWidth: "800px" }}>
                        <thead className="table-light text-secondary text-uppercase fs-7 tracking-wider">
                            <tr>
                                <th className="py-3 px-4">Acción</th>
                                <th className="py-3 text-center">Cant. Vendida</th>
                                <th className="py-3">Precio Venta</th>
                                <th className="py-3">Tipo / Estado</th>
                                <th className="py-3">Análisis de Rendimiento</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ventas.map((venta) => {
                                // Mapeo tolerante por si cambian los nombres desde el backend JSON
                                const tipo = venta.tipo_orden || venta.tipo || "mercado";
                                const status = venta.estado || venta.status || "completada";
                                const rendimientoCalculado = venta.rendimiento_calculado !== undefined ? venta.rendimiento_calculado : null;

                                const tieneRendimiento = rendimientoCalculado !== null;
                                const rendimiento = Number(rendimientoCalculado || 0);
                                const esGanancia = rendimiento >= 0;
                                const esPendiente = status === 'pendiente';

                                return (
                                    <tr key={venta.id} className="border-bottom border-light-subtle">
                                        {/* Símbolo de la Acción */}
                                        <td className="py-3 px-4">
                                            <span className="badge px-2.5 py-2 rounded-3 text-dark bg-light font-monospace fw-bold border">
                                                {venta.simbolo || "STK"}
                                            </span>
                                        </td>

                                        {/* Cantidad Vendida */}
                                        <td className="py-3 text-center fw-medium text-dark">
                                            {venta.cantidad}
                                        </td>

                                        {/* Precio de Venta */}
                                        <td className="py-3 fw-medium text-dark">
                                            ${Number(venta.precio_venta).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </td>

                                        {/* Estado de la Orden */}
                                        <td className="py-3">
                                            <span className={`badge px-2 py-1 rounded small text-capitalize ${
                                                esPendiente ? "bg-warning text-warning bg-opacity-10 border border-warning border-opacity-20" : "bg-info text-info bg-opacity-10 border border-info border-opacity-20"
                                            }`}>
                                                {tipo} ({status})
                                            </span>
                                        </td>

                                        {/* Rendimiento Realizado */}
                                        <td className="py-3">
                                            {!tieneRendimiento ? (
                                                <span className="text-muted small text-secondary">
                                                    <i className="bi bi-hourglass-split me-1"></i> Cálculo no disponible
                                                </span>
                                            ) : (
                                                <span className={`badge p-2 rounded-3 fw-bold d-inline-flex align-items-center ${
                                                    esGanancia ? "bg-success bg-opacity-10 text-success" : "bg-danger bg-opacity-10 text-danger"
                                                }`}>
                                                    <i className={`bi ${esGanancia ? "bi-cash-coin me-1" : "bi-dash-circle me-1"}`}></i>
                                                    {esGanancia ? "Ganaste:" : "Perdiste:"} {esGanancia ? "+" : ""}${rendimiento.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default HistorialVentas;
