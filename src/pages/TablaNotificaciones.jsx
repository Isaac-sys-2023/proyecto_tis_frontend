import React, { useState, useEffect } from 'react';
import './styles/TablaNotificaciones.css';
import { useNavigate, useParams } from 'react-router-dom';

import SpinnerInsideButton from '../components/SpinnerInsideButton';
import FullScreenSpinner from '../components/FullScreenSpinner';

const apiUrl = import.meta.env.VITE_API_URL;

const TablaNotificaciones = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [usuarios, setUsuarios] = useState([]);
  const [seleccionarTodo, setSeleccionarTodo] = useState(false);
  const [convocatoria, setConvocatoria] = useState({ id: '', nombre: '' });

  const [submitting, setSubmitting] = useState(false);
  const [cargandoConv, setCargandoConv] = useState(true);
  const [cargandoT, setCargandoT] = useState(true);

  useEffect(() => {
    fetch(`${apiUrl}/veridconvocatorias/${id}`)
      .then(response => response.json())
      .then(data => {
        const convocatoriasHabilitadas = data //.filter(conv => (conv.habilitada === 1 && conv.eliminado === 0));
        setConvocatoria(convocatoriasHabilitadas);
      })
      .catch(error => console.error("Error al obtener convocatorias:", error))
      .finally(setCargandoConv(false));
  }, []);

  // Cargar tutores desde el backend
  useEffect(() => {
    fetch(`${apiUrl}/tutores`)
      .then(response => response.json())
      .then(data => {
        const usuariosConSeleccion = data.map(tutor => ({
          ...tutor,
          seleccionado: false
        }));
        setUsuarios(usuariosConSeleccion);
      })
      .catch((error) => console.error('Error al obtener tutores:', error))
      .finally(setCargandoT(false));
  }, []);

  const handleSeleccionarTodo = () => {
    const nuevoEstado = !seleccionarTodo;
    setSeleccionarTodo(nuevoEstado);
    setUsuarios(prevUsuarios =>
      prevUsuarios.map(usuario => ({
        ...usuario,
        seleccionado: nuevoEstado
      }))
    );
  };

  const handleSeleccionarUsuario = (index) => {
    const nuevosUsuarios = [...usuarios];
    nuevosUsuarios[index].seleccionado = !nuevosUsuarios[index].seleccionado;
    setUsuarios(nuevosUsuarios);
  };

  const handleEnviarNotificacion = () => {
    const correosSeleccionados = usuarios
      .filter(usuario => usuario.seleccionado)
      .map(usuario => usuario.correoTutor);

    if (!id) {
      alert('Selecciona una convocatoria primero.');
      return;
    }

    if (correosSeleccionados.length === 0) {
      alert('Selecciona al menos un tutor para enviar la notificación.');
      return;
    }

    const data = {
      message: `Nueva convocatoria: ${convocatoria.nombre}`
    };

    setSubmitting(true);

    fetch(`${apiUrl}/notify-tutors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(response => {
        alert('Notificaciones enviadas exitosamente.');
        console.log('Respuesta del servidor:', response);
      })
      .catch(error => {
        console.error('Error al enviar notificaciones:', error);
        alert('Hubo un error al enviar las notificaciones.');
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <div className="tabla-container-not">
      <h2 className='titulo-not'>Enviar Notificaciones</h2>
      <div className="convocatoria-info">
        <label>Convocatoria:</label>
        {cargandoConv ? (
          <SpinnerInsideButton />
        ) : (
          <h4>{convocatoria.tituloConvocatoria}</h4>
        )}
      </div>

      <table className="tabla-notificaciones">
        <thead>
          <tr>
            <th>
              Selecciona Todo
              <input
                type="checkbox"
                checked={seleccionarTodo}
                onChange={handleSeleccionarTodo}
              />
            </th>
            <th>Correo</th>
          </tr>
        </thead>
        <tbody>
          {cargandoT ? (
            <tr>
              <td colSpan="2" style={{ textAlign: 'center' }}>
                <FullScreenSpinner />
              </td>
            </tr>
          ) : (
            usuarios.map((usuario, index) => (
              <tr key={usuario.idTutor} className={usuario.seleccionado ? 'seleccionado' : ''}>
                <td>
                  <input
                    type="checkbox"
                    checked={usuario.seleccionado}
                    onChange={() => handleSeleccionarUsuario(index)}
                  />
                </td>
                <td>{usuario.correoTutor}</td>
              </tr>
            ))
          )}

        </tbody>
      </table>
      <div className="botones-container">
        <button className="btn-enviar" onClick={handleEnviarNotificacion} disabled={submitting}>
          {submitting ? (<>Enviando <span><SpinnerInsideButton /></span></>) : 'Enviar Notificación'}
        </button>
        <button className="btn-salir" onClick={() => navigate("/detalle-convocatoria")} disabled={submitting}>
          Salir
        </button>
      </div>
    </div>
  );
};

export default TablaNotificaciones;

