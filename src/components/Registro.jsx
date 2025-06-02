import React, { useState, useEffect } from "react";
import "./styles/Registro.css";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { es } from 'date-fns/locale';
 


const nombreApellidoRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
const carnetRegex = /^[0-9]+$/;
const apiUrl = import.meta.env.VITE_API_URL;

const Registro = ({ idConvocatoria, setRegistro, estudiante, areasSeleccionadas, setAreasSeleccionadas, categoriasSeleccionadas, setCategoriasSeleccionadas, handleRegistrar, handleActualizar, setIndexEdit, setEstudianteEdit }) => {
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


  const handleChange = (e) => {
    const { name, value } = e.target;
    if ((name === "nombrePost" || name === "apellidoPost") && value && !nombreApellidoRegex.test(value)) {
      alert("El nombre y apellido solo pueden contener letras.");
      return;
    }

    if (name === "carnet" && value && !carnetRegex.test(value)) {
      alert("El carnet solo puede contener números.");
      return;
    }
   

    if (name === "fechaNaciPost") {
      // Permitir solo números y el separador "/"
      const formattedValue = value.replace(/[^0-9/]/g, ""); // Elimina todo lo que no sea número o "/"
      

      // Actualizamos el estado con la entrada formateada
      setForm((prevForm) => ({
        ...prevForm,
        [name]: formattedValue,
      }));
  
      // Validación para que la fecha tenga el formato correcto
      const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
      const match = formattedValue.match(dateRegex);
  
      if (match) {
        const day = parseInt(match[1], 10);
        const month = parseInt(match[2], 10) - 1; // Los meses en JavaScript son de 0 a 11
        const year = parseInt(match[3], 10);
        
        const selectedDate = new Date(year, month, day);
        const minDate = new Date("2007-01-01");
        const maxDate = new Date("2019-12-31");
  
        // Comprobamos si la fecha está dentro del rango
        if (selectedDate < minDate || selectedDate > maxDate) {
          alert("La fecha debe estar entre el 1 de enero de 1990 y el 31 de diciembre de 2019.");
          return;
        }
      }
    }
    

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

    const colegioSeleccionadoId = Object.keys(colegiosDisponibles).find(
      key => colegiosDisponibles[key] === form.idColegio
    );
    const nombreColegio = colegiosDisponibles[colegioSeleccionadoId];

    form.delegacion = nombreColegio;

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
    const cursoSeleccionado = cursos.find((curso) => curso.Curso == form.idCurso);

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
      setAreasSeleccionadas((prev) => prev.filter((a) => a.id !== area.id));

      setCategoriasSeleccionadas((prev) =>
        prev.filter(
          (categoria) => !area.categorias.some((c) => c.id === categoria.id)
        )
      );
    } else {
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
    console.log("SI HACE CLICK");

    console.log("Estudiante:", estudiante);

    setIndexEdit(-1);
    setEstudianteEdit({});
    setAreasSeleccionadas([]);
    setCategoriasSeleccionadas([]);
    setRegistro(false);
  };

  return (
    <div className="registro-container">
      <div className="seccion-container">        
          <div className="encabezado-postulante">Postulante</div>
            <div className="grid-container postulante-scroll">
            <input type="text" placeholder="Nombre(s)" name="nombrePost" onChange={handleChange} value={form.nombrePost} />
            <input type="text" placeholder="Apellido(s)" name="apellidoPost" onChange={handleChange} value={form.apellidoPost} />
            <input type="text" placeholder="Carnet de Identidad" name="carnet" onChange={handleChange} value={form.carnet} />
            <input type="email" placeholder="Correo Electrónico" name="correoPost" onChange={handleChange} value={form.correoPost} />
              <DatePicker
              selected={form.fechaNaciPost}
              onChange={(date) =>
                setForm((prevForm) => ({
                  ...prevForm,
                  fechaNaciPost: date,
                }))
              }
              dateFormat="dd/MM/yyyy"
              placeholderText="DD/MM/AAAA"
              minDate={new Date("2007-01-01")}
              maxDate={new Date("2019-12-31")}
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              locale={es}
              calendarClassName="calendario-postulante"
              dayClassName={date => "dia-calendario"}
              formatWeekDay={nameOfDay => nameOfDay.substr(0, 2)} // corta a "lun", "mar", etc.
            />


            <select name="idCurso" onChange={handleChange} value={form.idCurso}>
              <option value="">Selecciona un curso</option>
              {cursos.map((curso) => (
                <option key={curso.idCurso} value={curso.Curso}>{curso.Curso}</option>
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
              <option key={id} value={nombre}>
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

      <button className="boton btn-competencia" onClick={showModal}>
        {mostrarArea ? "Ocultar Áreas de Competencia" : "Seleccionar Áreas de Competencia"}
      </button>

      {mostrarArea && (
        <div className="seccion-container">
          <div className="competencias">
            {areas.map((area) => (
              <div key={area.id}>
                <label  className="checkbox-derecho area-checkbox">
                 <span>{area.nombre}</span>
                  <input type="checkbox"
                    checked={areasSeleccionadas.some((a) => a.id === area.id)}
                    onChange={() => handleCheckboxChange(area)}
                    disabled={areasSeleccionadas.length === 2 && !areasSeleccionadas.some((a) => a.id === area.id)}
                  />
                  
                </label>
                {areasSeleccionadas.some((a) => a.id === area.id) && (
                  <div>
                    {area.categorias.map((categoria) => (
                      <label className="checkbox-derecho categoria-checkbox" key={categoria.id}>
                        <span>{categoria.nombre}</span>
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
                        
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="botones">
        {Object.keys(estudiante).length > 0
          ? <button className="boton btn-blue" onClick={handleAceptar}>Modificar</button>
          : <button className="boton btn-blue" onClick={handleAceptar}>Registrar</button>}
        <button className="boton btn-red" onClick={handleCancelar}>Cancelar</button>
      </div>

    </div>
  );
}

export default Registro;
