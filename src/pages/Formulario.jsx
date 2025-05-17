import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Formulario() {
  const [colegios, setColegios] = useState([]);  // Para almacenar los colegios
  const [colegioSeleccionado, setColegioSeleccionado] = useState('');  // Para almacenar el colegio seleccionado
  const [departamento, setDepartamento] = useState('');  // Para almacenar el departamento
  const [provincia, setProvincia] = useState('');  // Para almacenar la provincia

  // Al montar el componente, obtenemos los colegios desde la API
  useEffect(() => {
    axios.get('http://localhost:8000/api/colegio')  // Verifica que esta URL sea correcta
      .then(response => {
        setColegios(response.data);  // Guardamos los colegios en el estado
      })
      .catch(error => {
        console.error('Error fetching colegio:', error);
      });
  }, []);  // Solo se ejecuta al montar el componente

  // Maneja el cambio de colegio
  const handleColegioChange = (e) => {
    const idColegio = e.target.value;  // Obtenemos el id del colegio seleccionado
    setColegioSeleccionado(idColegio);

    // Si el id del colegio es válido, obtenemos los detalles
    if (idColegio) {
      const colegioSeleccionado = colegios.find(colegio => colegio.idColegio === parseInt(idColegio));
      if (colegioSeleccionado) {
        setDepartamento(colegioSeleccionado.departamento);  // Actualizamos el departamento
        setProvincia(colegioSeleccionado.provincia);  // Actualizamos la provincia
      }
    } else {
      setDepartamento('');
      setProvincia('');
    }
  };

  return (
    <div>
      <h1>Formulario de Inscripción</h1>

      <label htmlFor="colegio">Seleccione un colegio:</label>
      <select id="colegio" onChange={handleColegioChange} value={colegioSeleccionado}>
        <option value="">Seleccione un colegio</option>
        {colegios.map(colegio => (
          <option key={colegio.idColegio} value={colegio.idColegio}>
            {colegio.nombreColegio}
          </option>
        ))}
      </select>

      {/* Campos para Departamento y Provincia */}
      {colegioSeleccionado && (
        <div>
          <label htmlFor="departamento">Departamento:</label>
          <select id="departamento" value={departamento} disabled>
            <option value={departamento}>{departamento}</option>
          </select>

          <label htmlFor="provincia">Provincia:</label>
          <select id="provincia" value={provincia} disabled>
            <option value={provincia}>{provincia}</option>
          </select>
        </div>
      )}
    </div>
  );
}

export default Formulario;
