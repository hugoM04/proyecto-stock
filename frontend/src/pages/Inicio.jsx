function Inicio() {
    return (
        <div className="container-fluid px-2 mt-2">
            
            {/* Mensaje de Bienvenida Principal */}
            <div className="card border-0 shadow-sm rounded-4 p-5 text-white mb-4 position-relative overflow-hidden"
                 style={{
                     background: "linear-gradient(135deg, #0b132b 0%, #1d3557 100%)" /* Azul oscuro premium */
                 }}>
                
                {/* Decoración geométrica sutil de fondo (estilo SaaS) */}
                <div className="position-absolute" 
                     style={{ 
                         right: "-50px", 
                         top: "-50px", 
                         width: "200px", 
                         height: "200px", 
                         background: "rgba(0, 242, 254, 0.15)", 
                         borderRadius: "50%",
                         filter: "blur(40px)"
                     }}>
                </div>

                <div className="row align-items-center position-relative" style={{ zIndex: 1 }}>
                    <div className="col-md-8">
                        {/* El clásico Hola Mundo versión Pro */}
                        <span className="badge px-3 py-2 rounded-3 mb-3 text-uppercase tracking-wider"
                              style={{ 
                                  backgroundColor: "rgba(0, 242, 254, 0.2)", 
                                  color: "#00f2fe",
                                  fontSize: "0.8rem",
                                  fontWeight: "600"
                              }}>
                            <i className="bi bi-code-slash me-2"></i>
                            console.log("¡Hola Mundo!");
                        </span>
                        
                        <h1 className="display-5 fw-bold mb-2 text-white">
                            ¡Bienvenidos!
                        </h1>
                        <p className="fs-5 text-white-50 mb-0fw-medium">
                            {/* Tu nombre completo estilizado */}
                            <span className="text-white fw-semibold">Hugo Yahir Malagón Peña</span> • Administrador del Sistema
                        </p>
                    </div>
                    
                    {/* Icono de saludo o gráfica vivo a la derecha */}
                    <div className="col-md-4 text-end d-none d-md-block">
                        <div className="d-inline-flex p-4 rounded-circle" 
                             style={{ background: "linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)", boxShadow: "0 10px 25px rgba(0, 242, 254, 0.3)" }}>
                            <i className="bi bi-wallet2 text-white" style={{ fontSize: "3.5rem" }}></i>
                        </div>
                    </div>
                </div>
            </div>

            {/* Fila de accesos rápidos abajo para que no se vea vacío */}
            <div className="row g-4">
                <div className="col-10 col-sm-6 col-xl-3">
                    <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
                        <div className="d-flex align-items-center mb-3">
                            <div className="p-3 rounded-3 bg-primary bg-opacity-10 text-primary me-3">
                                <i className="bi bi-bar-chart-line fs-4"></i>
                            </div>
                            <h6 className="mb-0 fw-bold text-dark">Mercado hoy</h6>
                        </div>
                        <p className="text-muted small mb-0">Revisa las últimas cotizaciones actualizadas en tiempo real.</p>
                    </div>
                </div>

                <div className="col-10 col-sm-6 col-xl-3">
                    <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
                        <div className="d-flex align-items-center mb-3">
                            <div className="p-3 rounded-3 bg-success bg-opacity-10 text-success me-3">
                                <i className="bi bi-arrow-up-right-circle fs-4"></i>
                            </div>
                            <h6 className="mb-0 fw-bold text-dark">Operaciones</h6>
                        </div>
                        <p className="text-muted small mb-0">Coloca órdenes de compra o venta en tus portafolios.</p>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Inicio;