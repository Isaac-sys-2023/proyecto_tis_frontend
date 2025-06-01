import React, { useEffect, useState } from "react";
import "../components/styles/GestionColegios.css";
import { Link, useNavigate } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL;

const GestionColegios = () => {
  const navigate = useNavigate();
  const [colegios, setColegios] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [expandedId, setExpandedId] = useState(null);
  const itemsPerPage = 8;

  useEffect(() => {
    fetch(`${apiUrl}/getcolegio`)
      .then((response) => response.json())
      .then((data) => setColegios(data))
      .catch((error) => console.error("Error al obtener colegios:", error));
  }, []);

  const startIndex = currentPage * itemsPerPage;
  const currentColegios = colegios.slice(startIndex, startIndex + itemsPerPage);

  const handleModificar = (colegio) => {
    navigate("/edit-colegios", {
      state: { colegio },
    });
  };

  const toggleExpand = (id) => {
    setExpandedId((prevId) => (prevId === id ? null : id));
  };

  const handleRetirar = async(colegio) => {
    // const dataToSend = {
    //   nombreColegio: colegio.nombreColegio,
    //   departamento,
    //   provincia,
    //   RUE: formData.rue,
    //   direccion: formData.direccion,
    //   fecha_creacion: formData.fechaCreacion,
    // };


    // try {
    //   const response = await fetch(`${apiUrl}/colegio/${idColegio}`, {
    //     method: "PUT",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Accept: "application/json",
    //     },
    //     body: JSON.stringify(dataToSend),
    //   });

    //   if (!response.ok) {
    //     const errorData = await response.json();
    //     console.error("Error:", errorData);
    //     alert("Error al actualizar el colegio");
    //     return;
    //   }

    //   setDepartamento("");
    //   setProvincia("");
    //   setProvincias([]);

    //   navigate("/colegios");
    // } catch (error) {
    //   console.error("Error en el envío:", error);
    //   alert("Ocurrió un error al eliminar el colegio.");
    //}
  }

  return (
    <div className="lista-usuarios">
      <h2>Unidades Educativas</h2>

      {/* Vista escritorio */}
      <div className="tabla-contenedor desktop">
        <table>
          <thead>
            <tr>
              <th>RUE</th>
              <th>ID</th>
              <th>Nombre</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {currentColegios.map((colegio) => (
              <tr key={colegio.idColegio}>
                <td>{colegio.RUE}</td>
                <td>{colegio.idColegio}</td>
                <td>{colegio.nombreColegio}</td>
                <td>
                  <button onClick={() => handleModificar(colegio)}>✏️</button>
                  <button onClick={() => handleRetirar(colegio)}>❌</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Vista móvil */}
      <div className="mobile-cards">
        {currentColegios.map((colegio) => (
          <div className="user-card" key={colegio.idColegio}>
            <div className="user-header" onClick={() => toggleExpand(colegio.idColegio)}>
              <span className="user-name">{colegio.nombreColegio}</span>
              <span className="toggle-icon">{expandedId === colegio.idColegio ? '▲' : '▼'}</span>
            </div>
            {expandedId === colegio.idColegio && (
              <div className="user-details">
                <p><strong>RUE:</strong> {colegio.RUE}</p>
                <p><strong>ID:</strong> {colegio.idColegio}</p>
                <div className="card-actions">
                  <button onClick={() => handleModificar(colegio)}>✏️ Editar</button>
                  <button onClick={() => handleRetirar(colegio)}>❌ Retirar</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {colegios.length === 0 && <h3 className="no-data">NO HAY COLEGIOS REGISTRADOS AÚN...</h3>}

      {colegios.length > itemsPerPage && (
        <div className="pagination">
          <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 0}>
            Anterior
          </button>
          <span>
            Página {currentPage + 1} de {Math.ceil(colegios.length / itemsPerPage)}
          </span>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={startIndex + itemsPerPage >= colegios.length}
          >
            Siguiente
          </button>
        </div>
      )}

      <div className="botones-containe">
        <Link to="/registro-colegios" className="btn-registrar">Registrar Colegio</Link>
        <button className="btn-cancelar" onClick={() => navigate("/")}>Cancelar</button>
      </div>

      <hr className="separador" />
    </div>
  );
};

export default GestionColegios;
