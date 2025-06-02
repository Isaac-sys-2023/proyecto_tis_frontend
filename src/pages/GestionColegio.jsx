import React, { useEffect, useState } from "react";
import "../components/styles/GestionColegios.css";
import { Link, useNavigate } from "react-router-dom";

import FullScreenSpinner from "../components/FullScreenSpinner";

const apiUrl = import.meta.env.VITE_API_URL;

const GestionColegios = () => {
  const navigate = useNavigate();
  const [colegios, setColegios] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [expandedId, setExpandedId] = useState(null);
  const itemsPerPage = 8;

  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch(`${apiUrl}/getcolegio`)
      .then((response) => response.json())
      .then((data) => setColegios(data))
      .catch((error) => console.error("Error al obtener colegios:", error))
      .finally(() => setCargando(false));    
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

  const handleRetirar = async (colegio) => {
    // Aquí puedes agregar lógica para eliminar o actualizar
  };

  return (
    <div className="contenedor-gestion-col">
      <div className="contenedor-blanco">
        <h2 className="titulo-colegios">Unidades Educativas</h2>

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

        {cargando && <FullScreenSpinner />}

        {colegios.length === 0 && !cargando && <h3 className="no-data">NO HAY COLEGIOS REGISTRADOS AÚN...</h3>}

        {colegios.length > itemsPerPage && (
          <div className="botones-pag">
            <button className="btn-pag-ant" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 0 || cargando}>
              Anterior</button>
            <span> Página {currentPage + 1} de {Math.ceil(colegios.length / itemsPerPage)} </span>
            <button className="btn-pag-sig" onClick={() => setCurrentPage(currentPage + 1)} disabled={startIndex + itemsPerPage >= colegios.length || cargando} >
              Siguiente </button>
          </div>
        )}
        <div className="botones-tabla-col">
          <button type="button" className="btn-registrar-col" onClick={() => navigate("/registro-colegios")} disabled={cargando}>Registrar </button>
          <button type="button" className="btn-cancelar-col" onClick={() => navigate("/")} disabled={cargando}>Cancelar</button>
        </div>
      </div>
      <hr className="separador" />
    </div>
  );
};

export default GestionColegios;
