function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: "#0b132b", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <div className="container-fluid px-4">
                {/* Dejamos un espacio vacío o un texto secundario a la izquierda */}
                <span className="navbar-text text-muted small">
                    Dashboard / Panel de Control
                </span>
                
                {/* Aquí podrías poner a la derecha el selector de portafolio o nombre de usuario en un futuro */}
            </div>
        </nav>
    );
}

export default Navbar;