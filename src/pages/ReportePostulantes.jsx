import React, { useEffect, useState, useRef } from 'react';
import jsPDF from 'jspdf';
import './styles/Reporte.css';
import PostulantesToogleResponsive from '../components/PostulantesToggleResponsive';

import FullScreenSpinner from '../components/FullScreenSpinner';

const apiUrl = import.meta.env.VITE_API_URL;

const ReportePostulantes = () => {
  const [cursos, setCursos] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [convocatorias, setConvocatorias] = useState([]);
  const [provinciasColegio, setProvinciasColegio] = useState([]);
  const [colegiosDisponibles, setColegiosDisponibles] = useState([]);

  const [cursoSeleccionado, setCursoSeleccionado] = useState('');
  const [convocatoriaSeleccionado, setConvocatoriaSeleccionado] = useState('');
  const [areaSeleccionado, setAreaSeleccionado] = useState('');
  const [categoriaSeleccionado, setCategoriaSeleccionado] = useState('');
  const [departamentoSeleccionado, setDepartamentoSeleccionado] = useState('');
  const [provinciaSeleccionado, setProvinciaSeleccionado] = useState('');
  const [colegioSeleccionado, setColegioSeleccionado] = useState('');

  const [postulaciones, setPostulaciones] = useState([]);
  const [postulacionesFiltradas, setPostulacionesFiltradas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const tablaRef = useRef();

  const [mostrarFiltrosAvanzados, setMostrarFiltrosAvanzados] = useState(false);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const [cargandoCurso, setCargandoCurso] = useState(true);
  const [cargandoConv, setCargandoConv] = useState(true);
  const [cargandoDpto, setCargandoDpto] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const updateIsMobile = () => setIsMobile(mediaQuery.matches);

    updateIsMobile();
    mediaQuery.addEventListener('change', updateIsMobile);

    return () => mediaQuery.removeEventListener('change', updateIsMobile);
  }, []);

  useEffect(() => {
    fetch(`${apiUrl}/vercursos`)
      .then(res => res.json())
      .then(data => setCursos(data))
      .catch(err => setError('Error al cargar los cursos', err))
      .finally(() => setCargandoCurso(false));
  }, []);

  useEffect(() => {
    fetch(`${apiUrl}/convocatorias/activas`)
      .then(res => res.json())
      .then(data => setConvocatorias(data))
      .catch(err => setError('Error al cargar las convocatorias', err))
      .finally(() => setCargandoConv(false));
  }, [])

  useEffect(() => {
    setCargando(true);
    fetch(`${apiUrl}/reporte-postulantes`)
      .then(res => res.json())
      .then(data => {
        setPostulaciones(data);
        setPostulacionesFiltradas(data);
      })
      .catch(err => setError('Error al cargar las postulaciones', err))
      .finally(() => setCargando(false));
  }, []);

  useEffect(() => {
    fetch(`${apiUrl}/verdepartamentos`)
      .then(response => response.json())
      .then(data => setDepartamentos(data))
      .catch(error => console.error("Error al obtener departamentos:", error))
      .finally(() => setCargandoDpto(false));
  }, []);

  useEffect(() => {
    if (departamentoSeleccionado) {
      fetch(`${apiUrl}/verprovincias/departamento/${departamentoSeleccionado}`)
        .then(res => res.json())
        .then(data => setProvinciasColegio(data))
        .catch(error => console.error("Error al obtener provincias:", error));
    }
  }, [departamentoSeleccionado]);

  useEffect(() => {
    if (departamentoSeleccionado && provinciaSeleccionado) {
      fetch(`${apiUrl}/departamentos/${departamentoSeleccionado}/provincias/${provinciaSeleccionado}/colegios`)
        .then(res => res.json())
        .then(data => setColegiosDisponibles(data))
        .catch(error => console.error("Error al obtener colegios:", error));
    }
  }, [departamentoSeleccionado, provinciaSeleccionado]);

  useEffect(() => {
    setAreaSeleccionado('');
    setCategoriaSeleccionado('');
  }, [convocatoriaSeleccionado]);

  useEffect(() => {
    setCategoriaSeleccionado('');
  }, [areaSeleccionado]);

  useEffect(() => {
    setProvinciaSeleccionado('');
    setColegioSeleccionado('');
  }, [departamentoSeleccionado]);

  useEffect(() => {
    setColegioSeleccionado('');
  }, [provinciaSeleccionado]);

  useEffect(() => {
    let filtradas = [...postulaciones];

    if (convocatoriaSeleccionado) {
      filtradas = filtradas.filter(p =>
        p.categoria.some(c => c.convocatoria?.tituloConvocatoria === convocatoriaSeleccionado)
      );
    }

    if (areaSeleccionado) {
      filtradas = filtradas.filter(p =>
        p.categoria.some(c => c.area?.nombreArea === areaSeleccionado)
      );
    }

    if (categoriaSeleccionado) {
      filtradas = filtradas.filter(p =>
        p.categoria.some(c =>
          c.nombreCategoria === categoriaSeleccionado &&
          (!areaSeleccionado || c.area?.nombreArea === areaSeleccionado)
        )
      );
    }


    if (departamentoSeleccionado) {
      filtradas = filtradas.filter(p =>
        p.postulante?.colegio?.departamentoColegio === departamentoSeleccionado
      );
    }

    if (provinciaSeleccionado) {
      filtradas = filtradas.filter(p =>
        p.postulante?.colegio?.provinciaColegio === provinciaSeleccionado
      );
    }

    if (colegioSeleccionado) {
      filtradas = filtradas.filter(p =>
        p.postulante?.colegio?.nombreColegio === colegioSeleccionado
      );
    }

    if (cursoSeleccionado) {
      filtradas = filtradas.filter(p =>
        p.postulante?.curso?.nombreCurso === cursoSeleccionado
      );
    }

    setPostulacionesFiltradas(filtradas);
  }, [
    convocatoriaSeleccionado,
    areaSeleccionado,
    categoriaSeleccionado,
    departamentoSeleccionado,
    provinciaSeleccionado,
    colegioSeleccionado,
    postulaciones,
    cursoSeleccionado
  ]);


  const imprimirPDF = () => {
    const doc = new jsPDF();
    let y = 20;

    doc.setFontSize(14);
    doc.text('Reporte de Postulantes', 14, y);
    y += 10;

    if (convocatoriaSeleccionado) {
      doc.setFontSize(10);
      doc.text('Convocatoria: ' + convocatoriaSeleccionado, 14, y);
      y += 10;
    }

    if (areaSeleccionado) {
      doc.setFontSize(10);
      doc.text('Area: ' + areaSeleccionado, 14, y);
      y += 10;
    }

    if (categoriaSeleccionado) {
      doc.setFontSize(10);
      doc.text('Categoria: ' + categoriaSeleccionado, 14, y);
      y += 10;
    }


    if (departamentoSeleccionado) {
      doc.setFontSize(10);
      doc.text('Departamentos: ' + departamentoSeleccionado, 14, y);
      y += 10;
    }

    if (provinciaSeleccionado) {
      doc.setFontSize(10);
      doc.text('Provincia: ' + provinciaSeleccionado, 14, y);
      y += 10;
    }

    if (colegioSeleccionado) {
      doc.setFontSize(10);
      doc.text('Colegio: ' + colegioSeleccionado, 14, y);
      y += 10;
    }

    if (cursoSeleccionado) {
      doc.setFontSize(10);
      doc.text('Curso: ' + cursoSeleccionado, 14, y);
      y += 10;
    }

    doc.setFontSize(10);
    doc.text('N° | Postulante         | Tutor              | Colegio              | Áreas                        | Monto', 14, y);
    y += 5;
    doc.line(14, y, 200, y);
    y += 5;

    postulacionesFiltradas.forEach((p, index) => {
      const postulante = `${p.postulante?.nombrePost} ${p.postulante?.apellidoPost}`;
      const tutor = `${p.postulante?.tutor?.nombreTutor} ${p.postulante?.tutor?.apellidoTutor}`;
      const colegio = `${p.postulante?.colegio?.nombreColegio}`
      const areas = p.categoria.map(c => c.area?.nombreArea + " - " + c.nombreCategoria).join(', ');
      const monto = 'Bs. ' + p.categoria.reduce((acc, c) => acc + parseFloat(c.monto), 0).toFixed(2);

      const texto = `${index + 1} | ${postulante} | ${tutor} | ${colegio} | ${areas} | ${monto}`;
      doc.text(texto, 14, y);
      y += 7;
    });

    doc.save('reporte_postulantes.pdf');
  };

  return (
    <div className="reporte-container">
      <h2>Reporte de Postulantes</h2>
      <div className="select-container">
        <label>Selecciona un curso:</label>
        <select value={cursoSeleccionado} onChange={(e) => setCursoSeleccionado(e.target.value)} disabled={cargandoCurso}>
          <option value="">-- Selecciona --</option>
          {cursos.map(c => (
            <option key={c.idCurso} value={c.Curso}>{c.Curso}</option>
          ))}
        </select>
      </div>

      <div className="soporte-container">
        <button
          onClick={() => setMostrarFiltrosAvanzados(prev => !prev)}
          className="toggle-filtros-btn button"
        >
          {mostrarFiltrosAvanzados ? 'Ocultar filtros avanzados' : 'Mostrar filtros avanzados'}
        </button>

        {mostrarFiltrosAvanzados && (
          <>
            <div className="select-container">
              <label>Selecciona una convocatoria:</label>
              <select value={convocatoriaSeleccionado} onChange={(e) => setConvocatoriaSeleccionado(e.target.value)} disabled={cargandoConv}>
                <option value="">-- Selecciona --</option>
                {convocatorias.map(c => (
                  <option key={c.idConvocatoria} value={c.tituloConvocatoria}>{c.tituloConvocatoria}</option>
                ))}
              </select>

              <label>Selecciona una area de la convocatoria:</label>
              <select value={areaSeleccionado} onChange={(e) => setAreaSeleccionado(e.target.value)} disabled={convocatoriaSeleccionado == ''}>
                <option value="">-- Selecciona --</option>
                {convocatorias.find(c => c.tituloConvocatoria === convocatoriaSeleccionado)?.areas.map(a => (
                  <option key={a.idArea} value={a.tituloArea}>{a.tituloArea}</option>
                ))}
              </select>

              <label>Selecciona una categoria del area de la convocatoria:</label>
              <select value={categoriaSeleccionado} onChange={(e) => setCategoriaSeleccionado(e.target.value)} disabled={areaSeleccionado == ''}>
                <option value="">-- Selecciona --</option>
                {convocatorias.find(c => c.tituloConvocatoria === convocatoriaSeleccionado)?.areas.find(a => a.tituloArea == areaSeleccionado)?.categorias.map(c => (
                  <option key={c.idCategoria} value={c.nombreCategoria}>{c.nombreCategoria}</option>
                ))}
              </select>
            </div>

            <div className="select-container">
              <label>Selecciona un departamento:</label>
              <select value={departamentoSeleccionado} onChange={(e) => setDepartamentoSeleccionado(e.target.value)} disabled={cargandoDpto}>
                <option value="">-- Selecciona --</option>
                {departamentos.map(d => (
                  <option key={d.idDepartamento} value={d.nombreDepartamento}>{d.nombreDepartamento}</option>
                ))}
              </select>

              <label>Selecciona una provincia del departamento:</label>
              <select value={provinciaSeleccionado} onChange={(e) => setProvinciaSeleccionado(e.target.value)} disabled={departamentoSeleccionado == ''}>
                <option value="">-- Selecciona --</option>
                {provinciasColegio.map(p => (
                  <option key={p.idProvincia} value={p.nombreProvincia}>{p.nombreProvincia}</option>
                ))}
              </select>

              <label>Selecciona un colegio:</label>
              <select value={colegioSeleccionado} onChange={(e) => setColegioSeleccionado(e.target.value)} disabled={provinciaSeleccionado == ''}>
                <option value="">-- Selecciona --</option>
                {Object.entries(colegiosDisponibles).map(([id, nombre]) => (
                  <option key={id} value={nombre}>
                    {nombre}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        {cargando ? (
          <FullScreenSpinner/>
        ) : error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : (
          <>
            {isMobile ? (
              <PostulantesToogleResponsive postulantes={postulacionesFiltradas} />
            ) : (
              <table ref={tablaRef} className="reporte-tabla">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Postulante</th>
                    <th>Tutor</th>
                    <th>Colegio</th>
                    <th>Áreas</th>
                    <th>Monto Total</th>
                  </tr>
                </thead>
                <tbody>
                  {postulacionesFiltradas.length > 0 ? (
                    postulacionesFiltradas.map((p, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{p.postulante?.nombrePost} {p.postulante?.apellidoPost}</td>
                        <td>{p.postulante?.tutor?.nombreTutor} {p.postulante?.tutor?.apellidoTutor}</td>
                        <td>
                          {p.postulante?.colegio?.nombreColegio}
                        </td>
                        <td>{p.categoria.map(c => c.area?.nombreArea + " - " + c.nombreCategoria).join(', ')}</td>
                        <td>Bs. {p.categoria.reduce((acc, c) => acc + parseFloat(c.monto), 0).toFixed(2)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6">No hay datos para mostrar...</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
            <button onClick={imprimirPDF} className='btn-pdf button'>Imprimir PDF</button>
          </>
        )}
      </div>

    </div>
  );
};

export default ReportePostulantes;