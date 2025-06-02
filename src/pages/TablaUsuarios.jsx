import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/TablaUsuarios.css";

import FullScreenSpinner from "../components/FullScreenSpinner";
const apiUrl = import.meta.env.VITE_API_URL;

const TablaUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const navigate = useNavigate();

  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = () => {
    fetch(`${apiUrl}/todosusers`)
      .then(response => response.json())
      .then(data => {
        const withExpanded = data.map(u => ({ ...u, expanded: false }));
        setUsuarios(withExpanded);
      })
      .catch(error => console.error("Error al obtener usuarios:", error))
      .finally(() => setCargando(false));
  };

  const handleEditar = (id) => {
    navigate(`/addUser/${id}`);
  };

  const handleEliminar = async (id) => {
    const confirmacion = window.confirm("¿Estás seguro de eliminar este usuario?");
    if (!confirmacion) return;

    try {
      const res = await fetch(`${apiUrl}/eliminausers/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error:", errorData);
        alert("Error al eliminar el usuario");
        return;
      }

      cargarUsuarios();
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
    }
  };

  const handleAsignarRol = (nombre) => {
    localStorage.setItem("rolEditar", JSON.stringify({ nombre }));
    navigate("/asignarRoles");
  };

  const handleRegistrar = () => {
    navigate("/addUser");
  };

  const toggleExpand = (id) => {
    setUsuarios(prev =>
      prev.map(u => u.id === id ? { ...u, expanded: !u.expanded } : u)
    );
  };

  return (
    <div>
      <div className="titulo-tabla">
        <h2>Lista de Usuarios</h2>
      </div>
      {cargando ? (
        <FullScreenSpinner />
      ) : (
        <>
          {/* Vista escritorio */}
          <div className="tabla-contenedor desktop">
            <table>
              <thead>
                <tr>
                  <th>Nombre Completo</th>
                  <th>Email</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario) => (
                  <tr key={usuario.id}>
                    <td>{usuario.name} {usuario.apellido}</td>
                    <td>{usuario.email}</td>
                    <td>
                      <button onClick={() => handleEditar(usuario.id)}>✏️</button>
                      <button onClick={() => handleAsignarRol(usuario.nombre)}>Rol</button>
                      <button onClick={() => handleEliminar(usuario.id)}>❌</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Vista móvil */}
          <div className="mobile-cards">
            {usuarios.map((usuario) => (
              <div className="user-card" key={usuario.id}>
                <div className="user-header" onClick={() => toggleExpand(usuario.id)}>
                  <span className="user-name">{usuario.name} {usuario.apellido}</span>
                  <span className="toggle-icon">{usuario.expanded ? '▲' : '▼'}</span>
                </div>
                {usuario.expanded && (
                  <div className="user-details">
                    <p><strong>Email:</strong> {usuario.email}</p>
                    <div className="card-actions">
                      <button onClick={() => handleEditar(usuario.id)}>✏️ Editar</button>
                      <button onClick={() => handleAsignarRol(usuario.nombre)}>Rol</button>
                      <button onClick={() => handleEliminar(usuario.id)}>❌ Eliminar</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
      <div className="acciones-superiores">
        <button className="btn-registrar" onClick={handleRegistrar} disabled={cargando}>Agregar +</button>
        <button className="btn-cancelar" onClick={() => navigate("/")} disabled={cargando}>Cancelar</button>
      </div>
    </div>
  );
};

export default TablaUsuarios;

