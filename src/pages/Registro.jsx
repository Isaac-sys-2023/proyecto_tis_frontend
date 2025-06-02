import React, { useState, useEffect } from "react";
import "./styles/Registro.css";
import { useNavigate } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL;

const nombreApellidoRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
const carnetRegex = /^[0-9]+$/;

const Registro = ({ idConvocatoria, setRegistro, estudiante, areasSeleccionadas, setAreasSeleccionadas, categoriasSeleccionadas, setCategoriasSeleccionadas, handleRegistrar, handleActualizar }) => {
  const [mostrarArea, setMostrarArea] = useState(false);
  const [provinciasColegio, setProvinciasColegio] = useState([]);
  const [areas, setAreas] = useState([]);
  const navigate = useNavigate();
  const [departamentos, setDepartamentos] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [provincias, setProvincias] = useState([]);

  const [form, setForm] = useState({
    nombrePost: estudiante?.nombrePost || "",
    apellidoPost: estudiante?.apellidoPost || "",
    carnet: estudiante?.carnet || "",
    fechaNaciPost: estudiante?.fechaNaciPost || "",
    correoPost: estudiante?.correoPost || "",
    telefonoPost: estudiante?.telefonoPost || "",
    departamento: estudiante?.departamento || "",
    provincia: estudiante?.provincia || "",
    idColegio: estudiante?.idColegio || "",
    idCurso: estudiante?.idCurso || "",
    idTutor: estudiante?.idTutor || null,
    delegacion: estudiante?.delegacion || "",
    departamentoColegio: estudiante?.departamentoColegio || "",
    provinciaColegio: estudiante?.provinciaColegio || "",
    tutor: {
      nombreTutor: estudiante?.tutor?.nombreTutor || "",
      apellidoTutor: estudiante?.tutor?.apellidoTutor || "",
      correoTutor: estudiante?.tutor?.correoTutor || "",
      telefonoTutor: estudiante?.tutor?.telefonoTutor || "",
      fechaNaciTutor: estudiante?.tutor?.fechaNaciTutor || ""
    },
    areas: estudiante?.areas || [],
    categorias: estudiante?.categorias || [],
  });

  const [colegiosDisponibles, setColegiosDisponibles] = useState([]);

  useEffect(() => {
    console.log(areasSeleccionadas);
    console.log(categoriasSeleccionadas);

    fetch(`${apiUrl}/vercursos`)
      .then(response => response.json())
      .then(data => setCursos(data))
      .catch(error => console.error("Error al obtener cursos:", error));

    fetch(`${apiUrl}/verdepartamentos`)
      .then(response => response.json())
      .then(data => setDepartamentos(data))
      .catch(error => console.error("Error al obtener departamentos:", error));
  }, []);

  useEffect(() => {
    if (form.departamentoColegio) {
      fetch(`${apiUrl}/verprovincias/departamento/${form.departamentoColegio}`)
        .then(res => res.json())
        .then(data => setProvinciasColegio(data))
        .catch(error => console.error("Error al obtener provincias:", error));
    }
  }, [form.departamentoColegio]);

  useEffect(() => {
    if (form.departamentoColegio && form.provinciaColegio) {
      fetch(`${apiUrl}/departamentos/${form.departamentoColegio}/provincias/${form.provinciaColegio}/colegios`)
        .then(res => res.json())
        .then(data => setColegiosDisponibles(data))
        .catch(error => console.error("Error al obtener colegios:", error));
    }
  }, [form.departamentoColegio, form.provinciaColegio]);

  useEffect(() => {
    if (form.departamento) {
      fetch(`${apiUrl}/verprovincias/departamento/${form.departamento}`)
        .then(response => response.json())
        .then(data => setProvincias(data))
        .catch(error => console.error("Error al obtener provincias:", error));
    }
  }, [form.departamento]);

  // useEffect(() => {
  //   // Si idCurso es distinto de vacío (o incluso si vuelve a ""), siempre limpiamos:
  //   console.log("executing");
  //   setMostrarArea(false);
  //   setAreasSeleccionadas([]);
  //   setCategoriasSeleccionadas([]);
  // }, [form.idCurso, setAreasSeleccionadas, setCategoriasSeleccionadas]);


  const handleChange = (e) => {
    const { name, value } = e.target;

    console.log("Ejecuntado...");
    

    if ((name === "nombrePost" || name === "apellidoPost") && value && !nombreApellidoRegex.test(value)) {
      alert("El nombre y apellido solo pueden contener letras.");
      return;
    }

    if (name === "carnet" && value && !carnetRegex.test(value)) {
      alert("El carnet solo puede contener números.");
      return;
    }
    if (name === "fechaNaciPost") {
      const selectedDate = new Date(value);
      const minDate = new Date(1990, 0, 1); // 1 de enero de 1990
      const maxDate = new Date(2019, 11, 31); // 31 de diciembre de 2019

      if (value && (selectedDate < minDate || selectedDate > maxDate)) {
        alert("La fecha de nacimiento debe estar entre el 1 de enero de 1990 y el 31 de diciembre de 2019.");
        return; // No actualiza el estado si la fecha es inválida
      }
    }

    // if (name === "idCurso") {
    //   console.log("executing");
      
    //   setMostrarArea(false);
    //   areasSeleccionadas.forEach(area => {
    //     handleCheckboxChange(area);
    //   });
    // }

    setForm((prevForm) => {
      if (name.includes(".")) {
        const [parent, child] = name.split(".");
        return {
          ...prevForm,
          [parent]: {
            ...prevForm[parent],
            [child]: value,
          },
        };
      }

      return {
        ...prevForm,
        [name]: value,
      };
    });

    if (name === "departamentoColegio") {
      fetch(`${apiUrl}/verprovincias/departamento/${value}`)
        .then(response => response.json())
        .then(data => setProvinciasColegio(data))
        .catch(error => console.error("Error al obtener provincias:", error));
      setColegiosDisponibles([]);
    }

    if (name === "provinciaColegio") {
      const departamentoActual = form.departamentoColegio;
      fetch(`${apiUrl}/departamentos/${departamentoActual}/provincias/${value}/colegios`)
        .then(response => response.json())
        .then(data => setColegiosDisponibles(data))
        .catch(error => console.error("Error al obtener colegios:", error));
    }

    if (name === "departamento") {
      fetch(`${apiUrl}/verprovincias/departamento/${value}`)
        .then(response => response.json())
        .then(data => setProvincias(data))
        .catch(error => console.error("Error al obtener provincias:", error));
    }
  };

  const handleAceptar = () => {
    console.log(form);

    const camposRequeridos = [
      "nombrePost", "apellidoPost", "carnet", "correoPost", "fechaNaciPost",
      "idCurso", "departamento", "provincia",
      "tutor.nombreTutor", "tutor.apellidoTutor",
      "tutor.telefonoTutor", "tutor.correoTutor", "tutor.fechaNaciTutor"
    ];

    const getValorCampo = (obj, path) => {
      return path.split('.').reduce((acc, parte) => {
        if (acc && acc[parte] !== undefined) return acc[parte];
        return undefined;
      }, obj);
    };

    const camposVacios = camposRequeridos.filter((campo) => {
      const valor = getValorCampo(form, campo);
      return valor === null || valor === undefined || valor === "";
    });

    if (camposVacios.length > 0 || areasSeleccionadas.length === 0 || categoriasSeleccionadas.length === 0) {
      console.warn("Campos vacíos:", camposVacios);
      alert("Por favor completa todos los campos requeridos y selecciona al menos un área y una categoría.");
      return;
    }

    const colegioSeleccionado = colegiosDisponibles[form.idColegio];
    form.delegacion = colegioSeleccionado;

    console.log(estudiante);

    if (Object.keys(estudiante).length > 0) {
      handleActualizar(form, estudiante); // función que puedes definir tú
      console.log("Hizo actualizzar");
    } else {
      handleRegistrar(form);
      console.log("Hizo añadir");
    }
  };

  const showModal = () => {
    const cursoSeleccionado = cursos.find((curso) => curso.idCurso == form.idCurso);

    if (!idConvocatoria) {
      console.error("El parámetro 'id' es undefined.");
      return;
    }

    if (!form.idCurso) {
      alert("Debes seleccionar un curso antes de continuar.");
      return;
    }

    fetch(`${apiUrl}/convocatoria/${idConvocatoria}/curso/${cursoSeleccionado.Curso}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error del servidor: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        const areasTransformadas = data.estructura.map(item => ({
          id: item.area.id,
          nombre: item.area.nombre,
          categorias: item.categorias
        }));
        setAreas(areasTransformadas);
      })
      .catch(error => console.error("Error al obtener cursos:", error));

    setMostrarArea(!mostrarArea);
  }

  const handleCheckboxChange = (area) => {
    const yaSeleccionada = areasSeleccionadas.some((a) => a.id === area.id);

    if (yaSeleccionada) {
      // ✅ Si se deselecciona, quitamos el área...
      setAreasSeleccionadas((prev) => prev.filter((a) => a.id !== area.id));

      // 🧹 ...y también sus categorías asociadas
      setCategoriasSeleccionadas((prev) =>
        prev.filter(
          (categoria) => !area.categorias.some((c) => c.id === categoria.id)
        )
      );
    } else {
      // ✅ Si se selecciona, la agregamos normalmente
      setAreasSeleccionadas((prev) => [...prev, { ...area }]);
    }
  };


  const handleCategoriaChange = (categoria, area) => {
    setCategoriasSeleccionadas((prev) => {
      const yaSeleccionada = prev.some((a) => a.id === categoria.id);
      const categoriasMismaArea = area.categorias.map((c) => c.id);

      if (yaSeleccionada) {
        return prev.filter((a) => a.id !== categoria.id);
      } else {
        const sinMismaArea = prev.filter((a) => !categoriasMismaArea.includes(a.id));
        return [...sinMismaArea, { ...categoria }];
      }
    });
  };

  const handleCancelar = () => {
    setRegistro(false);
  };

  return (
    <div className="registro-container">
      <div className="seccion-container">
        <div className="seccion">
          <h2 className="subtitulo">Postulante</h2>
          <div className="grid-container">
            <input type="text" placeholder="Nombre(s)" name="nombrePost" onChange={handleChange} value={form.nombrePost} />
            <input type="text" placeholder="Apellido(s)" name="apellidoPost" onChange={handleChange} value={form.apellidoPost} />
            <input type="text" placeholder="Carnet de Identidad" name="carnet" onChange={handleChange} value={form.carnet} />
            <input type="email" placeholder="Correo Electrónico" name="correoPost" onChange={handleChange} value={form.correoPost} />
            <input
              type="date"
              name="fechaNaciPost"
              onChange={handleChange}
              min="1990-01-01"
              max="2019-12-31"
              value={form.fechaNaciPost}
            />

            <select name="idCurso" onChange={handleChange} value={form.idCurso}>
              <option value="">Selecciona un curso</option>
              {cursos.map((curso) => (
                <option key={curso.idCurso} value={curso.idCurso}>{curso.Curso}</option>
              ))}
            </select>

            <select name="departamento" onChange={handleChange} value={form.departamento}>
              <option value="">Selecciona un departamento </option>
              {departamentos.map((dep) => (
                <option key={dep.idDepartamento} value={dep.nombreDepartamento}>{dep.nombreDepartamento}</option>
              ))}
            </select>

            <select name="provincia" onChange={handleChange} value={form.provincia} disabled={!form.departamento}>
              <option value="">Selecciona una provincia</option>
              {provincias.map((prov) => (
                <option key={prov.idProvincia} value={prov.nombreProvincia}>{prov.nombreProvincia}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="recuadro-container">
          <h3> Datos del Colegio </h3>
          <select name="departamentoColegio" onChange={handleChange} value={form.departamentoColegio}>
            <option value="">Selecciona un departamento</option>
            {departamentos.map((dep) => (
              <option key={dep.idDepartamento} value={dep.nombreDepartamento}>{dep.nombreDepartamento}</option>
            ))}
          </select>

          <select name="provinciaColegio" onChange={handleChange} value={form.provinciaColegio} disabled={!form.departamentoColegio}>
            <option value="">Selecciona una provincia</option>
            {provinciasColegio.map((prov) => (
              <option key={prov.idProvincia} value={prov.nombreProvincia}>{prov.nombreProvincia}</option>
            ))}
          </select>

          <select name="idColegio" onChange={handleChange} value={form.idColegio} disabled={!form.provinciaColegio}>
            <option value="">Selecciona un colegio</option>
            {Object.entries(colegiosDisponibles).map(([id, nombre]) => (
              <option key={id} value={id}>
                {nombre}
              </option>
            ))}
          </select>
        </div>

        {areasSeleccionadas.length > 0 && (
          <div className="areas-seleccionadas">
            <h3>Áreas Seleccionadas:</h3>
            <ul>
              {areasSeleccionadas.map((area) => (
                <div key={area.id}>
                  {area?.nombre || "Sin Area"} - {
                    (
                      categoriasSeleccionadas.find((categoria) =>
                        area.categorias.some((c) => c.id === categoria.id)
                      )?.nombre || "Sin categoría"
                    )
                  }
                </div>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Botón para mostrar/ocultar área de competencia */}
      <button className="boton btn-competencia" onClick={showModal}>
        {mostrarArea ? "Ocultar Áreas de Competencia" : "Seleccionar Áreas de Competencia"}
      </button>

      {/* Mostrar Área de Competencia si está activado */}
      {mostrarArea && (
        <div className="seccion-container">
          <div className="competencias">
            {areas.map((area) => (
              <div key={area.id}>
                <label>
                  <input
                    type="checkbox"
                    checked={areasSeleccionadas.some((a) => a.id === area.id)}
                    onChange={() => handleCheckboxChange(area)}
                    disabled={areasSeleccionadas.length === 2 && !areasSeleccionadas.some((a) => a.id === area.id)}
                  />
                  {area.nombre}
                </label>
                {areasSeleccionadas.some((a) => a.id === area.id) && (
                  <div>
                    {area.categorias.map((categoria) => (
                      <label key={categoria.id}>
                        <input
                          type="checkbox"
                          checked={categoriasSeleccionadas.some((a) => a.id === categoria.id)}
                          onChange={() => handleCategoriaChange(categoria, area)}
                          disabled={
                            area.categorias.some((c) =>
                              categoriasSeleccionadas.some((a) => a.id === c.id && a.id !== categoria.id)
                            ) ||
                            (categoriasSeleccionadas.length === 2 &&
                              !categoriasSeleccionadas.some((a) => a.id === categoria.id))
                          }
                        />
                        {categoria.nombre}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="seccion-container">
        <div className="seccion">
          <h2 className="subtitulo">Tutor</h2>
          <div className="grid-container">
            <input type="text" placeholder="Nombre(s)" name="tutor.nombreTutor" onChange={handleChange} value={form.tutor?.nombreTutor} />
            <input type="text" placeholder="Apellido(s)" name="tutor.apellidoTutor" onChange={handleChange} value={form.tutor?.apellidoTutor} />
            <input type="text" placeholder="Teléfono" name="tutor.telefonoTutor" onChange={handleChange} value={form.tutor?.telefonoTutor} />
            <input type="email" placeholder="Correo Electrónico" name="tutor.correoTutor" onChange={handleChange} value={form.tutor?.correoTutor} />
            <input
              type="date"
              name="tutor.fechaNaciTutor"
              onChange={handleChange}
              min="1990-01-01"
              max="2019-12-31"
              value={form.tutor?.fechaNaciTutor}
            />
          </div>
        </div>

        {/* Botones de acción */}
        <div className="botones">
          {Object.keys(estudiante).length > 0
            ? <button className="boton btn-blue" onClick={handleAceptar}>Modificar</button>
            : <button className="boton btn-blue" onClick={handleAceptar}>Registrar</button>}
          <button className="boton btn-red" onClick={handleCancelar}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}

export default Registro;