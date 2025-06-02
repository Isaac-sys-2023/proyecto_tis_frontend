import React, { useState } from 'react';
import './styles/RecuperarContrasena.css';
import SpinnerInsideButton from '../components/SpinnerInsideButton';

const apiUrl = import.meta.env.VITE_API_URL;

const RecuperarContrasena = () => {
  const [email, setEmail] = useState('');
  const [verificado, setVerificado] = useState(false);
  const [token, setToken] = useState('');
  const [nueva, setNueva] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [mostrar, setMostrar] = useState(false);

  const [cargando, setCargando] = useState(false);

  // Enviar correo para reset
  const handleVerificar = async (e) => {
    e.preventDefault();
    setCargando(true);
    try {
      const response = await fetch(`${apiUrl}/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Correo enviado. Revisa tu bandeja de entrada.');
        setVerificado(true);
      } else {
        alert(data.message || 'Error al enviar el correo');
      }
    } catch (error) {
      console.error('Error en la verificación:', error);
      alert('Error al enviar el correo. Intenta nuevamente.');
    } finally {
      setCargando(false);
    }
  };

  // Restablecer contraseña
  const handleCambio = async (e) => {
    e.preventDefault();
    setCargando(true);

    if (nueva !== confirmar) {
      alert('Las contraseñas no coinciden');
      setCargando(false);
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          token,
          email,
          password: nueva,
          password_confirmation: confirmar,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Contraseña actualizada correctamente');
        setVerificado(false);
        setEmail('');
        setNueva('');
        setConfirmar('');
        setToken('');
      } else {
        console.log('Error detalle:', data);
        alert(data.message || 'Error al actualizar la contraseña');
      }
    } catch (error) {
      console.error('Error en el cambio de contraseña:', error);
      alert('Error al actualizar la contraseña. Intenta nuevamente.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="recuperar-container">
      {!verificado ? (
        <>
          <h2>¿Has olvidado la contraseña?</h2>
          <form onSubmit={handleVerificar} className="recuperar-form">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={cargando}
            />
            <p>Se enviará un enlace de restablecimiento a este email</p>
            <button type="submit" disabled={cargando}>Enviar  {cargando ? <span><SpinnerInsideButton /></span> : ""}</button>
          </form>
        </>
      ) : (
        <>
          <h2>Restablecer contraseña</h2>
          <form onSubmit={handleCambio} className={cargando ? "recuperar-form divDeshabilitado" : "recuperar-form"}>
            <label>Token recibido por correo *</label>
            <input
              type="text"
              required
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />

            <label>Email *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label>Nueva contraseña *</label>
            <div className="input-con-icono">
              <input
                type={mostrar ? 'text' : 'password'}
                required
                value={nueva}
                onChange={(e) => setNueva(e.target.value)}
              />
              <span onClick={() => setMostrar(!mostrar)}>👁️</span>
            </div>

            <label>Confirmar nueva contraseña *</label>
            <div className="input-con-icono">
              <input
                type={mostrar ? 'text' : 'password'}
                required
                value={confirmar}
                onChange={(e) => setConfirmar(e.target.value)}
              />
              <span onClick={() => setMostrar(!mostrar)}>👁️</span>
            </div>

            <button type="submit" className='button-restablecer-c'>Restablecer contraseña  {cargando ? <span><SpinnerInsideButton /></span> : ""}</button>
          </form>
        </>
      )}
    </div>
  );
};

export default RecuperarContrasena;
