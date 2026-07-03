import { useEffect, useState } from "react";
import { obtenerAcciones } from "../services/accionesService";

function Cotizar() {

    const [acciones, setAcciones] = useState([]);

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

    return (

        <div>

            <h2>Cotizar</h2>

            <table className="table table-striped">

                <thead>

                    <tr>

                        <th>ID</th>
                        <th>Símbolo</th>
                        <th>Empresa</th>

                    </tr>

                </thead>

                <tbody>

                    {acciones.map((accion) => (

                        <tr key={accion.id}>

                            <td>{accion.id}</td>

                            <td>{accion.simbolo}</td>

                            <td>{accion.nombre}</td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );

}

export default Cotizar;
