import React, { useState, useEffect } from "react";
import "./styles/ImageUpload.css";

const ImageUpload = ({ onFileSelect, imagenInicial }) => {
  const [preview, setPreview] = useState(null);
  const [dragging, setDragging] = useState(false);


  useEffect(() => {
    // Si no hay una nueva imagen, pero hay una imagen inicial, se muestra como preview
    if (imagenInicial && !preview) {
      setPreview(imagenInicial);
    }
  }, [imagenInicial, preview]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    processFile(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files[0];
    processFile(file);
  };

  const processFile = (file) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        onFileSelect(file, reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Por favor, selecciona un archivo de imagen válido.");
    }
  };

  return (
    <div
      className={`image-upload-container ${dragging ? "dragging" : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <label className="upload-box">
        {preview ? (
          <img src={preview} alt="Vista previa" className="preview-image" />
        ) : (
          <div className="upload-placeholder">
            <span className="upload-icon">⬆️</span>
            <p>Arrastre y suelte los archivos aquí o haga clic para seleccionarlos</p>
          </div>
        )}
        <input type="file" accept="image/*" onChange={handleFileChange} className="file-input" />
      </label>
    </div>
  );
};

export default ImageUpload;


