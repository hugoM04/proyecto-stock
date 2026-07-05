import { useEffect, useState } from "react";
import { obtenerAcciones } from "../services/accionesService";
import { obtenerCotizacion } from "../services/cotizacionService";
import { LOGOS } from "../utils/logos";

function Cotizar() {

    const [acciones, setAcciones] = useState([]);

    const [accionSeleccionada, setAccionSeleccionada] = useState("");

    const [cotizacion, setCotizacion] = useState(null);

    const [cantidad, setCantidad] = useState(1);

    useEffect(() => {
        cargarAcciones();
    }, []);

    const cargarAcciones = async () => {

        try {

            const data = await obtenerAcciones();

            setAcciones(data);

        } catch (error) {

            console.error(error);

        }

    };

    const consultarCotizacion = async (simbolo) => {

        if (!simbolo) {

            setCotizacion(null);

            return;

        }

        try {

            const data = await obtenerCotizacion(simbolo);

            setCotizacion(data);

        } catch (error) {

            console.error(error);

        }

    };

    

    const logoSeleccionado = LOGOS[accionSeleccionada];

    return (

        <div className="container-fluid px-2 mt-2">

            {/* Encabezado */}

            <div className="mb-4">

                <h1 className="h3 fw-bold text-dark">

                    Cotizaciones de Mercado

                </h1>

                <p className="text-muted">

                    Consulta precios reales y calcula cuánto costaría invertir.

                </p>

            </div>

            {/* Cotizador */}

            <div className="card border-0 shadow-sm rounded-4 mb-4">

                <div className="card-header bg-white">

                    <h5 className="fw-bold mb-0">

                        Simulador de Cotización

                    </h5>

                </div>

                <div className="card-body">

                    <div className="row">

                        <div className="col-md-6">

                            <label className="form-label">

                                Empresa

                            </label>

                            <select

                                className="form-select"

                                value={accionSeleccionada}

                                onChange={(e)=>{

                                    setAccionSeleccionada(e.target.value);

                                    consultarCotizacion(e.target.value);

                                }}

                            >

                                <option value="">

                                    Seleccione una empresa

                                </option>

                                {

                                    acciones.map(a=>(

                                        <option
                                            key={a.id}
                                            value={a.simbolo}
                                        >

                                            {a.simbolo} - {a.nombre}

                                        </option>

                                    ))

                                }

                            </select>

                        </div>

                        <div className="col-md-6">

                            <label className="form-label">

                                Cantidad

                            </label>

                            <input

                                type="number"

                                min="1"

                                className="form-control"

                                value={cantidad}

                                onChange={(e)=>setCantidad(Number(e.target.value))}

                            />

                        </div>

                    </div>

                    {

                        cotizacion && (

                            <div className="mt-4">

                                <div className="row">

                                    <div className="col-lg-4 text-center">

                                        {

                                            logoSeleccionado &&

                                            <img

                                                src={logoSeleccionado}

                                                alt={cotizacion.simbolo}

                                                style={{

                                                    width:"80px",
                                                    height:"80px",
                                                    objectFit:"contain"

                                                }}

                                            />

                                        }

                                        <h3 className="mt-3">

                                            {cotizacion.simbolo}

                                        </h3>

                                    </div>

                                    <div className="col-lg-8">

                                        <div className="row g-3">

                                            <div className="col-md-4">

                                                <div className="card">

                                                    <div className="card-body text-center">

                                                        <small className="text-muted">

                                                            Precio

                                                        </small>

                                                        <h4>

                                                            ${cotizacion.precio.toFixed(2)}

                                                        </h4>

                                                    </div>

                                                </div>

                                            </div>

                                            <div className="col-md-4">

                                                <div className="card">

                                                    <div className="card-body text-center">

                                                        <small className="text-muted">

                                                            Variación

                                                        </small>

                                                        <h4 className={cotizacion.porcentaje >=0 ? "text-success":"text-danger"}>

                                                            {(cotizacion.porcentaje*100).toFixed(2)}%

                                                        </h4>

                                                    </div>

                                                </div>

                                            </div>

                                            <div className="col-md-4">

                                                <div className="card">

                                                    <div className="card-body text-center">

                                                        <small className="text-muted">

                                                            Volumen

                                                        </small>

                                                        <h6>

                                                            {cotizacion.volumen.toLocaleString()}

                                                        </h6>

                                                    </div>

                                                </div>

                                            </div>

                                        </div>

                                        <div className="row g-3 mt-2">

                                            <div className="col-md-6">

                                                <div className="card">

                                                    <div className="card-body text-center">

                                                        <small className="text-muted">

                                                            Bid

                                                        </small>

                                                        <h5>

                                                            ${cotizacion.venta}

                                                        </h5>

                                                    </div>

                                                </div>

                                            </div>

                                            <div className="col-md-6">

                                                <div className="card">

                                                    <div className="card-body text-center">

                                                        <small className="text-muted">

                                                            Ask

                                                        </small>

                                                        <h5>

                                                            ${cotizacion.compra}

                                                        </h5>

                                                    </div>

                                                </div>

                                            </div>

                                        </div>

                                        <div className="alert alert-primary mt-4">

                                            <h5>

                                                Inversión estimada

                                            </h5>

                                            <h2>

                                                $

                                                {(cantidad*cotizacion.precio).toLocaleString(undefined,{
                                                    minimumFractionDigits:2,
                                                    maximumFractionDigits:2
                                                })}

                                            </h2>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        )

                    }

                </div>

            </div>

            {/* Tabla de acciones */}

            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">

                <div className="card-header bg-white border-bottom">

                    <h5 className="fw-bold mb-0">

                        Activos Disponibles

                    </h5>

                </div>

                <div className="table-responsive">

                    <table className="table table-hover align-middle mb-0">

                        <thead className="table-light">

                            <tr>

                                <th>ID</th>

                                <th>Activo</th>

                                <th>Empresa</th>

                            </tr>

                        </thead>

                        <tbody>

                            {

                                acciones.map((accion)=>{

                                    const logo = LOGOS[accion.simbolo];

                                    return(

                                        <tr key={accion.id}>

                                            <td>

                                                #{accion.id}

                                            </td>

                                            <td>

                                                <span className="badge bg-primary">

                                                    {accion.simbolo}

                                                </span>

                                            </td>

                                            <td>

                                                <div className="d-flex align-items-center">

                                                    {

                                                        logo &&

                                                        <img

                                                            src={logo}

                                                            alt={accion.simbolo}

                                                            style={{
                                                                width:"30px",
                                                                height:"30px",
                                                                objectFit:"contain"
                                                            }}

                                                            className="me-3"

                                                        />

                                                    }

                                                    {accion.nombre}

                                                </div>

                                            </td>

                                        </tr>

                                    );

                                })

                            }

                        </tbody>

                    </table>

                </div>

            </div>

        </div>

    );

}

export default Cotizar;