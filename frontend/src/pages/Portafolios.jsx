import { useEffect, useState } from "react";
import { obtenerPortafolios } from "../services/portafoliosService";

function Portafolios() {

    const [portafolios, setPortafolios] = useState([]);

    useEffect(() => {

        cargarPortafolios();

    }, []);

    const cargarPortafolios = async () => {

        try {

            const data = await obtenerPortafolios();

            setPortafolios(data);

        } catch (error) {

            console.error(error);

        }

    };

    return (

        <div>

            <h2>Portafolios</h2>

            <table className="table table-bordered">

                <thead>

                    <tr>

                        <th>ID</th>
                        <th>Nombre</th>

                    </tr>

                </thead>

                <tbody>

                    {portafolios.map((portafolio) => (

                        <tr key={portafolio.id}>

                            <td>{portafolio.id}</td>

                            <td>{portafolio.nombre}</td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );

}

export default Portafolios;
