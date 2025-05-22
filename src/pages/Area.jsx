import React, { useEffect, useState } from "react";
import "./styles/Area.css";
import { useNavigate, useLocation } from "react-router-dom";

import { useContext } from "react";
import { ConvocatoriaContext } from "../context/ConvocatoriaContext";

const Area = () => {
  const location = useLocation();
  const idConvocatoria = location.state?.idConvocatoria;
  console.log(idConvocatoria);
  

  const [areas, setAreas] = useState([
    // "Matemáticas", "Física", "Química", "Biología", "Informática", "Robótica"
  ]);
  const [areaDescriptions, setAreaDescriptions] = useState({});
  const [selectedArea, setSelectedArea] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newArea, setNewArea] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [areaCategories, setAreaCategories] = useState({});
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [editedCardNames, setEditedCardNames] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editInput, setEditInput] = useState("");
  const [activeCards, setActiveCards] = useState([]);
  const [customCategoryName, setCustomCategoryName] = useState("");
  const [customCategoryDescription, setCustomCategoryDescription] = useState("");
  const navigate = useNavigate();

  const { convocatoria } = useContext(ConvocatoriaContext);

  // const categoryOptions = [
  //   "1° Primaria", "1° Secundaria", "2° Primaria", "2° Secundaria",
  //   "3° Primaria", "3° Secundaria", "4° Primaria", "4° Secundaria",
  //   "5° Primaria", "5° Secundaria", "6° Primaria", "6° Secundaria"
  // ];

  const [categoryOptions, setCategoryOptions] = useState([]);

  useEffect(() => {
    // fetch("http://localhost:8000/api/areas")
    fetch("http://localhost:8000/api/todasAreas")
      .then(response => response.json())
      // .then(data => setAreas(data))
      .then((data) => {
        const nombres = data.map(area => area.tituloArea);
        setAreas(nombres);
        const descripciones = data.reduce((acc, area) => {
          acc[area.tituloArea] = area.descArea;
          return acc;
        }, {});        
        setAreaDescriptions(descripciones);
      })
      .catch(error => console.error("Error al obtener colegios:", error));

    fetch("http://localhost:8000/api/vercursos")
      .then(response => response.json())
      // .then(data => setAreas(data))
      .then((data) => {
        const nombres = data.map(curso => curso.Curso);
        setCategoryOptions(nombres); // ← aquí solo guardamos los títulos
      })
      .catch(error => console.error("Error al obtener colegios:", error));
  }, []);

  const handleAddArea = () => {
    if (newArea && !areas.includes(newArea)) {
      setAreas([...areas, newArea]);
      setAreaDescriptions({
        ...areaDescriptions,
        [newArea]: newDescription,
      });
      setNewArea("");
      setNewDescription("");
      setShowModal(false);
    }
  };

  const handleSelectArea = (area) => {
    setSelectedArea("");
    if (area && !activeCards.includes(area)) {
      setActiveCards([...activeCards, area]);
    }
  };

  const handleDeleteCard = (area) => {
    setActiveCards(activeCards.filter(a => a !== area));
  };

  const handleEditCard = (area) => {
    setSelectedArea(area);
    setEditInput(editedCardNames[area] || area);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    setEditedCardNames({
      ...editedCardNames,
      [selectedArea]: editInput,
    });
    setIsEditing(false);
    setSelectedArea("");
  };

  const handleSaveCategories = () => {
    const allCategories = [...(areaCategories[selectedArea] || [])];
    // const allCategories = [...selectedCategories];
    if (customCategoryName) {
      //allCategories.push(`${customCategoryName} - ${customCategoryDescription}`);
      allCategories.push({
        name: customCategoryName,
        description: customCategoryDescription,
        levels: [...selectedCategories]
      });
    }

    setAreaCategories({
      ...areaCategories,
      [selectedArea]: allCategories,
    });

    setCustomCategoryName("");
    setCustomCategoryDescription("");
    setSelectedCategories([]);
    setShowCategoryModal(false);
    setSelectedArea("");
  };

  const handleCheckboxChange = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const openCategoryModal = (area) => {
    //const current = areaCategories[area] || [];
    setSelectedArea(area);
    //setSelectedCategories(current);
    setSelectedCategories([]);
    setCustomCategoryName("");
    setCustomCategoryDescription("");
    setShowCategoryModal(true);
  };

  const generarJSONFinal = () => {
    const jsonFinal = {
      convocatoria,
      areas: activeCards.map(area => ({
        tituloArea: editedCardNames[area] || area,
        descArea: areaDescriptions[area] || "",
        habilitada: true,
        categorias: (areaCategories[area] || []).map(cat => ({
          nombreCategoria: cat.name,
          descCategoria: (cat.levels || []).join(", ") // niveles como texto en descCategoria
        }))
      }))
    };

    console.log("JSON Final:", JSON.stringify(jsonFinal, null, 2));
    return jsonFinal;
  };

  const handleMostrarJSON = () => {
    generarJSONFinal();
    alert('Revisa la consola (F12) para ver el JSON generado.');
  };

  const handlePublicar = async (e) => {
    e.preventDefault();

    if (!idConvocatoria) {
      alert("ID de convocatoria no disponible");
      return;
    }

    const areasData = activeCards.map(area => ({
      tituloArea: editedCardNames[area] || area,
      descArea: areaDescriptions[area] || "",
      habilitada: true,
      idConvocatoria: idConvocatoria,
      categorias: (areaCategories[area] || []).map(cat => ({
        nombreCategoria: cat.name,
        descCategoria: (cat.levels || []).join(", "),
        habilitada: true,
        maxPost: 50 // ← Podés reemplazar este valor si querés que sea editable
      }))
    }));

    try {
      const response = await fetch(`http://localhost:8000/api/convocatoria/${idConvocatoria}/estructura`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ areas: areasData }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert("Estructura publicada con éxito ✅");
        console.log("Respuesta del servidor:", data);
        //navigate("/detalle-convocatoria"); // o donde quieras redirigir
      } else {
        alert(`Error al guardar estructura: ${data.error || data.message}`);
        console.error("Error del backend:", data);
      }
  
    } catch (error) {
      alert("Error de red al guardar la estructura");
      console.error("Error de red:", error);
    }

    // const jsonFinal = generarJSONFinal();

    // try {
    //   const response = await fetch('http://localhost:8000/api/convocatorias', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(jsonFinal)
    //   });

    //   if (response.ok) {
    //     const data = await response.json();
    //     alert('Convocatoria publicada con éxito');
    //     console.log('Respuesta del servidor:', data);
    //   } else {
    //     const errorData = await response.json();
    //     alert('Error al publicar: ' + errorData.message);
    //     console.error('Error al publicar:', errorData);
    //   }
    // } catch (error) {
    //   alert('Error de conexión con el servidor');
    //   console.error('Error de red:', error);
    // }
  };

  const handleSiguiente = (e) => {
    handlePublicar(e);
    navigate("/detalle-convocatoria"); // Asegúrate de que esta ruta coincida con tu configuración
  };

  const handleCancelar = () => {
    navigate("/detalle-convocatoria");
  };


  return (
    <div className="container-Area">
      <h2 className="title-Area">Área de competencia</h2>

      <div className="select-group">
        <label>Selecciona un área:</label>
        <select onChange={(e) => handleSelectArea(e.target.value)} value={selectedArea}>
          <option value="">-- Selecciona --</option>
          {areas.map((area) => (
            <option key={area} value={area}>{area}</option>
          ))}
        </select>
      </div>

      <button className="add-button" onClick={() => setShowModal(true)}>Agregar Área</button>

      <div className="card-grid">
        {activeCards.map((area) => (
          <div className="area-card" key={area}>
            {isEditing && selectedArea === area ? (
              <div>
                <input
                  value={editInput}
                  onChange={(e) => setEditInput(e.target.value)}
                  placeholder="Nuevo nombre del área"
                />
                <input
                  value={areaDescriptions[area]}
                  onChange={(e) =>
                    setAreaDescriptions({
                      ...areaDescriptions,
                      [area]: e.target.value
                    })
                  }
                  placeholder="Editar descripción"
                />
                <button onClick={handleSaveEdit}>Guardar</button>
              </div>
            ) : (
              <>
                <h3>{editedCardNames[area] || area}</h3>
                <p><strong>Descripción:</strong> {areaDescriptions[area] || "Sin descripción"}</p>
                <div className="button-group">
                  <button className="edit-button" onClick={() => handleEditCard(area)}>Editar</button>
                  <button className="delete-button" onClick={() => handleDeleteCard(area)}>Eliminar</button>
                  <button className="category-button" onClick={() => openCategoryModal(area)}>Agregar Categoría</button>
                </div>
              </>
            )}

            {areaCategories[area]?.length > 0 && (
              <div className="category-list">
                <h4>Categorías:</h4>
                {areaCategories[area].map((cat, i) => (
                  <div key={i} className="category-item">
                    <strong>{cat.name}</strong> - {cat.description}
                    <ul>
                      {cat.levels.map((lvl, idx) => (
                        <li key={idx}>{lvl}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal para nueva área */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={() => setShowModal(false)}>✖</button>
            <h3>Agregar Nueva Área</h3>
            <input
              type="text"
              placeholder="Nombre del Área"
              value={newArea}
              onChange={(e) => setNewArea(e.target.value)}
            />
            <input
              type="text"
              placeholder="Descripción del Área"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
            />
            <button className="save-button" onClick={handleAddArea}>Guardar</button>
          </div>
        </div>
      )}

      {/* Modal para categorías */}
      {showCategoryModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={() => setShowCategoryModal(false)}>✖</button>
            <h3>Agregar Categorías</h3>
            <input
              type="text"
              placeholder="Nombre de categoría"
              value={customCategoryName}
              onChange={(e) => setCustomCategoryName(e.target.value)}
            />
            <label>Descripción</label>
            <div className="checkbox-grid">
              {categoryOptions.map((category) => (
                <label key={category} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCheckboxChange(category)}
                  />
                  {category}
                </label>
              ))}
            </div>
            <button className="save-button" onClick={handleSaveCategories}>Guardar Categorías</button>
          </div>
        </div>
      )}
      <div className="button-group">
        <button type="submit" className="siguiente" onClick={handleSiguiente}>
          Publicar
        </button>
        <button type="button" className="cancelar" onClick={handleCancelar}>
          Cancelar
        </button>
        <button
          onClick={handleMostrarJSON}
          className="boton"
        >Mostrar JSON</button>
      </div>
    </div>

  );
};

export default Area;
