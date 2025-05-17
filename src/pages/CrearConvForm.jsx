import React, { useState } from "react";
import "./styles/Convocatoria.css";
import ImageUpload from "../components/ImageUpload";
import { useNavigate } from "react-router-dom";

import { useContext } from "react";
import { ConvocatoriaContext } from "../context/ConvocatoriaContext";


export const CrearConvForm = () => {
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    fechaInicioInscripcion: "",
    fechaCierreInscripcion: "",
    fechaInicioOlimpiada: "",
    fechaFinOlimpiada: "",
    imagenPortada: null,
    // maxConcursantes: [],
    maxConcursantes: 0,
    maxArea: [],
  });

  const [newArea, setNewArea] = useState("");
  const [newMax, setNewMax] = useState("");
  const [newMaxConcursantes, setNewMaxConcursantes] = useState("");
  const [error, setError] = useState(""); // Estado para mostrar errores
  const today = new Date().toISOString().split("T")[0];
  const navigate = useNavigate();

  const { agregarConvocatoria } = useContext(ConvocatoriaContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (file) => {
    setFormData({ ...formData, imagenPortada: file });
  };

  const addAreaMaxConcursantes = () => {
    if (newArea) {
      setFormData({
        ...formData,
        maxConcursantes: [...formData.maxConcursantes, { area: newArea, max: newMaxConcursantes || "Sin límite" }],
      });
      setNewArea("");
      setNewMaxConcursantes("");
    }
  };

  // const handleSiguiente = (e) => {
  //   if (
  //     !formData.titulo ||
  //     !formData.descripcion ||
  //     !formData.fechaInicioInscripcion ||
  //     !formData.fechaCierreInscripcion ||
  //     !formData.fechaInicioOlimpiada ||
  //     !formData.fechaFinOlimpiada ||
  //     !formData.imagenPortada
  //   ) {
  //     setError("Por favor, complete todos los campos obligatorios.");
  //     return;
  //   }
  //   setError("");
  //   //handleSubmit(e);
  //   agregarConvocatoria({
  //     titulo: formData.titulo,
  //     fechaPublicacion: new Date().toISOString().split("T")[0],
  //     fechaInicioInsc: formData.fechaInicioInscripcion,
  //     fechaFinInsc: formData.fechaCierreInscripcion,
  //     portada: formData.imagenPortada,
  //     habilitada: 1,
  //     fechaInicioOlimp: formData.fechaInicioOlimpiada,
  //     fechaFinOlimp: formData.fechaFinOlimpiada,
  //     maximoPostPorArea: formData.maxConcursantes,
  //   });
  //   navigate("/area"); // Asegúrate de que esta ruta coincida con tu configuración
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.titulo ||
      !formData.descripcion ||
      !formData.fechaInicioInscripcion ||
      !formData.fechaCierreInscripcion ||
      !formData.fechaInicioOlimpiada ||
      !formData.fechaFinOlimpiada ||
      !formData.imagenPortada
    ) {
      setError("Por favor, complete todos los campos obligatorios.");
      return;
    }
    setError("");

    const newformData = new FormData();
    newformData.append('titulo', formData.titulo);
    newformData.append('descripcion', formData.descripcion);
    newformData.append('fechaPublicacion', new Date().toISOString().split("T")[0]);
    newformData.append('fechaInicioInsc', formData.fechaInicioInscripcion);
    newformData.append('fechaFinInsc', formData.fechaCierreInscripcion);
    newformData.append('portada', formData.imagenPortada); // <-- tu imagen
    newformData.append('habilitada', '1');
    newformData.append('fechaInicioOlimp', formData.fechaInicioOlimpiada);
    newformData.append('fechaFinOlimp', formData.fechaFinOlimpiada);
    newformData.append('maximoPostPorArea', formData.maxConcursantes);

    // try {
    //   const response = await fetch('http://localhost:8000/api/solo-convocatoria', {
    //     method: 'POST',
    //     body: newformData,
    //   });

    //   if (!response.ok) {
    //     const errorData = await response.json();
    //     console.error('Errores de validación:', errorData.errors);
    //     return;
    //   }

    //   const data = await response.json();
    //   console.log('ID de la convocatoria creada:', data.idConvocatoria);
    //   const idConvocatoria = data.idConvocatoria;

    //   // aquí podrías redirigir o guardar el ID
    //   navigate(`/area`, {
    //     state: { idConvocatoria },
    //   });
    // } catch (error) {
    //   console.error('Error al guardar la convocatoria:', error);
    // }

    try {
      const response = await fetch('http://localhost:8000/api/solo-convocatoria', {
        method: 'POST',
        body: newformData,
      });

      const text = await response.text();
      if (!response.ok) {
        console.error('Error del servidor:', text); // en vez de tratar de hacer response.json() directamente
        return;
      }

      const data = JSON.parse(text);
      console.log('ID de la convocatoria creada:', data.idConvocatoria);

      navigate(`/area`, {
        state: { idConvocatoria: data.idConvocatoria },
      });
    } catch (error) {
      console.error('Error al guardar la convocatoria:', error);
    }

  };


  const handleCancelar = () => {
    navigate("/detalle-convocatoria");
  };


  return (
    <div className="container-formconv">
      <h3 className="title-add-convocatoria">Crear convocatoria</h3>
      <form className="convocatoria-form">
        <label>Título:</label>
        <input
          type="text"
          name="titulo"
          value={formData.titulo}
          maxLength={1300}
          onChange={handleChange}
          className="input-field"
        />

        <label>Descripción:</label>
        <textarea
          name="descripcion"
          value={formData.descripcion}
          maxLength={1300}
          onChange={handleChange}
          className="input-field"
        ></textarea>

        <label>Fechas de inscripción:</label>
        <div className="fecha-group">
          <input
            type="date"
            name="fechaInicioInscripcion"
            min={today}
            value={formData.fechaInicioInscripcion}
            onChange={handleChange}
            className="input-field"
          />
          <input
            type="date"
            name="fechaCierreInscripcion"
            min={today}
            value={formData.fechaCierreInscripcion}
            onChange={handleChange}
            className="input-field"
          />
        </div>

        <label>Fechas de olimpiadas:</label>
        <div className="fecha-group">
          <input
            type="date"
            name="fechaInicioOlimpiada"
            min={today}
            value={formData.fechaInicioOlimpiada}
            onChange={handleChange}
            className="input-field"
          />
          <input
            type="date"
            name="fechaFinOlimpiada"
            min={today}
            value={formData.fechaFinOlimpiada}
            onChange={handleChange}
            className="input-field"
          />
        </div>

        <label>Máximo de inscripción por categoría{/*área*/}:</label>
        <input
          type="number"
          name="maxConcursantes"
          value={formData.maxConcursantes}
          onChange={handleChange}
          className="input-field"
        />

        {/* <ul className="area-list">
          {formData.maxConcursantes.map((item, index) => (
            <li key={index}>
              {item.area}: {item.max} postulantes
            </li>
          ))}
        </ul> */}

        <label>Imagen de portada:</label>
        <ImageUpload onFileSelect={handleFileChange} />

        {error && <p className="error-message">{error}</p>}


      </form>
      <div className="button-group">
        <button type="submit" className="siguiente" onClick={handleSubmit}>
          Siguiente
        </button>
        <button type="button" className="cancelar" onClick={handleCancelar}>
          Cancelar
        </button>
      </div>
    </div>


  );
};

export default CrearConvForm;
