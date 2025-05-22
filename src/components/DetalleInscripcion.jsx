import React, { useState } from "react";
import "./styles/GestionColegios.css";

const DetalleInscripcion = ({ estudiantes, onEliminar, setRegistro, setEstudianteEdit, setIndexEdit, setAreasSeleccionadas, setCategoriasSeleccionadas }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 8;

    console.log(estudiantes);

    const startIndex = currentPage * itemsPerPage;
    const currentEstudiantes = estudiantes.slice(startIndex, startIndex + itemsPerPage);

    const handleEdit = (e, estudiante, index) => {
        e.preventDefault();
        setEstudianteEdit(estudiante);
        setIndexEdit(index);

        // Revertir categorías formateadas
        const categoriasOriginales = estudiante.categorias.map((categoria) => ({
            id: categoria.idCategoria,
            nombre: categoria.nombreCategoria,
        }));

        // Revertir áreas formateadas
        const areasOriginales = estudiante.areas.map((area) => ({
            id: area.idArea,
            nombre: area.tituloArea,
            categorias: categoriasOriginales,
        }));

        setAreasSeleccionadas(areasOriginales);
        setCategoriasSeleccionadas(categoriasOriginales);
        setRegistro(true)
    }

    return (
        <div className="contenedor">
            <h3 className="title-tabla">DETALLE DE LA INSCRIPCIÓN</h3>
            <div className="tabla">
                <table>
                    <thead>
                        <tr>
                            <th className="col-nombre-estudiante">NOMBRE COMPLETO</th>
                            <th className="col-area">AREA DE COMPETENCIA</th>
                            <th className="col-accion">ACCIÓN</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentEstudiantes.map((estudiante, index) => (
                            <tr key={index}>
                                <td>{estudiante.nombrePost} {estudiante.apellidoPost}</td>
                                <td>
                                    {estudiante.areas.map((area, index) => (
                                        <React.Fragment key={area.idArea}>
                                            {area.tituloArea} - {estudiante.categorias[index]?.nombreCategoria}
                                            <br />
                                        </React.Fragment>
                                    ))}
                                </td>
                                <td className="actions">
                                    <button
                                        onClick={e => handleEdit(e, estudiante, index)}
                                        className="boton-style btn-rechazo"
                                    >Modificar</button>
                                    <button onClick={() => onEliminar(index)} className="boton-style btn-rechazo">Retirar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {estudiantes.length === 0 && (
                    <h1 className="no-data">
                        NO HAY ESTUDIANTES PARA REGISTRAR AÚN...
                    </h1>
                )}

                {estudiantes.length > itemsPerPage && (
                    <div className="pagination">
                        <button
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 0}
                        >
                            Anterior
                        </button>
                        <span>Página {currentPage + 1} de {Math.ceil(estudiantes.length / itemsPerPage)}</span>
                        <button
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={startIndex + itemsPerPage >= estudiantes.length}
                        >
                            Siguiente
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default DetalleInscripcion;