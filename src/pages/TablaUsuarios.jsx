import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/TablaUsuarios.css";

const apiUrl = import.meta.env.VITE_API_URL;

const TablaUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = () => {
    fetch(`${apiUrl}/todosusers`)
      .then(response => response.json())
      .then(data => setUsuarios(data))
      .catch(error => console.error("Error al obtener usuarios:", error));
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

      cargarUsuarios(); // <-- Asegúrate de tener esta función definida (con useEffect o aparte)
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

  return (
    <div>
      <h2>Lista de Usuarios</h2>

      <div className="acciones-superiores">
        <button className="btn-registrar" onClick={handleRegistrar}>
          Registrar +
        </button>
        <button className="btn-cancelar" onClick={() => navigate("/")}>
          Cancelar
        </button>
      </div>

      <div className="tabla-contenedor">
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
                  <button onClick={() => handleEditar(usuario.id)}>✍️</button>
                  <button onClick={() => handleAsignarRol(usuario.nombre)}>🎯Rol</button>
                  <button onClick={() => handleEliminar(usuario.id)}>❌</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TablaUsuarios;
