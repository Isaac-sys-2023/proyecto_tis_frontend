import React, { useState, useEffect } from "react";
import "./styles/DetalleConv.css";
import { Link, useNavigate } from "react-router-dom";

const DetalleConv = () => {
  const [convocatorias, setConvocatorias] = useState([]);
  const navigate = useNavigate();

  const [refresh, setRefresh] = useState(false); // estado auxiliar

  useEffect(() => {
    //fetch("http://localhost:8000/api/todasconvocatorias")
    fetch("http://localhost:8000/api/convocatorias/activas")
      .then(response => response.json())
      .then(data => setConvocatorias(data))
      .catch(error => console.error("Error al obtener colegios:", error));
  }, [refresh]);

  const handleEdit = (id) => {
    navigate(`/editar-convocatoria/${id}`);
  }

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:8000/api/veridconvocatorias/${id}`);
      if (!res.ok) throw new Error("Error al obtener la convocatoria");
      const data = await res.json();

      const formData = {
        titulo: data.tituloConvocatoria,
        descripcion: data.descripcion,
        habilitada: data.habilitada,
        fechaPublicacion: data.fechaPublicacion.split(' ')[0],
        fechaInicioInscripcion: data.fechaInicioInsc.split(' ')[0],
        fechaCierreInscripcion: data.fechaFinInsc.split(' ')[0],
        fechaInicioOlimpiada: data.fechaInicioOlimp.split(' ')[0],
        fechaFinOlimpiada: data.fechaFinOlimp.split(' ')[0],
        imagenPortada: data.portada,
        maxConcursantes: data.maximoPostPorArea,
        maxArea: [],
      }

      const newformData = new FormData();
      newformData.append('_method', 'PUT');
      newformData.append('tituloConvocatoria', formData.titulo);
      newformData.append('descripcion', formData.descripcion);
      newformData.append('fechaPublicacion', formData.fechaPublicacion.split(' ')[0]);
      newformData.append('fechaInicioInsc', formData.fechaInicioInscripcion);
      newformData.append('fechaFinInsc', formData.fechaCierreInscripcion);
      //newformData.append('portada', formData.imagenPortada); // <-- tu imagen
      if (formData.imagenPortada instanceof File) {
        newformData.append('portada', formData.imagenPortada);
      }
      newformData.append('habilitada', formData.habilitada);
      newformData.append('fechaInicioOlimp', formData.fechaInicioOlimpiada);
      newformData.append('fechaFinOlimp', formData.fechaFinOlimpiada);
      newformData.append('maximoPostPorArea', formData.maxConcursantes);
      newformData.append('eliminado', '1');


      const response = await fetch(`http://localhost:8000/api/editconvocatorias/${id}`, {
        method: 'POST',
        body: newformData,
      });

      const text = await response.text();
      if (!response.ok) {
        console.error('Error del servidor:', text); // en vez de tratar de hacer response.json() directamente
        return;
      }else{
        alert("Convocatoria eliminada correctamente");
        setRefresh(prev => !prev); // invertimos el valor para forzar el useEffect
      }
    } catch (error) {
      console.error('Error al eliminar la convocatoria:', error);
    }
  }

  return (
    <div className="container-detalleCov">
      <h2 className="title-detalleConv">Detalle de convocatorias</h2>
      <table className="convocatoria-table">
        <thead>
          <tr>
            <th>TÍTULO</th>
            <th>FECHA DE INSCRIPCIONES</th>
            <th>FECHA DE OLIMPIADAS</th>
            <th>ESTADO</th>
            <th>ACCIÓN</th>
          </tr>
        </thead>
        <tbody>
          {convocatorias.map((convocatoria) => (
            <tr key={convocatoria.idConvocatoria}>

              <td>{convocatoria.tituloConvocatoria}</td>

              <td>{convocatoria.fechaInicioInsc} - {convocatoria.fechaFinInsc}</td>
              <td>{convocatoria.fechaInicioOlimp} - {convocatoria.fechaFinOlimp}</td>
              <td>
                <span className={`estado ${convocatoria.habilitada === 0 ? "rojo" : "verde"}`}>
                  {convocatoria.habilitada === 0 ? "Inactivo" : "Activo"}
                </span>
              </td>
              <td>
                <button className="btn editar" onClick={() => handleEdit(convocatoria.idConvocatoria)}>Editar</button>
                <button className="btn eliminar" onClick={() => handleDelete(convocatoria.idConvocatoria)}>Retirar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="btn agregar"><Link to="/crear-convocatoria" className="text-button">AÑADIR NUEVO</Link></button>
      <button className="btn agregar"><Link to="/" className="text-button">SALIR</Link></button>
    </div>
  );
};

export default DetalleConv;
