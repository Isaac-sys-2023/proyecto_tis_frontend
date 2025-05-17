import React, { useState } from 'react';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

const RegistrarColegio = () => {
  const [formulario, setFormulario] = useState({
    nombreColegio: '',
    departamento: '',
    provincia: '',
    RUE: '',
    direccion: '',
    fecha_creacion: '',
  });

  const [mensaje, setMensaje] = useState('');

  const handleChange = (e) => {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const respuesta = await fetch(`${apiUrl}/colegios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formulario),
      });

      const data = await respuesta.json();

      if (respuesta.ok) {
        setMensaje('✅ Colegio registrado correctamente.');
        setFormulario({
          nombreColegio: '',
          departamento: '',
          provincia: '',
          RUE: '',
          direccion: '',
          fecha_creacion: '',
        });
      } else {
        setMensaje('❌ Error al registrar: ' + (data.message || 'Datos inválidos.'));
      }
    } catch (error) {
      console.error(error);
      setMensaje('❌ Error en la conexión con el servidor.');
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: 'auto', padding: '1rem' }}>
      <h2>Registrar Colegio</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="nombreColegio"
          placeholder="Nombre del Colegio"
          value={formulario.nombreColegio}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="departamento"
          placeholder="Departamento"
          value={formulario.departamento}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="provincia"
          placeholder="Provincia"
          value={formulario.provincia}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="RUE"
          placeholder="RUE"
          value={formulario.RUE}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="direccion"
          placeholder="Dirección"
          value={formulario.direccion}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="fecha_creacion"
          value={formulario.fecha_creacion}
          onChange={handleChange}
          required
        />

        <button type="submit" style={{ marginTop: '10px' }}>Guardar Colegio</button>
      </form>

      {mensaje && <p style={{ marginTop: '1rem' }}>{mensaje}</p>}
    </div>
  );
};

export default RegistrarColegio;
