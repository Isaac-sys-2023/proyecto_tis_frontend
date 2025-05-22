import React, { useEffect, useState, useRef } from 'react';
import jsPDF from 'jspdf';
import './styles/Reporte.css';

const apiUrl = import.meta.env.VITE_API_URL;

const ReportePostulantes = () => {
  const [cursos, setCursos] = useState([]);
  const [cursoSeleccionado, setCursoSeleccionado] = useState('');
  const [postulaciones, setPostulaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const tablaRef = useRef();

  useEffect(() => {
    fetch(`${apiUrl}/vercursos`)
      .then(res => res.json())
      .then(data => setCursos(data))
      .catch(err => setError('Error al cargar los cursos'))
      .finally(() => setCargando(false));
  }, []);

  useEffect(() => {
    if (cursoSeleccionado) {
      setCargando(true);
      fetch(`${apiUrl}/reporte-postulantes/${cursoSeleccionado}`)
        .then(res => res.json())
        .then(data => setPostulaciones(data))
        .catch(err => setError('Error al cargar las postulaciones'))
        .finally(() => setCargando(false));
    }
  }, [cursoSeleccionado]);

  const imprimirPDF = () => {
    const doc = new jsPDF();
    let y = 20;

    doc.setFontSize(14);
    doc.text('Reporte de Postulantes', 14, y);
    y += 10;

    doc.setFontSize(10);
    doc.text('Curso: ' + cursos.find(c => c.idCurso == cursoSeleccionado)?.Curso, 14, y);
    y += 10;

    doc.setFontSize(10);
    doc.text('N° | Postulante         | Tutor              | Áreas                        | Monto', 14, y);
    y += 5;
    doc.line(14, y, 200, y);
    y += 5;

    postulaciones.forEach((p, index) => {
      const postulante = `${p.postulante?.nombrePost} ${p.postulante?.apellidoPost}`;
      const tutor = `${p.postulante?.tutor?.nombreTutor} ${p.postulante?.tutor?.apellidoTutor}`;
      const areas = p.categoria.map(c => c.area?.nombreArea).join(', ');
      const monto = 'Bs. ' + p.categoria.reduce((acc, c) => acc + parseFloat(c.monto), 0).toFixed(2);

      const texto = `${index + 1} | ${postulante} | ${tutor} | ${areas} | ${monto}`;
      doc.text(texto, 14, y);
      y += 7;
    });

    doc.save('reporte_postulantes.pdf');
  };

  return (
    <div className="reporte-container">
      <h2>Reporte de Postulantes</h2>
      <label>Selecciona un curso:</label>
      <select value={cursoSeleccionado} onChange={(e) => setCursoSeleccionado(e.target.value)}>
        <option value="">-- Selecciona --</option>
        {cursos.map(c => (
          <option key={c.idCurso} value={c.idCurso}>{c.Curso}</option>
        ))}
      </select>

      {cargando ? (
        <p>Cargando datos...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <>
          <table ref={tablaRef} className="reporte-tabla">
            <thead>
              <tr>
                <th>#</th>
                <th>Postulante</th>
                <th>Tutor</th>
                <th>Áreas</th>
                <th>Monto Total</th>
              </tr>
            </thead>
            <tbody>
              {postulaciones.length > 0 ? (
                postulaciones.map((p, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{p.postulante?.nombrePost} {p.postulante?.apellidoPost}</td>
                    <td>{p.postulante?.tutor?.nombreTutor} {p.postulante?.tutor?.apellidoTutor}</td>
                    <td>{p.categoria.map(c => c.area?.nombreArea).join(', ')}</td>
                    <td>Bs. {p.categoria.reduce((acc, c) => acc + parseFloat(c.monto), 0).toFixed(2)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No hay datos para mostrar.</td>
                </tr>
              )}
            </tbody>
          </table>
          <button onClick={imprimirPDF}>Imprimir PDF</button>
        </>
      )}
    </div>
  );
};

export default ReportePostulantes;
