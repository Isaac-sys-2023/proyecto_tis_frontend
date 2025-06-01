import React, { useState, useRef, useEffect } from "react";
import "./styles/Inicio.css";

const datosAreas = [
  {
    nombre: "MATEMATICA",
    imagen: "https://static.vecteezy.com/system/resources/previews/013/086/795/non_2x/cartoon-maths-elements-background-education-logo-vector.jpg",
  },
  {
    nombre: "FISICA",
    imagen: "https://img.freepik.com/vector-gratis/cientifico_1308-6633.jpg",
  },
  {
    nombre: "QUIMICA",
    imagen: "https://img.freepik.com/vector-gratis/objetos-laboratorio-ciencias_23-2148488312.jpg",
  },
  {
    nombre: "BIOLOGIA",
    imagen: "https://udocz-images.b-cdn.net/documents_html/440199-7897589dc241c900c46719f96130e367/bg1.jpg?width=2688",
  },
  {
    nombre: "ASTRONOMIA Y ASTROFISICA",
    imagen: "https://media.istockphoto.com/id/1174984515/es/vector/%C3%A1%C3%B1%C3%A1-o-%C3%A1-%C3%A1.jpg?s=612x612&w=0&k=20&c=J2qSnIRazrNSfabOUuJYWksecZXEjoTBGG5dH4M3T_8=",
  },
  {
    nombre: "INFORMATICA",
    imagen: "https://img.freepik.com/vector-gratis/concepto-diseno-web-dibujado-mano_23-2147839737.jpg",
  },
  {
    nombre: "ROBOTICA",
    imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1UfYGOA_94gtMbw2F-MusMOULhOQdvj8_sQ&s",
  },
];

const Inicio = () => {
  const areasRef = useRef(null);
  const cardWidth = 140; // 120px + 20px gap

  const moverDerecha = () => {
    if (areasRef.current) {
      areasRef.current.scrollBy({ left: cardWidth, behavior: "smooth" });
    }
  };

  const moverIzquierda = () => {
    if (areasRef.current) {
      areasRef.current.scrollBy({ left: -cardWidth, behavior: "smooth" });
    }
  };

  return (
    <div className="inicio-container">
      <header className="banner">
        <h1>Olimpiadas Científicas</h1>
        <h2>Oh! SanSi</h2>
      </header>

      <div className="subtitulo">Áreas de competencia</div>

      <div className="carrusel">
        <button className="flecha" onClick={moverIzquierda}>❮</button>

        <div className="areas" ref={areasRef}>
          {datosAreas.map((area, i) => (
            <div className="area-card" key={i}>
              <img src={area.imagen} alt={area.nombre} />
              <p>{area.nombre}</p>
            </div>
          ))}
        </div>

        <button className="flecha" onClick={moverDerecha}>❯</button>
      </div>
    </div>
  );
};
export default Inicio;


