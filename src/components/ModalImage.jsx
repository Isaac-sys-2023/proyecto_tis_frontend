// src/components/ModalImagen.jsx
import React from 'react';
import './styles/ModalImages.css';

const ModalImagen = ({ imagenUrl, onClose }) => {
  if (!imagenUrl) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✖</button>
        <img src={imagenUrl} alt="Comprobante" className="modal-image" />
      </div>
    </div>
  );
};

export default ModalImagen;
