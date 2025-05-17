import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './styles/RolesTable.css';

const apiUrl = import.meta.env.VITE_API_URL;

const RolesTable = () => {
  const [roles, setRoles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // const datosGuardados = JSON.parse(localStorage.getItem("rolesAsignados")) || [];

    // // Verifica el contenido de los datos guardados
    // console.log("Datos guardados en localStorage:", datosGuardados);  // Esto es solo para depurar

    // // Asegúrate de que todos los roles tienen valores válidos
    // const datosValidados = datosGuardados.map((rol) => {
    //   return {
    //     nombreRol: rol.nombreRol && rol.nombreRol.trim() !== "" ? rol.nombreRol : 'Sin nombre',
    //     funciones: Array.isArray(rol.funciones) && rol.funciones.length > 0 ? rol.funciones : ['Sin funciones'],
    //   };
    // });

    // setRoles(datosValidados);
    const fetchRoles = async () => {
      try {
        const res = await fetch(`${apiUrl}/roles`);
        if (!res.ok) throw new Error("Error al obtener roles");
        const data = await res.json();
        setRoles(data);
      } catch (error) {
        console.error("Error cargando permisos:", error);
      }
    };

    fetchRoles();
  }, []);

  const handleEdit = (index) => {
    // const rolParaEditar = roles[index];

    // // Guardar el rol a editar en localStorage (temporal)
    // localStorage.setItem("rolEditar", JSON.stringify({ ...rolParaEditar, index }));
    // navigate("/addRoles");
    navigate(`/editRoles/${index}`)
  };

  const handleDelete = async (index) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este rol?")) return;
  };




  return (
    <div className="table-container">
      <h2>Roles Registrados</h2>
      <table>
        <thead>
          <tr>
            <th>Nombre Rol</th>
            <th>Funciones</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {roles.length > 0 ? (
            // roles.map((rol, index) => (
            //   <tr key={index}>
            //     <td>{rol.nombreRol}</td>
            //     <td>{rol.funciones.join(', ')}</td>
            //     <td>
            //       <button onClick={() => handleEdit(index)}>✏️</button>
            //       <button onClick={() => handleDelete(index)}>❌</button>
            //     </td>
            //   </tr>
            // ))
            roles.map((rol) => (
              <tr key={rol.id}>
                <td>{rol.name}</td>
                {/* <td>{rol.funciones.join(', ')}</td> */}
                <td>
                  {rol.permissions && rol.permissions.length > 0
                    ? rol.permissions.map((permiso) => permiso.name).join(', ')
                    : 'Sin funciones'}
                </td>
                <td>
                  <button onClick={() => handleEdit(rol.id)}>✏️</button>
                  <button onClick={() => handleDelete(rol.id)}>❌</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No hay roles registrados.</td>
            </tr>
          )}
        </tbody>
      </table>

      <Link to="/addRoles"><button className="btn">Nuevo rol</button></Link>
      <Link to="/"><button className="btn">Cancelar</button></Link>
    </div>
  );
};

export default RolesTable;
