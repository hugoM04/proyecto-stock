
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/layout/Sidebar";
import Inicio from "./pages/Inicio";
import Cotizar from "./pages/Cotizar";
import Comprar from "./pages/Comprar";
import Vender from "./pages/Vender";
import Portafolios from "./pages/Portafolios";

function App() {
    return (
        <BrowserRouter>
            {/* Navbar superior fijo arriba de todo */}
            <div className="sticky-top" style={{ zIndex: 1030 }}>
                <Navbar />
            </div>

            {/* Layout principal */}
            <div className="d-flex">
                
                {/* Barra lateral fija */}
                <Sidebar />

                {/* Área de Contenido */}
                <div
                    className="flex-grow-1 p-4 bg-light"
                    style={{ 
                        minHeight: "calc(100vh - 56px)",
                        backgroundColor: "#f8fafc" /* Fondo gris Saas ultra claro */
                    }}
                >
                    <Routes>
                        <Route path="/" element={<Inicio />} />
                        <Route path="/cotizar" element={<Cotizar />} />
                        <Route path="/comprar" element={<Comprar />} />
                        <Route path="/vender" element={<Vender />} />
                        <Route path="/portafolios" element={<Portafolios />} />
                    </Routes>
                </div>

            </div>
        </BrowserRouter>
    );
}

export default App;