import React, { useState } from "react";
import "./styles/DetalleInscripcion.css";

const DetalleInscripcion = ({
  estudiantes,
  onEliminar,
  setRegistro,
  setEstudianteEdit,
  setIndexEdit,
  setAreasSeleccionadas,
  setCategoriasSeleccionadas,
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 8;
  const [expandedIds, setExpandedIds] = useState([]);

  const startIndex = currentPage * itemsPerPage;
  const currentEstudiantes = estudiantes.slice(startIndex, startIndex + itemsPerPage);

  const toggleExpand = (id) => {
    if (expandedIds.includes(id)) {
      setExpandedIds(expandedIds.filter((eid) => eid !== id));
    } else {
      setExpandedIds([...expandedIds, id]);
    }
  };

  const handleEdit = (e, estudiante, index) => {
    e.preventDefault();
    setEstudianteEdit(estudiante);
    setIndexEdit(index);

    const categoriasOriginales = estudiante.categorias.map((categoria) => ({
      id: categoria.idCategoria,
      nombre: categoria.nombreCategoria,
    }));

    const areasOriginales = estudiante.areas.map((area) => ({
      id: area.idArea,
      nombre: area.tituloArea,
      categorias: categoriasOriginales,
    }));

    setAreasSeleccionadas(areasOriginales);
    setCategoriasSeleccionadas(categoriasOriginales);
    setRegistro(true);
  };

  return (
    <div className="contenedor-d">
      <h3 className="title-tabla-d">DETALLE DE LA INSCRIPCIÓN</h3>

      {/* Vista de escritorio */}
      <div className="tabla-d desktop-only">
        <table>
          <thead>
            <tr>
              <th className="col-nombre-estudiante-d">NOMBRE COMPLETO</th>
              <th className="col-area-d">ÁREA DE COMPETENCIA</th>
              <th className="col-accion-d">ACCIÓN</th>
            </tr>
          </thead>
          <tbody>
            {currentEstudiantes.map((estudiante, index) => (
              <tr key={index}>
                <td>{estudiante.nombrePost} {estudiante.apellidoPost}</td>
                <td>
                  {estudiante.areas.map((area, idx) => (
                    <React.Fragment key={area.idArea}>
                      {area.tituloArea} - {estudiante.categorias[idx]?.nombreCategoria}
                      <br />
                    </React.Fragment>
                  ))}
                </td>
                <td className="actions-d">
                  <button onClick={(e) => handleEdit(e, estudiante, index)} className="btn-modificar">
                    Modificar
                  </button>
                  <button onClick={() => onEliminar(index)} className="btn-eliminar">
                    Retirar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {estudiantes.length === 0 && (
          <h1 className="no-data-d">NO HAY ESTUDIANTES PARA REGISTRAR AÚN...</h1>
        )}

        {estudiantes.length > itemsPerPage && (
          <div className="pagination-d">
            <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 0}>
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

      {/* Vista móvil */}
      <div className="mobile-cards mobile-only">
        {currentEstudiantes.map((estudiante, index) => {
          const isExpanded = expandedIds.includes(estudiante.id || index);
          return (
            <div className="user-card-d" key={estudiante.id || index}>
              <div className="user-header-d" onClick={() => toggleExpand(estudiante.id || index)}>
                <span className="user-name-d">
                  {estudiante.nombrePost} {estudiante.apellidoPost}
                </span>
                <span className="toggle-icon-d">{isExpanded ? "▲" : "▼"}</span>
              </div>
              {isExpanded && (
                <div className="user-details-d">
                  <p>
                    <strong>Áreas:</strong>{" "}
                    {estudiante.areas.map((area, idx) => (
                      <span key={area.idArea}>
                        {area.tituloArea} - {estudiante.categorias[idx]?.nombreCategoria}
                        <br />
                      </span>
                    ))}
                  </p>
                  <div className="card-actions-d action-buttons">
                    <button onClick={(e) => handleEdit(e, estudiante, index)} className="btn-modificar">
                      Modificar
                    </button>
                    <button onClick={() => onEliminar(index)} className="btn-eliminar">
                      Retirarse
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DetalleInscripcion;
