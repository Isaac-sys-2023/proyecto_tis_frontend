import React, { useState, useEffect } from "react";
import "./styles/DetalleConv.css";
import { Link, useNavigate } from "react-router-dom";

import FullScreenSpinner from "../components/FullScreenSpinner";

const apiUrl = import.meta.env.VITE_API_URL;

const DetalleConv = () => {
  const [convocatorias, setConvocatorias] = useState([]);
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(false);

  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch(`${apiUrl}/convocatorias/activas`)
      .then((response) => response.json())
      .then((data) => setConvocatorias(data))
      .catch((error) => console.error("Error al obtener convocatorias:", error))
      .finally(() => setCargando(false));
  }, [refresh]);

  const handleEdit = (id) => {
    navigate(`/editar-convocatoria/${id}`);
  };

  const handleDelete = async (id, convocatoria) => {
    console.log(convocatoria);
    console.log(id);

    if (!convocatoria) {
      console.error('Convocatoria no definida');
      return;
    }

    const newformData = new FormData();
    newformData.append('_method', 'PUT');
    newformData.append('tituloConvocatoria', convocatoria.tituloConvocatoria);
    newformData.append('descripcion', convocatoria.descripcion);
    newformData.append('fechaPublicacion', convocatoria.fechaPublicacion.split(' ')[0]);
    newformData.append('fechaInicioInsc', convocatoria.fechaInicioInsc.split(' ')[0]);
    newformData.append('fechaFinInsc', convocatoria.fechaFinInsc.split(' ')[0]);
    //newformData.append('portada', formData.imagenPortada); // <-- tu imagen
    if (convocatoria.portada instanceof File) {
      newformData.append('portada', convocatoria.portada);
    }
    newformData.append('habilitada', convocatoria.habilitada);
    newformData.append('fechaInicioOlimp', convocatoria.fechaInicioOlimp.split(' ')[0]);
    newformData.append('fechaFinOlimp', convocatoria.fechaFinOlimp.split(' ')[0]);
    newformData.append('maximoPostPorArea', convocatoria.maximoPostPorArea);
    newformData.append('eliminado', '1');

    try {
      const response = await fetch(`${apiUrl}/editconvocatorias/${id}`, {
        method: 'POST',
        body: newformData,
      });

      const text = await response.text();
      if (!response.ok) {
        console.error('Error del servidor:', text); // en vez de tratar de hacer response.json() directamente
        return;
      }

      setRefresh(!refresh);
    } catch (error) {
      console.error('Error al eliminar la convocatoria:', error);
    }
    // ...
  };

  const handleAbrir = () => {
    navigate("/crear-convocatoria");
  };

  const handleCancelar = () => {
    navigate("/");
  };

  return (
    <div className="container-detalleConv lista-usuarios">
      <h2 className="title-detalleConv">Detalle de convocatorias</h2>

      {cargando ? (
        <FullScreenSpinner />
      ) : (
        <>
          {/* Vista escritorio */}
          <div className="desktop tabla-contenedor">
            <table className="convocatoria-table">
              <thead>
                <tr>
                  <th>TÍTULO</th>
                  <th>FECHA DE INSCRIPCIONES</th>
                  <th>FECHA DE OLIMPIADAS</th>
                  <th>ESTADO</th>
                  <th>ACCIÓN</th>
                </tr>
              </thead>
              <tbody>
                {convocatorias.map((convocatoria) => (
                  <tr key={convocatoria.idConvocatoria}>
                    <td>{convocatoria.tituloConvocatoria}</td>
                    <td>
                      {convocatoria.fechaInicioInsc} - {convocatoria.fechaFinInsc}
                    </td>
                    <td>
                      {convocatoria.fechaInicioOlimp} - {convocatoria.fechaFinOlimp}
                    </td>
                    <td>
                      <span
                        className={`estado ${convocatoria.habilitada === 0 ? "rojo" : "verde"
                          }`}
                      >
                        {convocatoria.habilitada === 0 ? "Inactivo" : "Activo"}
                      </span>
                    </td>
                    <td>
                      <div className="btn-groupdetconv">
                        <button className="edit-btndetconv" onClick={() => handleEdit(convocatoria.idConvocatoria)}>✏️</button>
                        <button className="delete-btndetconv" onClick={() => handleDelete(convocatoria.idConvocatoria, convocatoria)}>❌</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Vista móvil */}
          <div className="mobile-cards">
            {convocatorias.map((convocatoria) => (
              <div key={convocatoria.idConvocatoria} className="user-card">
                <div className="user-header">
                  <span>{convocatoria.tituloConvocatoria}</span>
                  <span
                    className={`estado ${convocatoria.habilitada === 0 ? "rojo" : "verde"
                      }`}
                  >
                    {convocatoria.habilitada === 0 ? "Inactivo" : "Activo"}
                  </span>
                </div>
                <div className="user-details">
                  <p>
                    <strong>Inscripciones:</strong>{" "}
                    {convocatoria.fechaInicioInsc} - {convocatoria.fechaFinInsc}
                  </p>
                  <p>
                    <strong>Olimpiadas:</strong>{" "}
                    {convocatoria.fechaInicioOlimp} - {convocatoria.fechaFinOlimp}
                  </p>
                  <div className="card-actionsdetconv">
                    <button
                      className="edit-btndetconv"
                      onClick={() => handleEdit(convocatoria.idConvocatoria)}
                    >
                      ✏️ Editar
                    </button>
                    <button
                      className="delete-btndetconv"
                      onClick={() => handleDelete(convocatoria.idConvocatoria, convocatoria)}
                    >
                      ❌ Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="botones-detconv">
            <button type="button" className="btn-agregar-detconv" onClick={handleAbrir}>
              + Agregar
            </button>
            <button type="button" className="btn-salir-detconv" onClick={handleCancelar}>
              Cancelar
            </button>
          </div>
        </>
      )}


    </div>
  );
};

export default DetalleConv;
