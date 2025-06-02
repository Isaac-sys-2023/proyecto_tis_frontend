import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./styles/AsignarRoles.css";
import SpinnerInsideButton from "../components/SpinnerInsideButton";
import FullScreenSpinner from "../components/FullScreenSpinner";

const apiUrl = import.meta.env.VITE_API_URL;

// Función para normalizar nombres (quitar acentos, espacios, mayúsculas)
const normalize = (str) =>
  str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s+/g, "");

const AsignarRoles = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [personas, setPersonas] = useState([]);
  const [roles, setRoles] = useState([]);
  const [convocatorias, setConvocatorias] = useState([]);
  const [nombreNoEncontrado, setNombreNoEncontrado] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [formulario, setFormulario] = useState({
    user_id: location.state?.rol?.user_id || "",
    nombre: location.state?.rol?.name || "",
    // role: location.state?.rol?.role || "",
    role_name: location.state?.rol?.role || "",
    // idConvocatoria: location.state?.idConvocatoria || ""
    convocatoria_id: location.state?.idConvocatoria || ""
  });

  const [cargando, setCargando] = useState(true);
  const [subiendo, setSubiendo] = useState(false);

  useEffect(() => {
    try {
      fetch(`${apiUrl}/todosusers`)
        .then((res) => res.json())
        .then((data) => setPersonas(data))
        .catch(error => console.error("Error al obtener usuarios:", error));

      fetch(`${apiUrl}/roles`)
        .then((res) => res.json())
        .then((data) => setRoles(data))
        .catch(error => console.error("Error al obtener roles:", error));

      fetch(`${apiUrl}/todasconvocatorias`)
        .then(response => response.json())
        .then(data => {
          // const convocatoriasHabilitadas = data.filter(conv => (conv.habilitada === 1 && conv.eliminado === 0));
          const convocatoriasHabilitadas = data.filter(conv => ((conv.habilitada === 1 || conv.habilitada === true) && (conv.eliminado === 0 || conv.eliminado === false)));
          setConvocatorias(convocatoriasHabilitadas);
        })
        .catch(error => console.error("Error al obtener convocatorias:", error));
    } catch (error) {
      console.error("Error: ", error);
    } finally {
      setCargando(false);
    }

  }, []);

  const handleNombre = (e) => {
    const input = e.target.value;
    setSearchTerm(input);

    const personaEncontrada = personas.find((p) =>
      normalize(p.name).includes(normalize(input))
    );

    if (personaEncontrada) {
      setFormulario((prev) => ({
        ...prev,
        user_id: personaEncontrada.id,
        nombre: personaEncontrada.name
      }));
      setNombreNoEncontrado(false);
    } else {
      setFormulario((prev) => ({ ...prev, user_id: "", nombre: "" }));
      setNombreNoEncontrado(true);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormulario((prev) => ({ ...prev, [name]: value }));
  };

  const guardarDatos = async () => {
    setSubiendo(true);

    if (!formulario.user_id || !formulario.role_name || !formulario.convocatoria_id) {
      alert("Completa todos los campos antes de guardar.");
      setSubiendo(false);
      return;
    }

    //const { nombre, ...formularioSend } = formulario;
    const formData = new FormData();
    formData.append('user_id', formulario.user_id);
    formData.append('convocatoria_id', formulario.convocatoria_id);
    formData.append('role_name', formulario.role_name);

    try {
      const res = await fetch(`${apiUrl}/convocatoria/role`, {
        method: "POST",
        //headers: { "Content-Type": "application/json" },
        //body: JSON.stringify(formularioSend)
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 422 && data.errors) {
          // Mostrar errores de validación
          const mensajes = Object.values(data.errors).flat().join("\n");
          alert("Errores de validación:\n" + mensajes);
        } else {
          alert("Error del servidor:\n" + (data.message || "Desconocido"));
        }
        return;
      }

      alert(data.message || "Rol asignado correctamente.");
      navigate("/listaRoles");

    } catch (error) {
      console.error("Error al asignar rol:", error);
      alert("Ocurrió un error inesperado.");
    } finally {
      setSubiendo(false);
    }
  };


  return (
    <div className="roles-container">
      <div className="roles-title">Asignar Roles</div>

      <div className="roles-search">
        <label>Buscar por nombre:</label>
        <input type="text" value={searchTerm} onChange={handleNombre} placeholder="🔍 Buscar persona por nombre" disabled={cargando || subiendo} />
      </div>

      {cargando ? (
        <FullScreenSpinner />
      ) : (
        <>
          {/* Vista escritorio */}
          <div className="desktop-view">
            <table className="roles-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Convocatoria</th>
                  <th>Rol</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <select name="user_id" value={formulario.user_id} onChange={handleChange}>
                      <option value="">Seleccione</option>
                      {personas.map((p) => (
                        <option key={p.id} value={p.id}>{p.name} {p.apellido}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <select name="convocatoria_id" value={formulario.convocatoria_id} onChange={handleChange}>
                      <option value="">Seleccione</option>
                      {convocatorias.map((c) => (
                        <option key={c.idConvocatoria} value={c.idConvocatoria}>
                          {c.tituloConvocatoria}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <select name="role_name" value={formulario.role_name} onChange={handleChange}>
                      <option value="">Seleccione</option>
                      {roles.map((r) => (
                        <option key={r.id} value={r.name}>{r.name}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Vista móvil */}
          <div className="mobile-view">
            <div className="form-group">
              <label>Nombre:</label>
              <select name="user_id" value={formulario.user_id} onChange={handleChange}>
                <option value="">Seleccione</option>
                {personas.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} {p.apellido}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Convocatoria:</label>
              <select
                name="convocatoria_id"
                value={formulario.convocatoria_id}
                onChange={handleChange}
              >
                <option value="">Seleccione</option>
                {convocatorias.map((c) => (
                  <option key={c.idConvocatoria} value={c.idConvocatoria}>
                    {c.tituloConvocatoria}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Rol:</label>
              <select name="role_name" value={formulario.role_name} onChange={handleChange}>
                <option value="">Seleccione</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.name}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </>
      )}


      <div className="roles-buttons">
        {!nombreNoEncontrado && (
          <button className="btn-guardar" onClick={guardarDatos} disabled={cargando || subiendo}>{subiendo ? <SpinnerInsideButton /> : "💾"}</button>
        )}
        {nombreNoEncontrado && (
          <button className="btn-registrar" onClick={() => { navigate("/addUser") }} disabled={cargando || subiendo}>Registrar Usuario</button>
        )}
      </div>
    </div>
  );
};

export default AsignarRoles;
