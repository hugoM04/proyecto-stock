import { useState, useEffect } from "react";
import axios from "axios";

function Administrar() {
    const [acciones, setAcciones] = useState([]);
    const [nombre, setNombre] = useState("");
    const [simbolo, setSimbolo] = useState("");
    const [logo, setLogo] = useState("");

    // Cargar las acciones existentes
    const cargarAcciones = async () => {
        try {
            const res = await axios.get("/proyecto-stock/api/acciones");
            setAcciones(res.data);
        } catch (err) {
            console.error("Error al cargar acciones", err);
        }
    };

    useEffect(() => {
        cargarAcciones();
    }, []);

    // Registrar nueva empresa
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("/proyecto-stock/api/acciones", { nombre, simbolo, logo });
            alert("🎉 ¡Empresa registrada con éxito!");
            setNombre("");
            setSimbolo("");
            setLogo("");
            cargarAcciones(); // Recargar la lista
        } catch (err) {
            alert("Error al guardar la empresa");
        }
    };

    // Eliminar empresa con confirmación
    const handleEliminar = async (simboloEliminar) => {
        const confirmar = window.confirm(`¿Estás seguro de que deseas eliminar la empresa ${simboloEliminar}? Esta acción no se puede deshacer.`);
        if (confirmar) {
            try {
                await axios.delete(`/proyecto-stock/api/acciones/${simboloEliminar}`);
                alert("Empresa eliminada correctamente");
                cargarAcciones();
            } catch (err) {
                alert("No se pudo eliminar la empresa. Verifique que no tenga dependencias.");
            }
        }
    };

    return (
        <div className="container-fluid">
            <h2 className="mb-4 fw-bold text-dark">Gestión de Empresas y Acciones</h2>
            
            <div className="row g-4">
                {/* Formulario de registro */}
                <div className="col-12 col-md-5">
                    <div className="card border-0 shadow-sm p-4 rounded-4 bg-white">
                        <h5 className="fw-bold mb-3 text-dark">
                            <i className="bi bi-plus-circle-fill text-primary me-2"></i>
                            Añadir Nueva Acción
                        </h5>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label text-muted small fw-semibold">Nombre de la Empresa</label>
                                <input 
                                    type="text" 
                                    className="form-control rounded-3" 
                                    placeholder="Ej. Microsoft Corporation" 
                                    value={nombre} 
                                    onChange={(e) => setNombre(e.target.value)} 
                                    required 
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label text-muted small fw-semibold">Símbolo (Ticker)</label>
                                <input 
                                    type="text" 
                                    className="form-control rounded-3 text-uppercase" 
                                    placeholder="Ej. MSFT" 
                                    maxLength="5"
                                    value={simbolo} 
                                    onChange={(e) => setSimbolo(e.target.value)} 
                                    required 
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label text-muted small fw-semibold">URL del Logotipo</label>
                                <input 
                                    type="url" 
                                    className="form-control rounded-3" 
                                    placeholder="https://ejemplo.com/logo.png" 
                                    value={logo} 
                                    onChange={(e) => setLogo(e.target.value)} 
                                />
                            </div>
                            <button type="submit" className="btn btn-primary w-100 rounded-3 py-2 fw-semibold">
                                Registrar Empresa
                            </button>
                        </form>
                    </div>
                </div>

                {/* Tabla de empresas registradas */}
                <div className="col-12 col-md-7">
                    <div className="card border-0 shadow-sm p-4 rounded-4 bg-white">
                        <h5 className="fw-bold mb-3 text-dark">Empresas en el Sistema</h5>
                        <div className="table-responsive">
                            <table className="table align-middle table-hover">
                                <thead className="table-light">
                                    <tr>
                                        <th>Logo</th>
                                        <th>Símbolo</th>
                                        <th>Empresa</th>
                                        <th className="text-end">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {acciones.map((acc) => (
                                        <tr key={acc.simbolo}>
                                            <td>
                                                <img 
                                                    src={acc.logo || "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=100"} 
                                                    alt={acc.nombre} 
                                                    className="rounded-circle object-fit-contain bg-light border p-1"
                                                    style={{ width: "36px", height: "36px" }}
                                                />
                                            </td>
                                            <td><span className="badge bg-secondary bg-opacity-10 text-secondary fw-bold px-2 py-1">{acc.simbolo}</span></td>
                                            <td className="fw-semibold text-dark">{acc.nombre}</td>
                                            <td className="text-end">
                                                <button 
                                                    className="btn btn-outline-danger btn-sm rounded-3 px-3"
                                                    onClick={() => handleEliminar(acc.simbolo)}
                                                >
                                                    <i className="bi bi-trash3-fill"></i> Eliminar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Administrar;
