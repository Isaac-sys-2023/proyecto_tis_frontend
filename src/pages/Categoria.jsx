// IMPORTACIONES
import React, { useEffect, useState } from "react";
import "./styles/Categoria.css";
import { useLocation, useNavigate } from "react-router-dom";

// ESTILO DE ÍCONOS
const iconStyle = { cursor: "pointer", marginLeft: "10px" };
const apiUrl = import.meta.env.VITE_API_URL;

// COMPONENTE PRINCIPAL
export default function Ac() {
  const location = useLocation();
  const idConvocatoria = location.state.idConvocatoria;
  const navigate = useNavigate();

  const [areas, setAreas] = useState([]);
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [showAreaModal, setShowAreaModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingArea, setEditingArea] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formArea, setFormArea] = useState({ name: "", description: "" });
  const [newDescription, setNewDescription] = useState("");
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [formCategory, setFormCategory] = useState({ name: "", options: [], monto: 0, areaId: null });
  const [expandedAreas, setExpandedAreas] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState([]);

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
            monto: cat.montoCate || 0
          })) || [],
        }));
        setAreas(areasConCategorias);
        setCategoryOptions(dataCursos.map((curso) => curso.Curso));
      } catch (err) {
        console.error("Error cargando datos:", err);
      }
    };
    fetchDatos();
  }, []);

  const toggleExpandArea = (id) => {
    setExpandedAreas(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };
  const toggleExpandCategory = (id) => {
    setExpandedCategories(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

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
    if (!formArea.name.trim() || !formArea.description.trim()) {
      alert("Todos los campos del área son obligatorios");
      return;
    }
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
    if (!formCategory.name.trim() || selectedCategories.length === 0 || !formCategory.monto) {
      alert("Debe llenar todos los campos y seleccionar al menos una opción");
      return;
    }
    const newCat = {
      id: editingCategory ? editingCategory.id : Date.now(),
      name: formCategory.name,
      options: selectedCategories,
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
    const updated = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    setSelectedCategories(updated);
    setNewDescription(updated.join(", "));
  };

  const handleSelectArea = (e) => {
    const id = Number(e.target.value);
    if (id && !selectedAreas.includes(id)) {
      setSelectedAreas([...selectedAreas, id]);
    }
  };

  const handleCancelar = () => {
    navigate("/detalle-convocatoria");
  };


  const handlePublicar = async (e) => {
    e.preventDefault();
  
    if (!idConvocatoria) {
      alert("ID de convocatoria no disponible");
      return;
    }
    const payload = {
      areas: areas
        .filter((a) => selectedAreas.includes(a.id))
        .map((a) => ({
          tituloArea: a.name,
          descArea: a.description,
          habilitada: true,
          categorias: a.categories.map((cat) => ({
            nombreCategoria: cat.name,
            descCategoria: cat.options.join(", "),
            montoCate: cat.monto
          }))
        }))
    };
    try {
      const res = await fetch(`${apiUrl}/convocatoria/${idConvocatoria}/estructura`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Estructura publicada con éxito");
        navigate(`/crear-convocatoria/${idConvocatoria}/tablaNotif`);
      } else {
        alert(`Error al guardar estructura: ${data.error || data.message}`);
      }
    } catch (error) {
      alert("Error de red al guardar la estructura");
      console.error(error);
    }
  };

  return (
    <div className="container-Area">
      <h2>Áreas de competencia</h2>
      <select className="Seleccion" onChange={handleSelectArea}>
        <option value="">Seleccione un área</option>
        {areas.map((a) => (
          <option key={a.id} value={a.id}>{a.name}</option>
        ))}
      </select>

      <button onClick={handleAddArea}>+ Área</button>

      <div className="area-cards-container">
        {selectedAreas.map((areaId) => {
          const area = areas.find((a) => a.id === areaId);
          if (!area) return null;
          const isExpanded = expandedAreas.includes(areaId);
          return (
            <div key={area.id} className="area-card-area">
              <div className="area-name-header">
                <div className="area-name" onClick={() => toggleExpandArea(area.id)} style={{ cursor: "pointer" }}>
                  {isExpanded ? "▼" : "▶"} Área: {area.name}
                </div>
                <div className="area-icons">
                  <span onClick={() => handleEditArea(area)} style={iconStyle}>✏️</span>
                  <span onClick={() => handleDeleteArea(area.id)} style={iconStyle}>🗑️</span>
                </div>
              </div>
              {isExpanded && (
                <>
                  <p>{area.description}</p>
                  <button onClick={() => handleAddCategory(area.id)}>+ Categorías</button>
                  {area.categories.map((cat) => {
                    const isCatExpanded = expandedCategories.includes(cat.id);
                    return (
                      <div key={cat.id} style={{ marginLeft: "10px", marginTop: "5px" }}>
                        <div className="category-name-header">
                          <div className="category-name" onClick={() => toggleExpandCategory(cat.id)} style={{ cursor: "pointer" }}>
                            {isCatExpanded ? "▼" : "▶"} {cat.name} Bs. {cat.monto}
                          </div>
                          <div className="category-icons">
                            <span onClick={() => handleEditCategory(cat, area.id)} style={iconStyle}>✏️</span>
                            <span onClick={() => handleDeleteCategory(cat.id, area.id)} style={iconStyle}>🗑️</span>
                          </div>
                        </div>
                        {isCatExpanded && <p>{cat.options.join(", ")}</p>}
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* MODAL ÁREA */}
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

      {/* MODAL CATEGORÍA */}
      {showCategoryModal && (
        <div className="modal-cat">
          <div className="modal-content-cat">
            <span className="close-modal-cat" onClick={() => setShowCategoryModal(false)}>❌</span>
            <h3>{editingCategory ? "Editar Categoría" : "Agregar Categoría"}</h3>
            <input placeholder="Nombre categoría" value={formCategory.name} onChange={(e) => setFormCategory({ ...formCategory, name: e.target.value })} />
            <input type="number" placeholder="Monto" value={formCategory.monto} onChange={(e) => setFormCategory({ ...formCategory, monto: Number(e.target.value) })} />
            <p>Opciones:</p>
            {categoryOptions.map((opt) => (
              <div key={opt}>
                <input type="checkbox" checked={selectedCategories.includes(opt)} onChange={() => handleCheckboxChange(opt)} />
                <label>{opt}</label>
              </div>
            ))}
            <button onClick={handleSaveCategory}>Guardar Categoría</button>
          </div>
        </div>
      )}
        <div className="botones-finales">
           <button onClick={handlePublicar} className="publicar-btn">Siguiente</button>
           <button type="button" className="cancelar" onClick={handleCancelar}>
             Cancelar
           </button>
          </div>
        </div>
  );
}
