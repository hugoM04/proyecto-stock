function ResumenCards({ resumen }) {

    // Calculamos si la ganancia es positiva o negativa
    const esGananciaPositiva = resumen.gananciaTotal >= 0;

    return (
        <div className="row g-4 mb-4">

            {/* CARD 1: Total Invertido (Azul Eléctrico) */}
            <div className="col-12 col-md-4">
                <div className="card border-0 shadow-sm rounded-4 p-3 bg-white h-100">
                    <div className="card-body d-flex align-items-center">
                        {/* Icono envuelto en burbuja azul */}
                        <div className="d-flex align-items-center justify-content-center text-white rounded-circle me-3 shadow-sm"
                             style={{ 
                                 width: "54px", 
                                 height: "54px", 
                                 background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)" 
                             }}>
                            <i className="bi bi-currency-dollar fs-4"></i>
                        </div>
                        <div>
                            <h6 className="text-secondary fw-semibold small text-uppercase tracking-wider mb-1" style={{ fontSize: "0.75rem" }}>
                                Total Invertido
                            </h6>
                            <h3 className="fw-bold text-dark mb-1" style={{ fontSize: "1.65rem", letterSpacing: "-0.5px" }}>
                                ${resumen.totalInvertido.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </h3>
                            <span className="text-muted small">Capital colocado</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* CARD 2: Valor Actual (Verde Esmeralda) */}
            <div className="col-12 col-md-4">
                <div className="card border-0 shadow-sm rounded-4 p-3 bg-white h-100">
                    <div className="card-body d-flex align-items-center">
                        {/* Icono envuelto en burbuja verde */}
                        <div className="d-flex align-items-center justify-content-center text-white rounded-circle me-3 shadow-sm"
                             style={{ 
                                 width: "54px", 
                                 height: "54px", 
                                 background: "linear-gradient(135deg, #10b981 0%, #047857 100%)" 
                             }}>
                            <i className="bi bi-graph-up fs-4"></i>
                        </div>
                        <div>
                            <h6 className="text-secondary fw-semibold small text-uppercase tracking-wider mb-1" style={{ fontSize: "0.75rem" }}>
                                Valor Actual
                            </h6>
                            <h3 className="fw-bold text-dark mb-1" style={{ fontSize: "1.65rem", letterSpacing: "-0.5px" }}>
                                ${resumen.valorActual.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </h3>
                            <span className="text-muted small">Valor de mercado actual</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* CARD 3: Ganancia / Pérdida (Morado o Rojo dinámico según el saldo) */}
            <div className="col-12 col-md-4">
                <div className="card border-0 shadow-sm rounded-4 p-3 bg-white h-100">
                    <div className="card-body d-flex align-items-center">
                        {/* Icono envuelto en burbuja dinámica según la ganancia */}
                        <div className="d-flex align-items-center justify-content-center text-white rounded-circle me-3 shadow-sm"
                             style={{ 
                                 width: "54px", 
                                 height: "54px", 
                                 background: esGananciaPositiva 
                                     ? "linear-gradient(135deg, #a855f7 0%, #6b21a8 100%)" /* Morado elegante de tu imagen */
                                     : "linear-gradient(135deg, #f43f5e 0%, #be123c 100%)"  /* Rojo si hay pérdidas */
                             }}>
                            <i className={`bi ${esGananciaPositiva ? "bi-arrow-up-right-circle" : "bi-arrow-down-right-circle"} fs-4`}></i>
                        </div>
                        <div>
                            <h6 className="text-secondary fw-semibold small text-uppercase tracking-wider mb-1" style={{ fontSize: "0.75rem" }}>
                                Ganancia / Pérdida
                            </h6>
                            <h3 className={`fw-bold mb-1`} 
                                style={{ 
                                    fontSize: "1.65rem", 
                                    letterSpacing: "-0.5px",
                                    color: esGananciaPositiva ? "#16a34a" : "#dc2626" /* Color de texto verde o rojo vivo */
                                }}>
                                {esGananciaPositiva ? "+" : ""}${resumen.gananciaTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </h3>
                            <span className="text-muted small">Rendimiento total</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default ResumenCards;