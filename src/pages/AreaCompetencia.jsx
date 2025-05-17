import React from "react";
import "./styles/AreaCompetencia.css"; 

const AreaCompetencia = ({ setModalVisible, areasSeleccionadas, setAreasSeleccionadas, categoriasSeleccionadas, setCategoriasSeleccionadas }) => {
  
  const areasDisponibles = [
    { idArea: 1, tituloArea: "Matemáticas", descripcionArea: "Descripcion Matematicas", activo: true, idConvocatoria: 1 },
    { idArea: 2, tituloArea: "Física", descripcionArea: "Descripcion Física", activo: true, idConvocatoria: 1 },
    { idArea: 3, tituloArea: "Química", descripcionArea: "Descripcion Química", activo: true, idConvocatoria: 1 },
    { idArea: 4, tituloArea: "Biología", descripcionArea: "Descripcion Biología", activo: true, idConvocatoria: 1 },
    { idArea: 5, tituloArea: "Astronomía y Astrofísica", descripcionArea: "Descripcion Astronomía y Astrofísica", activo: true, idConvocatoria: 1 },
    { idArea: 6, tituloArea: "Informática", descripcionArea: "Descripcion Informática", activo: true, idConvocatoria: 1 },
    { idArea: 7, tituloArea: "Robótica", descripcionArea:"Descripcion Robótica", activo: true, idConvocatoria: 1},
  ];

  const categoriasDisponibles = [
    { idCategoria: 1, nombreCategoria: "Primer Nivel", descripcionCategoria: "Descripcion Primer Nivel", idArea: 1 },
    { idCategoria: 2, nombreCategoria: "Segundo Nivel", descripcionCategoria: "Descripcion Segundo Nivel", idArea: 1 },
    { idCategoria: 3, nombreCategoria: "Tercer Nivel", descripcionCategoria: "Descripcion Tercer Nivel", idArea: 1 },
    { idCategoria: 4, nombreCategoria: "Cuarto Nivel", descripcionCategoria: "Descripcion Cuarto Nivel", idArea: 1 },
    { idCategoria: 5, nombreCategoria: "Quinto Nivel", descripcionCategoria: "Descripcion Quinto Nivel", idArea: 1 },
    { idCategoria: 6, nombreCategoria: "Sexto Nivel", descripcionCategoria: "Descripcion Sexto Nivel", idArea: 1 },

    { idCategoria: 7, nombreCategoria: "4_Secundaria", descripcionCategoria: "Descripcion 4_Secundaria", idArea: 2 },
    { idCategoria: 8, nombreCategoria: "5_Secundaria", descripcionCategoria: "Descripcion 5_Secundaria", idArea: 2 },
    { idCategoria: 9, nombreCategoria: "6_Secundaria", descripcionCategoria: "Descripcion 6_Secundaria", idArea: 2 },

    { idCategoria: 10, nombreCategoria: "2_Secundaria", descripcionCategoria: "Descripcion 2_Secundaria", idArea: 3 },
    { idCategoria: 11, nombreCategoria: "3_Secundaria", descripcionCategoria: "Descripcion 3_Secundaria", idArea: 3 },
    { idCategoria: 12, nombreCategoria: "4_Secundaria", descripcionCategoria: "Descripcion 4_Secundaria", idArea: 3 },
    { idCategoria: 13, nombreCategoria: "5_Secundaria", descripcionCategoria: "Descripcion 5_Secundaria", idArea: 3 },
    { idCategoria: 14, nombreCategoria: "6_Secundaria", descripcionCategoria: "Descripcion 6_Secundaria", idArea: 3 },

    { idCategoria: 15, nombreCategoria: "2_Secundaria", descripcionCategoria: "Descripcion 2_Secundaria", idArea: 4 },
    { idCategoria: 16, nombreCategoria: "3_Secundaria", descripcionCategoria: "Descripcion 3_Secundaria", idArea: 4 },
    { idCategoria: 17, nombreCategoria: "4_Secundaria", descripcionCategoria: "Descripcion 4_Secundaria", idArea: 4 },
    { idCategoria: 18, nombreCategoria: "5_Secundaria", descripcionCategoria: "Descripcion 5_Secundaria", idArea: 4 },
    { idCategoria: 19, nombreCategoria: "6_Secundaria", descripcionCategoria: "Descripcion 6_Secundaria", idArea: 4 },

    { idCategoria: 20, nombreCategoria: "3_Primaria", descripcionCategoria: "Descripcion 3_Primaria", idArea: 5 },
    { idCategoria: 21, nombreCategoria: "4_Primaria", descripcionCategoria: "Descripcion 4_Primaria", idArea: 5 },
    { idCategoria: 22, nombreCategoria: "5_Primaria", descripcionCategoria: "Descripcion 5_Primaria", idArea: 5 },
    { idCategoria: 23, nombreCategoria: "6_Primaria", descripcionCategoria: "Descripcion 6_Primaria", idArea: 5 },
    { idCategoria: 24, nombreCategoria: "1_Secundaria", descripcionCategoria: "Descripcion 1_Secundaria", idArea: 5 },
    { idCategoria: 25, nombreCategoria: "2_Secundaria", descripcionCategoria: "Descripcion 2_Secundaria", idArea: 5 },

    { idCategoria: 26, nombreCategoria: "Guacamayo", descripcionCategoria: "Descripcion Guacamayo", idArea: 6 },
    { idCategoria: 27, nombreCategoria: "Guanaco", descripcionCategoria: "Descripcion Guanaco", idArea: 6 },
    { idCategoria: 28, nombreCategoria: "Londra", descripcionCategoria: "Descripcion Londra", idArea: 6 },
    { idCategoria: 29, nombreCategoria: "Jucumari", descripcionCategoria: "Descripcion Jucumari", idArea: 6 },
    { idCategoria: 30, nombreCategoria: "Bufeo", descripcionCategoria: "Descripcion Bufeo", idArea: 6 },
    { idCategoria: 31, nombreCategoria: "Puma", descripcionCategoria: "Descripcion Puma", idArea: 6 },
    
    { idCategoria: 32, nombreCategoria: "Builders P", descripcionCategoria: "Descripcion Builders P", idArea: 7 },
    { idCategoria: 33, nombreCategoria: "Builders S", descripcionCategoria: "Descripcion Builders S", idArea: 7 },
    { idCategoria: 34, nombreCategoria: "Lego P", descripcionCategoria: "Descripcion Lego P", idArea: 7 },
    { idCategoria: 35, nombreCategoria: "Lego S", descripcionCategoria: "Descripcion Lego S", idArea: 7 },
  ];

  // const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState(
  //   areasSeleccionadas.reduce((acc, area) => {
  //     acc[area.idArea] = area.idCategoria || "";
  //     return acc;
  //   }, {})
  // );

  const handleCheckboxChange = (area) => {
    setAreasSeleccionadas((prev) =>
      prev.some((a) => a.idArea === area.idArea)
        ? prev.filter((a) => a.idArea !== area.idArea)
        : [...prev, { ...area/*, idCategoria: "" */}]
    );
    
    categoriasSeleccionadas
      .filter((categoria) => categoria.idArea === area.idArea)
      .map((categoria) => (handleCategoriaChange(categoria)));
  };

  const handleCategoriaChange = (categoria) => {
    setCategoriasSeleccionadas((prev) => 
      prev.some((a) => a.idCategoria === categoria.idCategoria)
        ? prev.filter((a) => a.idCategoria !== categoria.idCategoria)
        : [...prev, { ...categoria/*, idCategoria: "" */}]
    );
    // setAreasSeleccionadas((prev) =>
    //   prev.map((a) => (a.idArea === areaId ? { ...a, idCategoria: categoriaId } : a))
    // );
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>ÁREAS DE COMPETENCIAS</h2>
        <button className="close-btn" onClick={() => setModalVisible(false)}>✖</button>

        <div className="competencias">
          {areasDisponibles.map((area) => (
            <div key={area.idArea}>
              <label>
                <input
                  type="checkbox"
                  checked={areasSeleccionadas.some((a) => a.idArea === area.idArea)}
                  onChange={() => handleCheckboxChange(area)}
                  disabled={areasSeleccionadas.length === 2 && !areasSeleccionadas.some((a) => a.idArea === area.idArea)}
                />
                {area.tituloArea}
              </label>
              {areasSeleccionadas.some((a) => a.idArea === area.idArea) && (
                <div>
                  {categoriasDisponibles
                    .filter((categoria) => categoria.idArea === area.idArea)
                    .map((categoria) => (
                      <label>
                        <input
                          type="checkbox"
                          checked={categoriasSeleccionadas.some((a) => a.idCategoria === categoria.idCategoria)}
                          onChange={() => handleCategoriaChange(categoria)}
                          disabled={(categoriasSeleccionadas.length === 1 && categoriasSeleccionadas.some((a) => a.idArea === categoria.idArea) && !categoriasSeleccionadas.some((a) => a.idCategoria === categoria.idCategoria)) || (categoriasSeleccionadas.length === 2 && !categoriasSeleccionadas.some((a) => a.idCategoria === categoria.idCategoria))}
                        />
                        {categoria.nombreCategoria}
                      </label>
                    ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="modal-buttons">
          <button className="btn-registrar" onClick={() => setModalVisible(false)}>Aceptar</button>
          <button className="btn-cancelar" onClick={() => setModalVisible(false)}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default AreaCompetencia;