import { Link } from "react-router-dom";

function Navbar() {

    return (

        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">

            <div className="container">

                <Link className="navbar-brand" to="/">
                    📈 Stock Manager
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#menu">

                    <span className="navbar-toggler-icon"></span>

                </button>

                <div className="collapse navbar-collapse" id="menu">

                    <ul className="navbar-nav ms-auto">

                        <li className="nav-item">
                            <Link className="nav-link" to="/">Inicio</Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link" to="/cotizar">Cotizar</Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link" to="/comprar">Comprar</Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link" to="/vender">Vender</Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link" to="/portafolios">Portafolios</Link>
                        </li>

                    </ul>

                </div>

            </div>

        </nav>

    );

}

export default Navbar;
