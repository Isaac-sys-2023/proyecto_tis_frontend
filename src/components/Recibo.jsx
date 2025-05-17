// Recibo.jsx
import React, { useState, useRef } from 'react';
import Tesseract from 'tesseract.js';
import './styles/Recibo.css';
import { useLocation, useNavigate } from 'react-router-dom';


const Recibo = () => {
  const location = useLocation();
  const orden = location.state.orden;
  const tutorGuardado = JSON.parse(localStorage.getItem('tutor'));
  const navigate = useNavigate();

  const [idRecibo, setIdRecibo] = useState('');
  const [imagen, setImagen] = useState(null);
  const [textoExtraido, setTextoExtraido] = useState('');
  const [procesandoOCR, setProcesandoOCR] = useState(false);
  const [mensajeCoincidencia, setMensajeCoincidencia] = useState('');
  const inputCamaraRef = useRef(null);
  const [imagenSubida, setImagenSubida] = useState(false);


  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagen(file);
      setImagenSubida(true);
      extraerTextoOCR(file);
    }
  };

  const extraerTextoOCR = (file) => {
    setProcesandoOCR(true);
    setTextoExtraido('');
    setMensajeCoincidencia('');

    console.log(tutorGuardado);
    console.log(orden);



    Tesseract.recognize(
      file,
      'spa',
      { logger: (m) => console.log(m) }
    ).then(({ data: { text } }) => {
      console.log('Texto detectado:', text);
      setTextoExtraido(text);
      setProcesandoOCR(false);

      if (idRecibo.trim() !== '') {
        if (text.includes(idRecibo)) {
          setMensajeCoincidencia('✅ El ID fue encontrado en la imagen.');
          const textPlano = text.toLowerCase();
          console.log(textPlano);

          const tutor = tutorGuardado.nombreTutor + " " + tutorGuardado.apellidoTutor;
          console.log(tutor.toLowerCase());

          if (textPlano.includes(tutor.toLowerCase()) && textPlano.includes(orden.montoTotal)) {
            setMensajeCoincidencia('✅ El ID fue encontrado en la imagen y coincide con el tutor y orden de pago');
          } else {
            setMensajeCoincidencia('❌ El ID fue encontrado en la imagen pero no coincide con el tutor o la orden de pago. Por favor suba una imagen mas clara o la imagen correcta.');
          }

        } else {
          setMensajeCoincidencia('❌ El ID no se encontró en la imagen por favor suba la imagen correcta .');

        }
      } else {
        setMensajeCoincidencia('⚠️ Por favor, escribe un ID antes de subir la imagen.');
      }


    }).catch((err) => {
      console.error('Error al procesar OCR:', err);
      setProcesandoOCR(false);
      setMensajeCoincidencia('❌ Error al procesar la imagen.');
    });
  };


  const handleImportar = async () => {
    if (!idRecibo || !imagen) {
      alert('Por favor, ingresa un ID de recibo y sube una imagen.');
      return;
    }
    console.log('Importando recibo con ID:', idRecibo, 'y archivo:', imagen);

    const formData = new FormData();
    formData.append('id', idRecibo);
    formData.append('idOrdenPago', orden.idOrdenPago);
    formData.append('imagen_comprobante', imagen);


    try {
      const response = await fetch('http://localhost:8000/api/recibos', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error al registrar el recibo:`, errorText);
        return;
      }

      const { idOrdenPago, ...datos } = orden;
      datos.cancelado = true;
      try {
        const respuesta = await fetch(`http://localhost:8000/api/ordenpago/${orden.idOrdenPago}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(datos)
        });

        const resultado = await respuesta.json();

        if (!respuesta.ok) {
          throw new Error(resultado.message || 'Error al actualizar la orden');
        }

        console.log('Orden actualizada:', resultado.orden);
      } catch (error) {
        console.error('Error:', error.message);
        alert('Hubo un problema al actualizar la orden de pago');
      }

      navigate("/ordenes-pago");
    } catch (error) {
      console.error(`Error al registrar el recibo:`, error);
    }
  };

  const handleEliminarImagen = () => {
    setImagen(null);
    setImagenSubida(false);
    setTextoExtraido('');
    setMensajeCoincidencia('');

  };

  return (
    <div className="recibo-container">
      <h2 className="recibo-titulo">RECIBO</h2>

      <label className="recibo-label">ID del Recibo:</label>

      <input
        type="text"
        value={idRecibo}
        onChange={(e) => setIdRecibo(e.target.value)}
        className="recibo-input"
      />

      {mensajeCoincidencia && (
        <p style={{
          marginTop: '5px',
          fontWeight: 'bold',
          color: mensajeCoincidencia.includes('✅')
            ? 'green'
            : mensajeCoincidencia.includes('❌')
              ? 'red'
              : 'orange'
        }}>
          {mensajeCoincidencia}
        </p>
      )}

      <div className="recibo-upload-area">

        {!imagenSubida && (
          <div className="recibo-icono">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRxNdcnkpvPuXk-3JXJzM1l-0tdpu3PTo1k52Vl1G3GVH1o7-VM0YyxIJd4fBfuZY6lX0&usqp=CAU"
              alt="Subir"
              className="icono-imagen"
            />
          </div>
        )}

        <div className="recibo-botones">
          {!imagenSubida && (
            <label className="btn-subir">
              <input type="file" onChange={handleImagenChange} hidden />
              📤 Subir foto
            </label>

          )}
        </div>
      </div>

      {/* Vista previa de imagen */}

      {imagen && (
        <div style={{ marginBottom: '20px' }}>
          <p>Vista previa:</p>
          <img
            src={URL.createObjectURL(imagen)}
            alt="Vista previa"
            style={{
              maxWidth: '100%',
              height: 'auto',
              borderRadius: '10px',
              boxShadow: '0 0 10px rgba(0,0,0,0.1)',
              marginBottom: '10px',
            }}
          />
          <br />
          <button onClick={handleEliminarImagen} className="btn-eliminar">
            ❌ Quitar imagen
          </button>
        </div>
      )}

      {procesandoOCR && <p>🔄 Procesando imagen con OCR...</p>}

      {textoExtraido && (
        <div className="texto-extraido">
          <p><strong>Texto extraído de la imagen:</strong></p>
          <pre>{textoExtraido}</pre>
        </div>
      )}


      <button className="btn-importar" onClick={handleImportar}>
        Enviar
      </button>
    </div>
  );
};

export default Recibo;

