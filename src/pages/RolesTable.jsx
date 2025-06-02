import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './styles/RolesTable.css';
import FullScreenSpinner from '../components/FullScreenSpinner';

const apiUrl = import.meta.env.VITE_API_URL;

const RolesTable = () => {
  const [roles, setRoles] = useState([]);
  const navigate = useNavigate();

  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await fetch(`${apiUrl}/roles`);
        if (!res.ok) throw new Error("Error al obtener roles");
        const data = await res.json();
        const dataWithExpanded = data.map(role => ({ ...role, expanded: false }));
        setRoles(dataWithExpanded);
      } catch (error) {
        console.error("Error cargando permisos:", error);
      } finally {
        setCargando(false);
      }
    };

    fetchRoles();
  }, []);

  const toggleCard = (id) => {
    setRoles(prev =>
      prev.map(role =>
        role.id === id ? { ...role, expanded: !role.expanded } : role
      )
    );
  };

  const handleEdit = (id) => {
    navigate(`/editRoles/${id}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este rol?")) return;
    // Aquí podrías añadir la lógica para eliminar el rol si deseas
  };

  return (
    <div className="roles-table-container">
      <div className="table-container">
        <h2>Roles Registrados</h2>
      </div>
      {cargando ? (
        <FullScreenSpinner />
      ) : (
        <>
          {/* Vista de escritorio */}
          <div className="desktop-table">
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
                  roles.map((rol) => (
                    <tr key={rol.id}>
                      <td>{rol.name}</td>
                      <td>
                        {rol.permissions && rol.permissions.length > 0
                          ? rol.permissions.map((p) => p.name).join(', ')
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
          </div>

          {/* Vista móvil */}
          <div className="mobile-cards">
            {roles.map((rol) => (
              <div className="role-card" key={rol.id}>
                <div className="role-summary" onClick={() => toggleCard(rol.id)}>
                  <span className="role-name">{rol.name}</span>
                  <span className="expand-icon">{rol.expanded ? '▲' : '▼'}</span>
                </div>
                {rol.expanded && (
                  <div className="role-details">
                    <p><strong>Funciones:</strong> {rol.permissions && rol.permissions.length > 0 ? rol.permissions.map((p) => p.name).join(', ') : 'Sin funciones'}</p>
                    <div className="card-actions">
                      <button className="edit-btn" onClick={() => handleEdit(rol.id)}>✏️ Editar</button>
                      <button className="delete-btn" onClick={() => handleDelete(rol.id)}>❌ Eliminar</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      <div className="roles-actions">
        <Link to="/addRoles"><button className="btn">Nuevo rol</button></Link>
        <Link to="/"><button className="btn">Cancelar</button></Link>
      </div>
    </div>
  );
};

export default RolesTable;
