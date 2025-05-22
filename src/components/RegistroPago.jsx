import React, { useState, useEffect } from 'react';
import './styles/RegistroPago.css';
import { useNavigate } from 'react-router-dom';

import ModalImagen from './ModalImage';

const apiUrl = import.meta.env.VITE_API_URL;


const normalizeText = (text) => {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
};

const ahora = new Date();

const RegistroPago = () => {
  const navigate = useNavigate();

  const [imagenSeleccionada, setImagenSeleccionada] = useState(null);

  const [tutores, setTutores] = useState([]);

  useEffect(() => {
    const obtenerRecibosAsociados = async (ordenes) => {
      const ordenesConRecibos = await Promise.all(
        ordenes.map(async (orden) => {
          try {
            const response = await fetch(`${apiUrl}/recibos/orden/${orden.idOrdenPago}`);
            const data = await response.json();

            return {
              ...orden,
              recibos: data
            };
          } catch (error) {
            console.error(`Error obteniendo recibos para orden ${orden.idOrdenPago}:`, error);
            return orden; // Devolver orden sin modificar si falla
          }
        })
      );
      return ordenesConRecibos;
    };

    const obtenerOrdenesPago = async () => {
      try {
        const response = await fetch(`${apiUrl}/buscar-ordenes`);
        const data = await response.json();

        if (data) {
          const tutoresConRecibos = await Promise.all(
            data.map(async (tutor) => {
              const ordenesValidas = (tutor.ordenes_pago || []).filter(orden => orden.cancelado === 1);
              const nuevasOrdenes = await obtenerRecibosAsociados(ordenesValidas);
              return {
                ...tutor,
                ordenes_pago: nuevasOrdenes
              };
            })
          );

          setTutores(tutoresConRecibos);
          console.log(tutoresConRecibos);
        } else {
          console.warn("No se encontraron órdenes");
        }
      } catch (error) {
        console.error("Error al obtener órdenes de pago:", error);
      }
    };

    obtenerOrdenesPago();
  }, []);


  const [searchText, setSearchText] = useState('');
  const [tutorEncontrado, setTutorEncontrado] = useState(null);
  const [tutoresEncontrados, setTutoresEncontrados] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [verificaciones, setVerificaciones] = useState({});

  const buscarTutor = () => {
    if (searchText.trim() === '') {
      return;
    }
    const textoBuscado = normalizeText(searchText);
    const resultados = tutores.filter(tutor => {
      const nombre = normalizeText(tutor.nombreTutor || "");
      const apellido = normalizeText(tutor.apellidoTutor || "");
      const nombreCompleto = normalizeText(`${tutor.nombreTutor || ""} ${tutor.apellidoTutor || ""}`);
      const idTutorStr = String(tutor.idTutor || "");

      return (
        nombre.includes(textoBuscado) ||
        apellido.includes(textoBuscado) ||
        nombreCompleto.includes(textoBuscado) ||
        idTutorStr.includes(textoBuscado)
      );
    });


    if (resultados.length > 0) {
      setTutoresEncontrados(resultados);
      setMensaje('');
      setVerificaciones({});
    } else {
      setTutoresEncontrados([]);
      setMensaje('Tutor(es) no encontrado(s).');
    }
  };

  const handleVerificacionChange = (ordenId, isChecked) => {
    setVerificaciones(prevState => ({
      ...prevState,
      [ordenId]: isChecked
    }));
    console.log(verificaciones);
  };

  const handleSeleccionarTodos = (isChecked) => {
    if (tutorEncontrado) {
      const nuevasVerificaciones = {};
      tutorEncontrado.ordenes_pago.forEach(orden => {
        nuevasVerificaciones[orden.idOrdenPago] = isChecked;
      });
      setVerificaciones(nuevasVerificaciones);
    }
  };

  const handleSeleccionarTodosPorTutor = (tutor, checked, ahora = new Date()) => {
    const nuevasVerificaciones = { ...verificaciones };

    tutor.ordenes_pago.forEach((orden) => {
      const vigencia = new Date(orden.vigencia);
      if (!orden.recibido && vigencia >= ahora) {
        nuevasVerificaciones[orden.idOrdenPago] = checked;
      }
    });

    setVerificaciones(nuevasVerificaciones);
    console.log(nuevasVerificaciones);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const ordenesVerificadas = tutores
      .flatMap(tutor => tutor.ordenes_pago) // aplanamos todas las órdenes de todos los tutores
      .filter(orden => verificaciones[orden.idOrdenPago] && !orden.recibido); // nos quedamos con las que están marcadas como true

    try {
      const respuestas = await Promise.all(
        ordenesVerificadas.map(async (orden) => {
          const { idOrdenPago, recibos, ...datos } = orden;
          datos.recibido = true;

          const respuesta = await fetch(`${apiUrl}/ordenpago/${idOrdenPago}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(datos),
          });

          const resultado = await respuesta.json();

          if (!respuesta.ok) {
            throw new Error(resultado.message || 'Error al actualizar la orden');
          }

          return resultado.orden;
        })
      );

      console.log('Todas las órdenes actualizadas:', respuestas);

      const obtenerRecibosAsociados = async (ordenes) => {
        const ordenesConRecibos = await Promise.all(
          ordenes.map(async (orden) => {
            try {
              const response = await fetch(`${apiUrl}/recibos/orden/${orden.idOrdenPago}`);
              const data = await response.json();

              return {
                ...orden,
                recibos: data
              };
            } catch (error) {
              console.error(`Error obteniendo recibos para orden ${orden.idOrdenPago}:`, error);
              return orden; // Devolver orden sin modificar si falla
            }
          })
        );

        return ordenesConRecibos;
      };

      const obtenerOrdenesPago = async () => {
        try {
          const response = await fetch(`${apiUrl}/buscar-ordenes`);
          const data = await response.json();

          if (data) {
            const tutoresConRecibos = await Promise.all(
              data.map(async (tutor) => {
                const ordenesValidas = (tutor.ordenes_pago || []).filter(orden => orden.cancelado === 1);
                const nuevasOrdenes = await obtenerRecibosAsociados(ordenesValidas);
                return {
                  ...tutor,
                  ordenes_pago: nuevasOrdenes
                };
              })
            );

            setTutores(tutoresConRecibos);
            console.log(tutoresConRecibos);
            return true;
          } else {
            console.warn("No se encontraron órdenes");
          }
        } catch (error) {
          console.error("Error al obtener órdenes de pago:", error);
        }
      };

      await obtenerOrdenesPago();

      setSearchText('');
      setVerificaciones({});
    } catch (error) {
      console.error('Error:', error.message);
      alert('Hubo un problema al actualizar una o más órdenes de pago');
    }
  }

  return (
    <div className="formulario-pago-container">
      <div className="formulario-card">
        <div className="formulario-header">Formulario de Registro de Pago</div>

        <div className="formulario-search">
          <span className="menu-icon">☰</span>
          <input
            type="text"
            placeholder="Buscar por nombre, apellido o ID del tutor"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && buscarTutor()}
          />
          <span className="search-icon" onClick={buscarTutor}>🔍</span>
        </div>

        {mensaje && (
          <p style={{ textAlign: 'center', color: 'red' }}>{mensaje}</p>
        )}

        {tutoresEncontrados.length === 0 && (searchText.trim() === '' || searchText === '') && (
          <>
            {console.log("Se aplico el trim")}
            {tutores.filter(
              tutor => tutor.ordenes_pago.length > 0 && tutor.ordenes_pago.some(orden => orden.recibido === 0)
            ).map((tutor, i) => {
              const ordenesVigentes = tutor.ordenes_pago.filter(op => {
                const vigencia = new Date(op.vigencia);
                console.log("Se aplico el filter");
                return !op.recibido && vigencia >= ahora;
              });

              return (
                <div key={i} className="tutor-result">
                  <p style={{ textAlign: 'center', fontWeight: 'bold', marginTop: '15px' }}>
                    {tutor.nombreTutor} {tutor.apellidoTutor} (ID: {tutor.idTutor}) tiene {ordenesVigentes.length} orden(es) de pago vigentes.
                  </p>

                  {ordenesVigentes.length > 0 && (
                    <>
                      {/* Checkbox de seleccionar todo */}
                      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0 5px', marginBottom: '5px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span>Seleccionar todo</span>
                          <input
                            type="checkbox"
                            onChange={(e) => handleSeleccionarTodosPorTutor(tutor, e.target.checked, ahora)}
                          />
                        </label>
                      </div>

                      <table className="tabla-pago">
                        <thead>
                          <tr>
                            <th>Orden</th>
                            <th>Id Ingresado</th>
                            <th>Identificación OCR</th>
                            <th>Verificar</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ordenesVigentes.map((orden, index) => (
                            <tr key={index}>
                              <td>{orden.idOrdenPago}</td>
                              <td>
                                <input type="text" value={orden.recibos[0].id} disabled className="input-disabled" />
                              </td>
                              <td>
                                {/* <button>Imagen</button> */}


                                <button onClick={() => setImagenSeleccionada(orden.recibos[0].imagen_comprobante)}>
                                  Imagen
                                </button>

                                {/* <img src={orden.recibos[0].imagen_comprobante} alt="Imagen" /> */}
                              </td>
                              <td style={{ textAlign: 'center' }}>
                                <input
                                  type="checkbox"
                                  checked={verificaciones[orden.idOrdenPago] || false}
                                  onChange={(e) =>
                                    handleVerificacionChange(orden.idOrdenPago, e.target.checked)
                                  }
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </>
                  )}
                </div>
              );
            })}
          </>
        )}

        {tutoresEncontrados.length > 0 && (
          <>
            {tutoresEncontrados.map((tutor, i) => {
              const ordenesVigentes = tutor.ordenes_pago.filter(op => {
                const vigencia = new Date(op.vigencia);
                return !op.recibido && vigencia >= ahora;
              });

              return (
                <div key={i} className="tutor-result">
                  <p style={{ textAlign: 'center', fontWeight: 'bold', marginTop: '15px' }}>
                    {tutor.nombreTutor} {tutor.apellidoTutor} (ID: {tutor.idTutor}) tiene {ordenesVigentes.length} orden(es) de pago vigentes.
                  </p>

                  {ordenesVigentes.length > 0 && (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0 5px', marginBottom: '5px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span>Seleccionar todo</span>
                          <input
                            type="checkbox"
                            onChange={(e) => handleSeleccionarTodosPorTutor(tutor, e.target.checked, ahora)}
                          />
                        </label>
                      </div>
                      <table className="tabla-pago">
                        <thead>
                          <tr>
                            <th>Orden</th>
                            <th>Id Ingresado</th>
                            <th>Identificación OCR</th>
                            <th>Verificar</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ordenesVigentes.map((orden, index) => (
                            <tr key={index}>
                              <td>{orden.idOrdenPago}</td>
                              <td>
                                <input type="text" value={orden.recibos[0].id} disabled className="input-disabled" />
                              </td>
                              <td>
                                <button>Imagen</button>
                              </td>
                              <td style={{ textAlign: 'center' }}>
                                <input
                                  type="checkbox"
                                  checked={verificaciones[orden.idOrdenPago] || false}
                                  onChange={(e) =>
                                    handleVerificacionChange(orden.idOrdenPago, e.target.checked)
                                  }
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </>
                  )}
                </div>
              );
            })}
          </>
        )}

        <div className="formulario-botones">
          <button className="guardar-btn" onClick={(e) => handleSubmit(e)}>Guardar</button>
          <button
            className="cancelar-btn"
            onClick={() => {
              setSearchText('');
              setTutoresEncontrados([]);
              setMensaje('');
              setVerificaciones({});
            }}
          >
            Cancelar
          </button>
          <button className="cancelar-btn" onClick={(e) => navigate("/")}>Salir</button>
        </div>

        {imagenSeleccionada && (
          <ModalImagen
            imagenUrl={imagenSeleccionada}
            onClose={() => setImagenSeleccionada(null)}
          />
        )}

      </div>
    </div>
  );
};

export default RegistroPago;