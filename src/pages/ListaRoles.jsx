import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/ListaRoles.css";
import FullScreenSpinner from "../components/FullScreenSpinner";

const apiUrl = import.meta.env.VITE_API_URL;

const ListaRoles = () => {
  const [datos, setDatos] = useState([]);
  const navigate = useNavigate();
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch(`${apiUrl}/convocatorias-roles`)
      .then((res) => res.json())
      .then((data) => {
        const datosConExpandido = data.map((item) => ({
          ...item,
          usuarios: item.usuarios?.map((u) => ({ ...u, expanded: false })) || [],
        }));
        setDatos(datosConExpandido);
      })
      .catch((error) => console.error("Error: ", error))
      .finally(() => setCargando(false));
  }, []);

  const eliminarFila = (index) => {
    alert("No disponible aun");
  };

  const iniciarEdicion = (index, rol) => {
    navigate("/asignarRoles", { state: { idConvocatoria: index, rol: rol } });
  };

  const irASignarRoles = () => {
    navigate("/asignarRoles");
  };

  const irACancelar = () => {
    navigate("/");
  };

  const toggleCard = (convId, index) => {
    setDatos((prevDatos) =>
      prevDatos.map((item) =>
        item.convocatoria_id === convId
          ? {
            ...item,
            usuarios: item.usuarios.map((u, i) =>
              i === index ? { ...u, expanded: !u.expanded } : u
            ),
          }
          : item
      )
    );
  };

  return (
    <div className="lista-container">
      <div className="lista-titulo">
        <h2>Lista de Roles Asignados</h2>
      </div>
      {cargando ? (
        <FullScreenSpinner />
      ) : (
        <>
          {/* Vista de tabla (escritorio) */}
          {datos.length === 0 ? (
            <p>No hay datos guardados.</p>
          ) : (
            <table className="lista-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Convocatoria</th>
                  <th>Rol</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {datos
                  .filter((item) => item.usuarios && item.usuarios.length > 0)
                  .map((item) =>
                    item.usuarios.map((user, index) => (
                      <tr key={index}>
                        <td>{user.name}</td>
                        <td>{item.convocatoria_nombre}</td>
                        <td>{user.role}</td>
                        <td>
                          <button onClick={() => iniciarEdicion(item.convocatoria_id, user)}>✏️</button>
                          <button onClick={() => eliminarFila(user.id)}>❌</button>
                        </td>
                      </tr>
                    ))
                  )}
              </tbody>
            </table>
          )}

          {/* Vista móvil (tarjetas colapsables) */}
          <div className="mobile-cards">
            {datos
              .filter((item) => item.usuarios && item.usuarios.length > 0)
              .map((item) =>
                item.usuarios.map((user, index) => (
                  <div className="role-card" key={`${item.convocatoria_id}-${index}`}>
                    <div className="role-summary" onClick={() => toggleCard(item.convocatoria_id, index)}>
                      <span className="role-name">{user.name}</span>
                      <span className="expand-icon">{user.expanded ? "▲" : "▼"}</span>
                    </div>
                    {user.expanded && (
                      <div className="role-details">
                        <p><strong>Convocatoria:</strong> {item.convocatoria_nombre}</p>
                        <p><strong>Rol:</strong> {user.role}</p>
                        <div className="card-actions">
                          <button className="edit-btn" onClick={() => iniciarEdicion(item.convocatoria_id, user)}>✏️ Editar</button>
                          <button className="delete-btn" onClick={() => eliminarFila(user.id)}>❌ Eliminar</button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
          </div>
        </>
      )}

      <div className="botones-container-tu">
        <button className="btn-agregar-lr" onClick={irASignarRoles}>Agregar +</button>
        <button className="btn-cancelar-lr" onClick={irACancelar}>Cancelar</button>
      </div>
    </div>
  );
};

export default ListaRoles;


