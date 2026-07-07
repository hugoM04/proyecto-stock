import { useState } from "react";
import api from "../services/api";

function FormularioPortafolio({ onPortafolioCreado }) {
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(false);

    const guardarPortafolio = async (e) => {
        e.preventDefault();
        setMensaje("");
        setError("");

        if (!nombre.trim()) {
            setError("El nombre del portafolio es obligatorio.");
            return;
        }

        try {
            setCargando(true);
            const datos = {
                nombre: nombre.trim(),
                descripcion: descripcion.trim()
            };

            // Ajusta la ruta del endpoint según lo tengas en tu backend (ej. /portafolios)
            await api.post("/portafolios", datos);

            setMensaje("Portafolio creado exitosamente.");
            setNombre("");
            setDescripcion("");

            // Si necesitas refrescar una lista en el componente padre
            if (onPortafolioCreado) {
                onPortafolioCreado();
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.mensaje || "Error al crear el portafolio.");
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="container-fluid px-2 mt-2">
            <div className="mb-4">
                <h1 className="h3 fw-bold text-dark mb-1">Nuevo Portafolio</h1>
                <p className="text-muted small">Crea un nuevo espacio para gestionar tus simulación de inversiones.</p>
            </div>

            <div className="card border-0 shadow-sm rounded-4 overflow-hidden" style={{ maxWidth: "600px" }}>
                <div className="card-header bg-white border-bottom border-light py-3 px-4">
                    <h5 className="mb-0 fw-bold d-flex align-items-center text-dark">
                        <i className="bi bi-folder-plus text-primary me-2 fs-4"></i>
                        Formulario de Registro
                    </h5>
                </div>

                <div className="card-body p-4">
                    <form onSubmit={guardarPortafolio}>
                        {/* Nombre */}
                        <div className="mb-3">
                            <label className="form-label fw-semibold text-secondary small text-uppercase tracking-wider">
                                Nombre del Portafolio
                            </label>
                            <input
                                type="text"
                                className="form-control rounded-3 py-2.5"
                                placeholder="Ej. Inversiones a Largo Plazo"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                            />
                        </div>

                        {/* Descripción */}
                        <div className="mb-4">
                            <label className="form-label fw-semibold text-secondary small text-uppercase tracking-wider">
                                Descripción (Opcional)
                            </label>
                            <textarea
                                className="form-control rounded-3"
                                rows="3"
                                placeholder="Escribe el objetivo de este portafolio..."
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                            ></textarea>
                        </div>

                        {/* Alertas */}
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

                        {/* Botón de Enviar */}
                        <button
                            type="submit"
                            disabled={cargando}
                            className="btn btn-primary btn-lg w-100 rounded-3 fw-bold py-2.5 text-white shadow-sm border-0"
                            style={{
                                background: cargando ? "#64748b" : "linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%)",
                                transition: "all 0.2s ease",
                                fontSize: "1rem"
                            }}
                        >
                            {cargando ? (
                                <span className="d-flex align-items-center justify-content-center">
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Guardando...
                                </span>
                            ) : (
                                "Crear Portafolio"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default FormularioPortafolio;
