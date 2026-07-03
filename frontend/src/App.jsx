import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Inicio from "./pages/Inicio";
import Cotizar from "./pages/Cotizar";
import Comprar from "./pages/Comprar";
import Vender from "./pages/Vender";
import Portafolios from "./pages/Portafolios";

function App() {

    return (

        <BrowserRouter>

            <Navbar />

            <div className="container mt-4">

                <Routes>

                    <Route path="/" element={<Inicio />} />

                    <Route path="/cotizar" element={<Cotizar />} />

                    <Route path="/comprar" element={<Comprar />} />

                    <Route path="/vender" element={<Vender />} />

                    <Route path="/portafolios" element={<Portafolios />} />

                </Routes>

            </div>

        </BrowserRouter>

    );

}

export default App;
