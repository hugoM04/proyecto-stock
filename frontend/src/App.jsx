import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/layout/Sidebar";
import Inicio from "./pages/Inicio";
import Cotizar from "./pages/Cotizar";
import Comprar from "./pages/Comprar";
import Vender from "./pages/Vender";
import Portafolios from "./pages/Portafolios";
import Administrar from "./pages/Administrar";

function App() {
    return (
        <BrowserRouter basename="/proyecto-stock">
            {/* Navbar superior fijo */}
            <div className="sticky-top" style={{ zIndex: 1030 }}>
                <Navbar />
            </div>

            {/* Layout principal: Tu d-flex original que mantiene el estilo intacto */}
            <div className="app-layout-container">

                <Sidebar />

                {/* Área de Contenido con tu fondo gris SaaS ultra claro original */}
                <div
                    className="main-content-area p-4"
                    style={{
                        minHeight: "calc(100vh - 56px)",
                        backgroundColor: "#f8fafc"
                    }}
                >
                    <Routes>
                        <Route path="/" element={<Inicio />} />
                        <Route path="/cotizar" element={<Cotizar />} />
                        <Route path="/comprar" element={<Comprar />} />
                        <Route path="/vender" element={<Vender />} />
                        <Route path="/portafolios" element={<Portafolios />} />
                        <Route path="/administrar" element={<Administrar />} />
                    </Routes>
                </div>

            </div>
        </BrowserRouter>
    );
}

export default App;
