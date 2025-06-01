import React, { useState } from 'react';
import './styles/Postulantes.css'; // Tu archivo CSS

const PostulantesToogleResponsive = ({ postulantes }) => {
  const [detallesVisibles, setDetallesVisibles] = useState([]);
  console.log(postulantes);


  const toggleDetalle = (index) => {
    setDetallesVisibles((prev) => {
      const copia = [...prev];
      copia[index] = !copia[index];
      return copia;
    });
  };

  return (
    <div className="postulante-lista">
      {postulantes.map((p, index) => (
        <div className="postulante-item" key={index}>
          <button className="postulante-header" onClick={() => toggleDetalle(index)}>
            {p.postulante.nombrePost} {p.postulante.apellidoPost}
            <span className={`arrow ${detallesVisibles[index] ? 'up' : 'down'}`}></span>
          </button>
          <div className={`postulante-detalle ${detallesVisibles[index] ? "visible" : ""}`}>
            <p><strong>Tutor:</strong> {p.postulante?.tutor?.nombreTutor} {p.postulante?.tutor?.apellidoTutor}</p>
            <p><strong>Colegio:</strong> {p.postulante.colegio.nombreColegio}</p>
            <p>
              <strong>Áreas y Categorías:</strong>{" "}
              {p.categoria.map(c => `${c.area?.nombreArea} - ${c.nombreCategoria}`).join(', ')}
            </p>

            <p><strong>Monto Total:</strong> Bs. {p.categoria.reduce((acc, c) => acc + parseFloat(c.monto), 0).toFixed(2)} </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostulantesToogleResponsive;
