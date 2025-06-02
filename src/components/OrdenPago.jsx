import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf"; // Importa jsPDF
import "./styles/OrdenPago.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import FullScreenSpinner from "./FullScreenSpinner";
import SpinnerInsideButton from "./SpinnerInsideButton";

const apiUrl = import.meta.env.VITE_API_URL;

const OrdenPago = () => {
  const [mostrarDescargar, setMostrarDescargar] = useState(false);
  const [mostrarBotones, setMostrarBotones] = useState(true);
  const [salirActivo, setSalirActivo] = useState(false);

  const navigate = useNavigate();
  const { idConvocatoria } = useParams();
  const [convocatoria, setConvocatoria] = useState(null);
  const tutor = JSON.parse(localStorage.getItem("tutor"));

  const location = useLocation();
  const estudiantes = location.state?.estudiantes;
  const from = location.state?.from || "default";
  console.log(estudiantes);

  const [expandedIds, setExpandedIds] = useState([]);

  const [cargando, setCargando] = useState(true);
  const [subiendo, setSubiendo] = useState(false);

  const toggleExpand = (id) => {
    setExpandedIds((prevExpandedIds) =>
      prevExpandedIds.includes(id)
        ? prevExpandedIds.filter((item) => item !== id)
        : [...prevExpandedIds, id]
    );
  };

  useEffect(() => {
    const obtenerConvocatoria = async () => {
      try {
        const respuesta = await fetch(
          `${apiUrl}/veridconvocatorias/${idConvocatoria}`
        );
        if (!respuesta.ok) {
          throw new Error("Error al obtener la convocatoria");
        }
        const datos = await respuesta.json();
        setConvocatoria(datos);
      } catch (error) {
        console.error("Error:", error.message);
      } finally {
        setCargando(false);
      }
    };

    obtenerConvocatoria();
  }, [idConvocatoria]);

  const montoTotal = estudiantes
    .reduce((total, est) => {
      const sumaCategorias = est.categorias?.reduce(
        (sum, cat) => sum + (parseFloat(cat.monto) || 0),
        0
      );
      return total + sumaCategorias;
    }, 0)
    .toFixed(2)
    .replace(".", ",");

  const handleAceptar = async() => {
    await handleSubmit();
    setMostrarDescargar(true);
    setMostrarBotones(false);
  };

  const handleDescargarPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0);
    doc.text("Orden de Pago", 105, 20, null, null, "center");

    doc.setFontSize(12);
    doc.text("Fecha: " + new Date().toLocaleDateString(), 20, 35);
    doc.text("Convocatoria: " + convocatoria?.tituloConvocatoria, 20, 45);

    if (tutor) {
      doc.text(
        "Tutor: " +
        tutor.nombreTutor +
        " " +
        tutor.apellidoTutor +
        "  ID Tutor: " +
        tutor.idTutor,
        20,
        55
      );
      doc.text("Email: " + tutor.correoTutor, 20, 63);
      doc.text("Teléfono: " + tutor.telefonoTutor, 20, 71);
    }

    doc.setDrawColor(0, 0, 0);
    doc.line(10, 80, 200, 80);

    doc.text("Estudiante", 20, 90);
    doc.text("Monto", 100, 90);
    doc.text("Area", 150, 90);
    doc.line(10, 95, 200, 95);

    let yPosition = 100;
    estudiantes.forEach((est) => {
      doc.text(est.nombrePost + " " + est.apellidoPost, 20, yPosition);
      doc.text(
        est.categorias
          .reduce((acc, cat) => acc + parseFloat(cat.monto), 0)
          .toFixed(2)
          .toString(),
        100,
        yPosition
      );
      doc.text(
        est.areas.map((area) => area.tituloArea).join(" - "),
        150,
        yPosition
      );
      yPosition += 10;
    });

    doc.setFontSize(14);
    doc.text(`Monto Total: ${montoTotal}`, 20, yPosition + 10);
    doc.save("Orden_Pago.pdf");

    setSalirActivo(true);
  };

  const handleSubmit = async () => {
    setSubiendo(true);

    await new Promise(resolve => setTimeout(resolve, 3000));

    if (!estudiantes || estudiantes.length === 0) {
      alert("No hay estudiantes para registrar.");
      setSubiendo(false);
      return;
    }

    let hayErrores = false;
    let listaDePostulantes = [];

    for (let i = 0; i < estudiantes.length; i++) {
      const estudianteOriginal = estudiantes[i];

      const camposRequeridos = [
        "nombrePost",
        "apellidoPost",
        "carnet",
        "correoPost",
        "fechaNaciPost",
        "idCurso",
        "idColegio",
        "departamento",
        "provincia",
      ];

      const camposVacios = camposRequeridos.filter((campo) => {
        if (campo.includes(".")) {
          const [parent, child] = campo.split(".");
          return !estudianteOriginal[parent]?.[child];
        } else {
          return !estudianteOriginal[campo];
        }
      });

      if (
        camposVacios.length > 0 ||
        estudianteOriginal.areas.length === 0 ||
        estudianteOriginal.categorias.length === 0
      ) {
        console.warn(
          `Estudiante ${i + 1} tiene campos vacíos:`,
          camposVacios
        );
        hayErrores = true;
        continue;
      }

      const { departamentoColegio, provinciaColegio, ...estudiante } =
        estudianteOriginal;

      const postulante = {
        ...estudiante,
        carnet: String(estudiante.carnet ?? ""),
        telefonoPost: String(estudiante.telefonoPost ?? ""),
        idCurso: String(estudiante.idCurso ?? ""),
        idColegio: String(estudiante.idColegio ?? ""),
        fechaNaciPost: new Date(estudiante.fechaNaciPost).toISOString().split('T')[0],
        idTutor: tutor.idTutor,
        tutor: tutor,
      };

      console.log(postulante);

      try {
        const response = await fetch(`${apiUrl}/registrar-postulante`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postulante),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Error al registrar estudiante ${i + 1}:`, errorText);
          hayErrores = true;
        } else {
          const data = await response.json();
          const idsPostulacion = data.idPostulacion;
          const postulanteRegistrado = data.postulante;
          console.log(`Estudiante ${i + 1} registrado con éxito.`);
          console.log("IDs de postulación:", idsPostulacion);
          console.log("Postulante:", postulanteRegistrado);

          const detalles = postulante.categorias.map((categoria, index) => ({
            idPostulacion: idsPostulacion[index],
            descripcion: `Inscripción (${categoria.nombreCategoria})`,
            monto: categoria.monto,
          }));

          listaDePostulantes.push(...detalles);
        }
      } catch (error) {
        console.error(`Error de red al registrar estudiante ${i + 1}:`, error);
        hayErrores = true;
      }
    }

    if (hayErrores) {
      alert(
        "Algunos estudiantes no se pudieron registrar. Revisa la consola para más detalles."
      );
      setSubiendo(false);
      return;
    } else {
      alert("Todos los estudiantes fueron registrados correctamente.");
    }

    const orden = {
      idTutor: tutor.idTutor,
      montoTotal: parseFloat(montoTotal.replace(",", ".")),
      vigencia: convocatoria.fechaFinInsc,
      cancelado: false,
      recibido: false,
      detalles: listaDePostulantes,
    };

    console.log(orden);

    try {
      const response = await fetch(`${apiUrl}/ordenpago`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(orden),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error al registrar la orden de pago:`, errorText);
        hayErrores = true;
      }

      // setMostrarBotones(false);
      // setMostrarDescargar(true);
    } catch (error) {
      console.error(`Error al registrar la orden de pago:`, error);
      hayErrores = true;
    } finally {
      setSubiendo(false);
    }
  };

  const handleCancelar = () => {
    if (from === "Manual") {
      navigate(`/convocatoria/${idConvocatoria}/inscripcion-manual`, {
        state: { estudiantes },
      });
    } else if (from === "Excel") {
      navigate(`/convocatoria/${idConvocatoria}/inscripcion-excel`, {
        state: { estudiantes },
      });
    } else {
      navigate(-1);
    }
  };

  const handleSalir = () => {
    navigate("/");
  };

  return (
    <div className="contenedor-orden">
      <div className="seccion-container">
        <h1>Órden de Pago </h1>

        {cargando ? (
          <FullScreenSpinner />
        ) : (
          <>
            <div className="seccion">
              <table>
                <thead>
                  <tr>
                    <th>Estudiante</th>
                    <th className="monto">Monto</th>
                    <th>Áreas</th>
                  </tr>
                </thead>
                <tbody>
                  {estudiantes.map((est, index) => (
                    <tr key={index}>
                      <td>
                        <input value={est.nombrePost} readOnly />
                      </td>
                      <td className="monto">
                        <input
                          value={est.categorias
                            .reduce((acc, cat) => acc + parseFloat(cat.monto), 0)
                            .toFixed(2)}
                          readOnly
                        />
                      </td>
                      <td>
                        <input
                          value={est.areas
                            .map((area) => area.tituloArea)
                            .join(" - ")}
                          readOnly
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="total">
                <label>Monto Total:</label>
                <input type="text" value={montoTotal} readOnly />
              </div>
            </div>

            {/* Vista móvil */}
            <div className="mobile-cards mobile-view">
              {estudiantes.map((estudiante, index) => {
                const isExpanded = expandedIds.includes(estudiante.id || index);
                return (
                  <div className="user-card" key={estudiante.id || index}>
                    <div
                      className="user-header"
                      onClick={() => toggleExpand(estudiante.id || index)}
                    >
                      <span className="user-name">
                        {estudiante.nombrePost} {estudiante.apellidoPost}
                      </span>
                      <span className="toggle-icon">{isExpanded ? "▲" : "▼"}</span>
                    </div>
                    {isExpanded && (
                      <div className="user-details">
                        <p>
                          <strong>Áreas:</strong>{" "}
                          {estudiante.areas.map((area, idx) => (
                            <span key={area.idArea}>
                              {area.tituloArea} -{" "}
                              {estudiante.categorias[idx]?.nombreCategoria}
                              <br />
                            </span>
                          ))}
                        </p>
                        <p>
                          <strong>Monto:</strong>{" "}
                          {estudiante.categorias
                            .reduce((acc, cat) => acc + parseFloat(cat.monto), 0)
                            .toFixed(2)}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}


        <div className="botones">
          {mostrarBotones && (
            <>
              <button className="btn-descargar" onClick={handleAceptar} disabled={cargando || subiendo}>
                Aceptar {subiendo ? <span><SpinnerInsideButton/></span> : ""}
              </button>
              <button className="btn-cancelar" onClick={handleCancelar} disabled={cargando || subiendo}>
                Cancelar
              </button>
            </>
          )}

          {mostrarDescargar && !subiendo && (
            <>
              <button className="btn-descargar" onClick={handleDescargarPDF}>
                Descargar PDF
              </button>
            </>
          )}

          <button onClick={handleSalir} disabled={!salirActivo}>
            Salir
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrdenPago;
