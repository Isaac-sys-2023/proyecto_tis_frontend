import React, { useEffect, useState } from "react";
import "../components/styles/GestionColegios.css";
import { Link, useNavigate } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL;

const GestionColegios = () => {
    const navigate = useNavigate();

    const [colegios, setColegios] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 8;

    useEffect(() => {
        fetch(`${apiUrl}/getcolegio`)
            .then(response => response.json())
            .then(data => setColegios(data))
            .catch(error => console.error("Error al obtener colegios:", error));
    }, []);

    const startIndex = currentPage * itemsPerPage;
    const currentColegios = colegios.slice(startIndex, startIndex + itemsPerPage);

    const handleModificar = (colegio) => {
        navigate("/edit-colegios", {
            state: { colegio },
        });
    };
    

    return (
        <div className="contenedor-colegio">
            <h3 className="title-tabla">UNIDADES EDUCATIVAS</h3>
            <div className="tabla">
                <table>
                    <thead>
                        <tr>
                            <th className="col-rue">RUE</th>
                            <th className="col-rue">ID</th>
                            <th className="col-nombre">UNIDAD EDUCATIVA</th>
                            <th className="col-accion">ACCIÓN</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentColegios.map((colegio) => (
                            <tr key={colegio.idColegio}>
                                <td>{colegio.RUE}</td>
                                <td>{colegio.idColegio}</td>
                                <td>{colegio.nombreColegio}</td>
                                <td className="actions">
                                    <button onClick={() => handleModificar(colegio)} className="boton-style btn-rechazo">
                                        Modificar
                                    </button>
                                    <button className="boton-style btn-rechazo">Retirar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {colegios.length === 0 && (
                    <h1 className="no-data">
                        NO HAY COLEGIOS REGISTRADOS AÚN...
                    </h1>
                )}

                {colegios.length > itemsPerPage && (
                    <div className="pagination">
                        <button
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 0}
                        >
                            Anterior
                        </button>
                        <span>Página {currentPage + 1} de {Math.ceil(colegios.length / itemsPerPage)}</span>
                        <button
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={startIndex + itemsPerPage >= colegios.length}
                        >
                            Siguiente
                        </button>
                    </div>
                )}
            </div>
            <div className="control">
                <Link to="/registro-colegios" className="boton-style btn-aceptacion">Añadir nuevo</Link>
                <Link to="/" className="boton-style btn-rechazo">Cancelar</Link>
            </div>
        </div>
    );
}

export default GestionColegios;
