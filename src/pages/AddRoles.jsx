import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const AddRoles = () => {
  const [nombreRol, setNombreRol] = useState('');
  const [funciones, setFunciones] = useState([]);
  const [indexEditar, setIndexEditar] = useState(null);
  const navigate = useNavigate();

  const opcionesFunciones = [
    "Gestion de Convocatoria",
    "Gestion de Colegios",
    "Login, Registrar",
    "Orden Pago (OCR)",
    "Orden Pago (Vereficar)"
  ];

  const [permisosDisponibles, setPermisosDisponibles] = useState([]);

  const { id } = useParams();
  const [modoEdicion, setModoEdicion] = useState(!!id);


  useEffect(() => {
    // const rolEditar = JSON.parse(localStorage.getItem("rolEditar"));
    // if (rolEditar) {
    //   setNombreRol(rolEditar.nombreRol);
    //   setFunciones(rolEditar.funciones);
    //   setModoEdicion(true);
    //   setIndexEditar(rolEditar.index);
    // }



    const fetchPermisos = async () => {
      try {
        if (id) {
          const res = await fetch(`http://localhost:8000/api/roles/${id}`);
          const data = await res.json();
          setNombreRol(data.name);
          setFunciones(data.permissions.map(p => p.name));
        }


        const res = await fetch("http://localhost:8000/api/permissions");
        if (!res.ok) throw new Error("Error al obtener permisos");
        const data = await res.json();
        setPermisosDisponibles(data);
      } catch (error) {
        console.error("Error cargando permisos:", error);
      }
    };

    fetchPermisos();
  }, []);

  const handleCheckboxChange = (funcion) => {
    setFunciones(prev =>
      prev.includes(funcion)
        ? prev.filter(f => f !== funcion)
        : [...prev, funcion]
    );
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   const rolesExistentes = JSON.parse(localStorage.getItem("rolesAsignados")) || [];
  //   const nuevoRol = { nombreRol, funciones };

  //   let actualizados;

  //   if (modoEdicion && indexEditar !== null) {
  //     rolesExistentes[indexEditar] = nuevoRol;
  //     actualizados = [...rolesExistentes];
  //     localStorage.removeItem("rolEditar");
  //   } else {
  //     actualizados = [...rolesExistentes, nuevoRol];
  //   }

  //   localStorage.setItem("rolesAsignados", JSON.stringify(actualizados));
  //   navigate("/tablaRoles");
  // };

  const crearRol = async (nombreRol) => {
    const res = await fetch('http://localhost:8000/api/roles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: nombreRol }),
    });
    const data = await res.json();
    return data; // contiene el rol creado
  };

  const asignarPermisoARol = async (roleId, permiso) => {
    await fetch(`http://localhost:8000/api/roles/${roleId}/give-permission`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ permission: permiso }),
    });
  };

  const actualizarRol = async (id, nombreRol, funciones) => {
    try {
      // 1. Actualizar el nombre del rol
      const updateRoleResponse = await fetch(`http://localhost:8000/api/roles/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: nombreRol }),
      });

      if (!updateRoleResponse.ok) {
        throw new Error('Error al actualizar el nombre del rol');
      }

      // 2. Sincronizar los permisos
      const syncResponse = await fetch(`http://localhost:8000/api/roles/${id}/sync-permissions`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ permissions: funciones }),
      });

      if (!syncResponse.ok) {
        throw new Error('Error al actualizar los permisos');
      }

      alert('Rol actualizado exitosamente');
    } catch (error) {
      console.error('Error al actualizar el rol:', error);
      alert('Hubo un error al actualizar el rol. Revisa la consola.');
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // // 1. Crear el rol
    // const nuevoRol = await crearRol(nombreRol);

    // // 2. Asignar cada permiso (funcion) al nuevo rol
    // for (let funcion of funciones) {
    //   await asignarPermisoARol(nuevoRol.id, funcion);
    // }

    if (id) {
      await actualizarRol(id, nombreRol, funciones);
    } else {
      const nuevoRol = await crearRol(nombreRol);
      for (let funcion of funciones) {
        await asignarPermisoARol(nuevoRol.id, funcion);
      }
    }

    // 3. Redirigir
    navigate("/tablaRoles");
  };



  const handleCancel = () => {
    //localStorage.removeItem("rolEditar");
    navigate("/tablaRoles");
  };

  return (
    <div className="form-container">
      <h2 className="form-title">{modoEdicion ? "Editar Rol" : "Añadir Rol"}</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="nombreRol">Nombre Rol:</label>
        <input
          type="text"
          id="nombreRol"
          value={nombreRol}
          onChange={(e) => setNombreRol(e.target.value)}
        />

        <label>Funciones:</label>
        <div className="funciones">
          {/* {opcionesFunciones.map((funcion, index) => ( */}
          {permisosDisponibles.map((funcion) => (
            // <div key={index}>
            <div key={funcion.id}>
              <input
                type="checkbox"
                // id={`funcion-${index}`}
                id={`funcion-${funcion.id}`}
                // checked={funciones.includes(funcion)}
                // onChange={() => handleCheckboxChange(funcion)}
                checked={funciones.includes(funcion.name)}
                onChange={() => handleCheckboxChange(funcion.name)}
              />
              {/* <label htmlFor={`funcion-${index}`}>{funcion}</label> */}
              <label htmlFor={`funcion-${funcion.id}`}>{funcion.name}</label>
            </div>
          ))}
        </div>

        <button type="submit">{modoEdicion ? "Guardar Cambios" : "Registrar"}</button>
        <button type="button" onClick={handleCancel}>Cancelar</button>
      </form>
    </div>
  );
};

export default AddRoles;



