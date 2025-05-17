import React, { useEffect, useState } from 'react';
import './styles/RegistroPago.css';
import { useNavigate } from 'react-router-dom';

const Historial = () => {
  const navigate = useNavigate();

  const [ordenesPago, setOrdenesPago] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const tutorGuardado = JSON.parse(localStorage.getItem('tutor'));
    const idTutor = tutorGuardado?.idTutor;

    if (!idTutor) {
      console.warn("No se encontró idTutor en localStorage");
      setCargando(false);
      return;
    }

    const obtenerOrdenesPago = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/buscar-ordenes?query=${idTutor}`);
        const data = await response.json();

        if (data.length > 0 && data[0].ordenes_pago) {
          setOrdenesPago(data[0].ordenes_pago);
        } else {
          console.warn("No se encontraron órdenes para el tutor.");
        }
      } catch (error) {
        console.error("Error al obtener órdenes de pago:", error);
      } finally {
        setCargando(false);
      }
    };

    obtenerOrdenesPago();
  }, []);


  const handleSalir = () => {
    navigate("/");
  }

  const handlePagar = (orden) => {
    navigate("/Recibo", {
      state: { orden },
    });
  }

  return (
    <div className="formulario-pago-container">
      <div className="formulario-card">
        <div className="formulario-header">
          Ordenes de Pago
        </div>

        {cargando ? (
          <p>Cargando...</p>
        ) : ordenesPago.length > 0 ? (
          <div className="formulario-inputs">
            {ordenesPago.map((orden) => (
              <div className="formulario-row" key={orden.idOrdenPago}>
                <input 
                  type="text" 
                  disabled 
                  defaultValue={`Orden de Pago ${orden.idOrdenPago} Bs.- ${orden.montoTotal}`} 
                  className={
                    orden.cancelado 
                      ? 'input-valid' 
                      : new Date(orden.vigencia) < new Date()
                      ? 'input expired'
                      :'input-invalid'
                  } 
                />
                {!orden.cancelado && new Date(orden.vigencia) >= new Date() ? (
                  <button onClick={() => handlePagar(orden)}>Subir Recibo</button>
                ) : orden.cancelado ? (
                  <button disabled>Pagado</button>
                ) : (
                  <button disabled>Expirada</button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>No hay órdenes de pago registradas.</p>
        )}

        <div className="formulario-botones">
          <button
            className="cancelar-btn"
            onClick={() => { handleSalir() }}
          >
            Salir
          </button>
        </div>
      </div>
    </div>
  );
};

export default Historial;