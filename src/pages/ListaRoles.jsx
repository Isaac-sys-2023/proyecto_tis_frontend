import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/ListaRoles.css";

const ListaRoles = () => {
  const [datos, setDatos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    //const datosGuardados = JSON.parse(localStorage.getItem("rolesAsignados")) || [];
    fetch("http://localhost:8000/api/convocatorias-roles")
      .then((res) => res.json())
      .then((data) => {
        setDatos(data);
        console.log(data);
      });
  }, []);

  const eliminarFila = (index) => {
    // const nuevosDatos = [...datos];
    // nuevosDatos.splice(index, 1);
    // setDatos(nuevosDatos);
    // localStorage.setItem("rolesAsignados", JSON.stringify(nuevosDatos));
    alert("No disponible aun");
  };

  const iniciarEdicion = (index, rol) => {
    //localStorage.setItem("rolEditar", JSON.stringify(datos[index]));
    navigate("/asignarRoles", { state: { idConvocatoria: index, rol: rol } });
  };

  const irASignarRoles = () => {
    navigate("/asignarRoles");
  };

  const irACancelar = () => {
    navigate("/");
  };

  return (
    <div className="lista-container">
      <h2>Lista de Roles Asignados</h2>

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
            {/* {datos
              .filter(item => item.nombre && item.convocatoria && item.rol)
              .map((item, index) => (
                <tr key={index}>
                  <td>{item.nombre}</td>
                  <td>{item.convocatoria}</td>
                  <td>{item.rol}</td>
                  <td>
                    <button onClick={() => iniciarEdicion(index)}>✏️</button>
                    <button onClick={() => eliminarFila(index)}>❌</button>
                  </td>
                </tr>
              ))} */}
            {
              datos
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
                )
            }

          </tbody>
        </table>
      )}

      <div className="botones-container">
        <button className="btn-agregar" onClick={irASignarRoles}>Agregar +</button>
        <button className="btn-cancelar" onClick={irACancelar}>Cancelar</button>
      </div>
    </div>
  );
};

export default ListaRoles;

