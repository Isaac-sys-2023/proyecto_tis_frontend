import React, { useEffect, useState, useContext } from "react";
import "./styles/Categoria.css";
import { useLocation, useNavigate } from "react-router-dom";
//import { ConvocatoriaContext } from "../context/ConvocatoriaContext";

const iconStyle = { cursor: "pointer", marginLeft: "10px" };
const apiUrl = import.meta.env.VITE_API_URL;

export default function ac() {
  //const { convocatoria } = useContext(ConvocatoriaContext);
  const location = useLocation();
  const idConvocatoria = location.state.idConvocatoria;
  const datosAreas = location.state.areas;
  const maxPost = location.state.maxPost;


  const navigate = useNavigate();


  const [areas, setAreas] = useState([]);
  const [selectedAreas, setSelectedAreas] = useState([]); // Ahora es un array
  const [showAreaModal, setShowAreaModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingArea, setEditingArea] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formArea, setFormArea] = useState({ name: "", description: "" });
  const [newDescription, setNewDescription] = useState("");
  const [categoryOptions, setCategoryOptions] = useState([]);
  //const [idConvocatoria, setIdConvocatoria] = useState("123");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [formCategory, setFormCategory] = useState({ name: "", options: [], monto: 0, areaId: null });

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const [resAreas, resCursos] = await Promise.all([
          fetch(`${apiUrl}/todasAreas`),
          fetch(`${apiUrl}/vercursos`),
        ]);

        const dataAreas = await resAreas.json();
        const dataCursos = await resCursos.json();

        const areasConCategorias = dataAreas.map((area) => ({
          id: area.idArea,
          name: area.tituloArea,
          description: area.descArea,
          categories: area.categorias?.map((cat) => ({
            id: cat.idCategoria,
            name: cat.nombreCategoria,
            options: cat.descCategoria?.split(",").map((opt) => opt.trim()) || [],
          })) || [],
        }));

        const dataTransformada = datosAreas.map((area) => ({
          id: area.idArea,
          name: area.tituloArea,
          description: area.descArea,
          categories: area.categorias.map((cat) => ({
            id: cat.idCategoria,
            name: cat.nombreCategoria,
            options: cat.cursos.map((curso) => curso.Curso),
            monto: parseFloat(cat.montoCate)
          }))
        }));

        // Crear un mapa para las áreas seleccionadas por id
        const mapSelected = new Map(dataTransformada.map(area => [area.id, area]));
        console.log(mapSelected);
        
        // Mapear el backendAreas reemplazando cuando haya coincidencia
        const mergedAreas = areasConCategorias.map(area => {
          return mapSelected.get(area.id) || area;
        });

        setAreas(mergedAreas);
        setCategoryOptions(dataCursos.map((curso) => curso.Curso));

        const areasSeleccionadas = dataTransformada.map(area => area.id);
        setSelectedAreas(areasSeleccionadas);
        
      } catch (err) {
        console.error("Error cargando datos:", err);
      }
    };

    fetchDatos();
  }, []);

  const handleAddArea = () => {
    setFormArea({ name: "", description: "" });
    setEditingArea(null);
    setShowAreaModal(true);
  };

  const handleEditArea = (area) => {
    setFormArea({ name: area.name, description: area.description });
    setEditingArea(area);
    setShowAreaModal(true);
  };

  const handleSaveArea = () => {
    if (editingArea) {
      setAreas(areas.map((a) => a.id === editingArea.id ? { ...a, ...formArea } : a));
    } else {
      const newArea = {
        id: Date.now(),
        name: formArea.name,
        description: formArea.description,
        categories: [],
      };
      setAreas([...areas, newArea]);
    }
    setShowAreaModal(false);
  };

  const handleDeleteArea = (id) => {
    setAreas(areas.filter((a) => a.id !== id));
    setSelectedAreas(selectedAreas.filter((areaId) => areaId !== id));
  };

  const handleAddCategory = (areaId) => {
    setFormCategory({ name: "", options: [], monto: 0, areaId });
    setEditingCategory(null);
    setSelectedCategories([]);
    setNewDescription("");
    setShowCategoryModal(true);
  };

  const handleEditCategory = (category, areaId) => {
    setFormCategory({ name: category.name, options: category.options, monto: category.monto || 0, areaId });
    setEditingCategory(category);
    setSelectedCategories(category.options);
    setNewDescription(category.options.join(", "));
    setShowCategoryModal(true);
  };

  const handleDeleteCategory = (catId, areaId) => {
    const updated = areas.map((area) =>
      area.id === areaId
        ? { ...area, categories: area.categories.filter((c) => c.id !== catId) }
        : area
    );
    setAreas(updated);
  };

  const handleSaveCategory = () => {
    const newOptions = newDescription.split(",").map(opt => opt.trim());
    const newCat = {
      id: editingCategory ? editingCategory.id : Date.now(),
      name: formCategory.name,
      options: newOptions,
      monto: formCategory.monto,
    };

    const updatedAreas = areas.map((area) => {
      if (area.id === formCategory.areaId) {
        const updatedCategories = editingCategory
          ? area.categories.map((cat) => (cat.id === editingCategory.id ? newCat : cat))
          : [...area.categories, newCat];
        return { ...area, categories: updatedCategories };
      }
      return area;
    });

    setAreas(updatedAreas);
    setShowCategoryModal(false);
    setSelectedCategories([]);
  };

  const handleCheckboxChange = (category) => {
    let updated;
    if (selectedCategories.includes(category)) {
      updated = selectedCategories.filter(c => c !== category);
    } else {
      updated = [...selectedCategories, category];
    }
    setSelectedCategories(updated);
    setNewDescription(updated.join(", "));
  };

  const handleSelectArea = (e) => {
    const id = Number(e.target.value);
    if (id && !selectedAreas.includes(id)) {
      setSelectedAreas([...selectedAreas, id]);
    }
  };

  const generarJSONFinal = () => {
    const json = {
      //convocatoria,
      areas: areas
        .filter((a) => selectedAreas.includes(a.id)) // Filtramos las áreas seleccionadas
        .map((a) => ({
          tituloArea: a.name, // Título del área
          descArea: a.description, // Descripción del área
          habilitada: true, // Habilitación del área
          categorias: a.categories.map((cat) => ({
            nombreCategoria: cat.name, // Nombre de la categoría
            descCategoria: cat.options.join(", "), // Descripción de la categoría (con los niveles)
            montoCate: cat.monto, // Monto de la categoría (que asumo existe en tus datos)
            maxPost: maxPost
          }))
        }))
    };

    console.log("JSON Final:", JSON.stringify(json, null, 2));
    return json;
  };


  const handleMostrarJSON = () => {
    generarJSONFinal();
    alert("Revisa la consola (F12) para ver el JSON generado.");
  };

  const handlePublicar = async (e) => {
    e.preventDefault();

    if (!idConvocatoria) {
      alert("ID de convocatoria no disponible");
      return;
    }

    // Estructura que enviarás en el cuerpo de la solicitud
    const payload = {
      areas: areas
        .filter((a) => selectedAreas.includes(a.id)) // Filtramos las áreas seleccionadas
        .map((a) => ({
          tituloArea: a.name, // Título del área
          descArea: a.description, // Descripción del área
          habilitada: true, // Habilitación del área
          categorias: a.categories.map((cat) => ({
            nombreCategoria: cat.name, // Nombre de la categoría
            descCategoria: cat.options.join(", "), // Descripción de la categoría (con los niveles)
            montoCate: cat.monto, // Monto de la categoría (que asumo existe en tus datos)
            maxPost: maxPost
          }))
        }))
    };

    try {
      const res = await fetch(`${apiUrl}/editcatconvocatorias/${idConvocatoria}/areas-categorias`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Estructura actualizada con éxito ✅");
        console.log("Respuesta del servidor:", data);
      } else {
        alert(`Error al actualizar estructura: ${data.error || data.message}`);
        return;
      }

      navigate('/detalle-convocatoria');
    } catch (error) {
      alert("Error de red al guardar la estructura");
      console.error(error);
    }
  };



  return (
    <div className="container-Area">
      <div className="title-area">
        <h2>Áreas de competencia</h2>
      </div>

      <select onChange={handleSelectArea}>
        <option value="">Seleccione un área</option>
        {areas.map((a) => (
          <option key={a.id} value={a.id}>
            {a.name}
          </option>
        ))}
      </select>

      <button onClick={handleAddArea}>+ Área</button>

      <div className="area-cards-container">
        {selectedAreas.map((areaId) => {
          const area = areas.find((a) => a.id === areaId);
          if (!area) return null;
          return (
            <div key={area.id} className="area-card-area">
              <strong>Área: {area.name}</strong>
              <span onClick={() => handleEditArea(area)} style={iconStyle}>✏️</span>
              <span onClick={() => handleDeleteArea(area.id)} style={iconStyle}>🗑️</span>
              <p>{area.description}</p>
              <button onClick={() => handleAddCategory(area.id)}>+ Categorías</button>
              {area.categories.map((cat) => (
                <div key={cat.id} style={{ marginLeft: "10px", marginTop: "5px" }}>
                  <b>{cat.name}    Bs. {cat.monto}</b>
                  <span onClick={() => handleEditCategory(cat, area.id)} style={iconStyle}>✏️</span>
                  <span onClick={() => handleDeleteCategory(cat.id, area.id)} style={iconStyle}>🗑️</span>
                  <p>{cat.options.join(", ")}</p>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {showAreaModal && (
        <div className="modal-area">
          <div className="modal-content-area">
            <span className="close-modal-area" onClick={() => setShowAreaModal(false)}>❌</span>
            <h3>{editingArea ? "Editar Área" : "Agregar Área"}</h3>
            <input placeholder="Nombre área" value={formArea.name} onChange={(e) => setFormArea({ ...formArea, name: e.target.value })} />
            <textarea placeholder="Descripción área" value={formArea.description} onChange={(e) => setFormArea({ ...formArea, description: e.target.value })} />
            <button onClick={handleSaveArea}>Guardar</button>
          </div>
        </div>
      )}

      {showCategoryModal && (
        < div className="modal-area">
          <div className="modal-content-area">
            <span className="close-modal-area" onClick={() => setShowCategoryModal(false)}>❌</span>
            <h3>{editingCategory ? "Editar Categoría" : "Agregar Categoría"}</h3>
            <label>Nombre de la categoría:</label>
            <input
              type="text"
              value={formCategory.name}
              onChange={(e) => setFormCategory({ ...formCategory, name: e.target.value })}
            />
            <label>Monto:</label>
            <input
              type="number"
              min="0"
              value={formCategory.monto}
              onChange={(e) => setFormCategory({ ...formCategory, monto: Number(e.target.value) })}
            />

            <label>Descripción de la categoría:</label>
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

            <button onClick={handleSaveCategory}>Guardar Categoría</button>
          </div>
        </div>
      )}

      <div className="actions">
        <button onClick={handleMostrarJSON}>Ver JSON en consola</button>
        <button onClick={handlePublicar}>Actualizar estructura</button>
        <button onClick={()=>navigate("/detalle-convocatoria")}>Salir</button>
      </div>
    </div>
  );
}
