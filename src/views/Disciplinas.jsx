import React from "react";
import "./styles/Disciplinas.css"; // Archivo de estilos

const disciplinas = [
  {
    nombre: "MATEMATICA",
    imagen: "https://static.vecteezy.com/system/resources/previews/013/086/795/non_2x/cartoon-maths-elements-background-education-logo-vector.jpg",
    icono: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxatQV-g8rA-pbh--Ii4bk-AAt0tVCICzbxw&s",
    color: "#E65100",
  },
  {
    nombre: "FISICA",
    imagen: "https://img.freepik.com/vector-gratis/cientifico_1308-6633.jpg",
    icono: "https://img.freepik.com/vector-gratis/fondo-educacion-cientifica-dibujado-mano_23-2148499325.jpg?t=st=1743086420~exp=1743090020~hmac=1f3bcfff4b2a5da335b216e04a2ba5eb8e6f60af0d36e0e6fb3e8a4aadd642e7&w=1380",
    color: "#0277BD",
  },
  {
    nombre: "QUIMICA",
    imagen: "https://img.freepik.com/vector-gratis/objetos-laboratorio-ciencias_23-2148488312.jpg",
    icono: "https://i.pinimg.com/736x/51/4a/f4/514af427dcb3dbad3312af7e6ff1f8a7.jpg",
    color: "#6A1B9A",
  },
  {
    nombre: "BIOLOGIA",
    imagen: "https://udocz-images.b-cdn.net/documents_html/440199-7897589dc241c900c46719f96130e367/bg1.jpg?width=2688",
    icono: "https://thumbs.dreamstime.com/b/icono-de-l%C3%ADnea-biolog%C3%ADa-elemento-vector-aislado-color-pictograma-esquema-para-promoci%C3%B3n-aplicaciones-m%C3%B3viles-p%C3%A1ginas-web-224084916.jpg",
    color: "#2E7D32",
  },
  {
    nombre: "ASTRONOMIA Y ASTROFISICA",
    imagen: "https://media.istockphoto.com/id/1174984515/es/vector/%C3%A1%C3%B1%C3%A1-o-%C3%A1-%C3%A1.jpg?s=612x612&w=0&k=20&c=J2qSnIRazrNSfabOUuJYWksecZXEjoTBGG5dH4M3T_8=",
    icono: "https://res.cloudinary.com/djhqderty/image/upload/v1723338613/astroingeo/qkjdxiau6bebzgtbyl00.webp",
    color: "#FBC02D",
  },
  {
    nombre: "INFORMATICA",
    imagen: "https://img.freepik.com/vector-gratis/concepto-diseno-web-dibujado-mano_23-2147839737.jpg",
    icono: "https://img.freepik.com/vector-gratis/concepto-diseno-web-dibujado-mano_23-2147839737.jpg",
    color: "#283593",
  },
  {
    nombre: "ROBOTICA",
    imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1UfYGOA_94gtMbw2F-MusMOULhOQdvj8_sQ&s",
    icono: "https://img.freepik.com/vector-gratis/ninos-arreglando-robot-juntos_1308-79403.jpg",
    color: "#283593",
  },
];

const Disciplinas = () => {
  return (
    <div className="Disciplina">
      
      <div className="grid-container">
        {disciplinas.map((disciplina, index) => (
          <div key={index} className="card">
            <img src={disciplina.imagen} alt={disciplina.nombre} className="imagen" />
            <h3>{disciplina.nombre}</h3>
            <div className="icono-container" style={{ backgroundColor: disciplina.color }}>
              <img src={disciplina.icono} alt="icono" className="icono" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Disciplinas;