import { NavLink } from "react-router-dom";
import "../../styles/sidebar.css";

function Sidebar() {
    return (
        <div className="sidebar-fixed text-white p-3 border-end border-secondary border-opacity-10" style={{ width: "260px" }}>

            {/* LOGO ORIGINAL: Con tu estilo vivo y moderno */}
            <div className="sidebar-brand px-2 py-4 mb-3 d-flex align-items-center">
                <div className="brand-icon-wrapper me-2">
                    <i className="bi bi-graph-up-arrow"></i>
                </div>
                <span className="brand-text fw-bold fs-4">Stock Manager</span>
            </div>

            <nav className="nav flex-column">
                <NavLink className="nav-link d-flex align-items-center" to="/">
                    <i className="bi bi-house-door me-3 fs-5"></i>
                    Inicio
                </NavLink>

                <NavLink className="nav-link d-flex align-items-center" to="/cotizar">
                    <i className="bi bi-bar-chart me-3 fs-5"></i>
                    Cotizar
                </NavLink>

                <NavLink className="nav-link d-flex align-items-center" to="/comprar">
                    <i className="bi bi-cart-plus me-3 fs-5"></i>
                    Comprar
                </NavLink>

                <NavLink className="nav-link d-flex align-items-center" to="/vender">
                    <i className="bi bi-cash-stack me-3 fs-5"></i>
                    Vender
                </NavLink>

                <NavLink className="nav-link d-flex align-items-center" to="/portafolios">
                    <i className="bi bi-wallet2 me-3 fs-5"></i>
                    Portafolios
                </NavLink>

                <NavLink className="nav-link d-flex align-items-center" to="/administrar">
		    <i className="bi bi-gear me-3 fs-5"></i>
		    Administrar
		</NavLink>                 

            </nav>
        </div>
    );
}

export default Sidebar;
