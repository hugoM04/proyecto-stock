import { useEffect, useState } from "react";

import { obtenerAcciones } from "../services/accionesService";
import { obtenerPortafolios } from "../services/portafoliosService";
import api from "../services/api";
import { registrarCompra } from "../services/comprasService";
import { registrarVenta } from "../services/ventasService";

function FormularioOperacion({ tipo }) {

    const [acciones, setAcciones] = useState([]);
    const [portafolios, setPortafolios] = useState([]);

    const [accionSeleccionada, setAccionSeleccionada] = useState("");
    const [portafolioSeleccionado, setPortafolioSeleccionado] = useState("");

    const [cantidad, setCantidad] = useState("");

    const [cotizacion, setCotizacion] = useState(null);

    const [mensaje, setMensaje] = useState("");

    const [error, setError] = useState("");
    
    // Nuevo estado para controlar la petición asíncrona
    const [cargando, setCargando] = useState(false);

    useEffect(() => {

        cargarAcciones();
        cargarPortafolios();

    }, []);

    const cargarAcciones = async () => {

        try{

            const data = await obtenerAcciones();

            setAcciones(data);

        }catch(error){

            console.error(error);
        }

    };

    const cargarPortafolios = async () => {

        try{

            const data = await obtenerPortafolios();

            setPortafolios(data);

        }catch(error){

            console.error(error);

        }

    };

    const obtenerPrecio = async (simbolo) => {

        try{

            const response = await api.get(`/cotizacion/${simbolo}`);

            setCotizacion(response.data);

        }catch(error){

            console.error(error);

        }

    };

    const guardarOperacion = async () => {

        setMensaje("");
        setError("");

        if (!portafolioSeleccionado) {
            setError("Seleccione un portafolio.");
            return;
        }

        if (!accionSeleccionada) {
            setError("Seleccione una acción.");
            return;
        }

        if (!cantidad) {
            setError("Ingrese una cantidad.");
            return;
        }

        if (Number(cantidad) <= 0) {
            setError("La cantidad debe ser mayor que cero.");
            return;
        }

        try {
            
            setCargando(true);

            const datos = {

                portafolio_id: Number(portafolioSeleccionado),
                accion_id: Number(accionSeleccionada),
                cantidad: Number(cantidad)

            };

            if (tipo === "compra") {

                await registrarCompra(datos);

            } else {

                await registrarVenta(datos);

            }

            setMensaje("Operación registrada correctamente.");

            setCantidad("");

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.mensaje ||
                "Ocurrió un error."
            );
        } finally {
            
            setCargando(false);
            
        }

    };

    return (

        <div className="container mt-4">

            <div className="card shadow">

                <div className="card-header">

                    <h3>

                        {tipo === "compra"
                            ? "Comprar Acciones"
                            : "Vender Acciones"}

                    </h3>

                </div>

                <div className="card-body">

                    {/* Portafolio */}

                    <div className="mb-3">

                        <label className="form-label">

                            Portafolio

                        </label>

                        <select

                            className="form-select"

                            value={portafolioSeleccionado}

                            onChange={(e)=>setPortafolioSeleccionado(e.target.value)}

                        >
                            <option value="">

                                Seleccione un portafolio

                            </option>

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

                    {/* Acción */}

                    <div className="mb-3">

                        <label className="form-label">

                            Acción

                        </label>

                        <select

                            className="form-select"

                            value={accionSeleccionada}
                            onChange={(e)=>{

                                setAccionSeleccionada(e.target.value);

                                const simbolo =
                                e.target.options[
                                    e.target.selectedIndex
                                ].dataset.simbolo;

                                obtenerPrecio(simbolo);

                            }}

                        >

                            <option value="">

                                Seleccione una acción

                            </option>

                            {

                                acciones.map((a)=>(

                                    <option

                                        key={a.id}

                                        value={a.id}

                                        data-simbolo={a.simbolo}

                                    >

                                        {a.simbolo} - {a.nombre}

                                    </option>

                                ))

                            }

                        </select>

                    </div>

                    {/* Precio */}

                    {

                        cotizacion && (

                            <div className="alert alert-info">

                                <strong>

                                    Precio actual:

                                </strong>

                                {" $"}

                                {cotizacion.precio}

                            </div>

                        )

                    }

                    {/* Cantidad */}

                    <div className="mb-3">

                        <label className="form-label">

                            Cantidad

                        </label>

                        <input

                            type="number"
                            min="1"

                            className="form-control"

                            value={cantidad}

                            onChange={(e)=>setCantidad(e.target.value)}

                        />

                    </div>

                    {
                       mensaje &&

                       <div className="alert alert-success">

                           {mensaje}

                       </div>
                    }

                    {
                       error &&

                       <div className="alert alert-danger">

                           {error}

                       </div>
                    }

                    <button
                        disabled={cargando}
                        className={
                            tipo==="compra"
                            ? "btn btn-success"
                            : "btn btn-danger"
                        }
                        onClick={guardarOperacion}
                    >
                        {
                            cargando
                            ? "Procesando..."
                            : tipo==="compra"
                            ? "Comprar"
                            : "Vender"
                        }
                    </button>

                </div>

            </div>

        </div>

    );

}

export default FormularioOperacion;
