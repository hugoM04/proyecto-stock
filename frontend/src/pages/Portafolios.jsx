import { useEffect, useState } from "react";
import { obtenerResumen } from "../services/resumenPortafolioService";
import ResumenCards from "../components/dashboard/ResumenCards";
import TablaAcciones from "../components/dashboard/TablaAcciones";
import GraficaPortafolio from "../components/dashboard/GraficaPortafolio";
import { obtenerHistorial } from "../services/historialService";
import { obtenerPortafolios } from "../services/portafoliosService";

function Portafolios(){
    const [resumen, setResumen] = useState(null);
    const [historial, setHistorial] = useState([]);
    const [portafolios, setPortafolios] = useState([]);
    const [portafolioSeleccionado, setPortafolioSeleccionado] = useState("");

    useEffect(() => {
        cargarPortafolios();
    }, []);

    useEffect(() => {

        if(portafolioSeleccionado){

            cargarResumen();

            cargarHistorial();

        }

    }, [portafolioSeleccionado]);

    const cargarPortafolios = async () => {

        try{

            const data = await obtenerPortafolios();

            setPortafolios(data);

            if(data.length > 0){

                setPortafolioSeleccionado(data[0].id);

            }

        }catch(error){

            console.error(error);

        }

    };

    const cargarResumen = async () => {
        try {
            const data = await obtenerResumen(portafolioSeleccionado);
            setResumen(data);
        } catch(error) {
            console.error(error);
        }
    };

    const cargarHistorial = async () => {
        try {
            const data = await obtenerHistorial(portafolioSeleccionado);
            setHistorial(data);
        } catch(error) {
            console.error(error);
        }
    };

    if(!resumen){
        return (

            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
        );
    }

    return(
        <div className="container-fluid px-2">
            
            {/* Título de la sección */}

            <div className="mb-4">

                <label className="form-label fw-semibold">

                    Seleccionar portafolio

                </label>

                <select

                    className="form-select"

                    value={portafolioSeleccionado}

                    onChange={(e)=>setPortafolioSeleccionado(e.target.value)}

                >

                    {

                        portafolios.map((p)=>(

                            <option
                                key={p.id}
                                value={p.id}
                            >

                                {p.nombre}

                            </option>

                        ))

                    }

                </select>

            </div>

            <div className="mb-4">
                <h1 className="h3 fw-bold text-dark mb-1">{resumen.portafolio}</h1>
                <p className="text-muted small">Revisión general de tus activos y rendimiento en tiempo real.</p>
            </div>

            {/* Componente de las 3 tarjetas informativas */}
            <div className="mb-4">
                <ResumenCards resumen={resumen}/>
            </div>
  
            {/* Bloque de Gráfica */}
            <div className="mb-4">
                <GraficaPortafolio historial={historial}/>
            </div>

            {/* Listado de Acciones en tabla */}
            <div className="mb-4">
                <TablaAcciones acciones={resumen.acciones}/>
            </div>

        </div>
    );
}

export default Portafolios;