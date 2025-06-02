import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

import "./styles/PruebaLogin.css";

import { useAuth } from '../context/AuthContext';

import SpinnerInsideButton from '../components/SpinnerInsideButton';

const apiUrl = import.meta.env.VITE_API_URL;

const PruebaLogin = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const [cargando, setCargando] = useState(false);

    const handleChange = (e) => {
        console.log('📝 [Login] Campo cambiado:', e.target.name, e.target.value);
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCargando(true);

        console.log('🔐 [Login] Enviando petición con:', formData);
        setError('');
        setSuccessMessage('');

        try {
            //const response = await axios.post('http://localhost:8000/api/login', formData);
            const response = await axios.post(`${apiUrl}/login`, formData);
            console.log('🔐 [Login] Response completo:', response);
            const { token, user } = response.data;

            console.log('🔐 [Login] token recibido:', token);
            console.log('🔐 [Login] usuario recibido:', user);

            // localStorage.setItem('token', token);
            // localStorage.setItem('user', JSON.stringify(user));
            // console.log('🔐 [Login] token y user guardados en localStorage');
            login(user, token)

            setSuccessMessage('Inicio de sesión exitoso.');
            console.log('Usuario logueado:', user);

            // if (user.rol.toLowerCase() === 'tutor' || user.rol.toLowerCase() === 'admin') {
            //     console.log('🔐 [Login] usuario es tutor, solicitando datos de tutor...');
            //     console.log("🔐 [Token enviado]:",token);
                
            //     const resTutor = await axios.get('http://localhost:8000/api/tutor', {
            //         headers: { Authorization: `Bearer ${token}` }
            //     });
            //     console.log('🔐 [Login] respuesta tutor:', resTutor);
            //     localStorage.setItem('tutor', JSON.stringify(resTutor.data.tutor));
            //     console.log('Tutor asociado:', resTutor.data.tutor);
            // }

            navigate("/");

        } catch (error) {
            console.error(error);
            if (error.response && error.response.data) {
                setError(error.response.data.message || 'Error al iniciar sesión.');
            } else {
                setError('Error de conexión.');
            }
        } finally {
            setCargando(false)
        }
    };

    return (
        <div className="login-page">
            <div className="login-box">
                <h2>INICIO DE SESION</h2>

                {successMessage && <div className="success-message">{successMessage}</div>}
                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit} className={cargando ? "divDeshabilitado" : ""}>
                    <label>Email:</label>
                    <input  type="email" name="email" value={formData.email} onChange={handleChange} required/>

                    <label>Contraseña:</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required/>

                    <div className="button-container">
                        <button type="submit" className="btn-iniciar">INICIAR  {cargando ? <span><SpinnerInsideButton/></span> : ""}</button>
                    </div>
                    <p> <Link to="/recuperacionC" className="btn-contraseña">¿Olvidaste tu contraseña ?</Link></p>
                    <p>¿No tienes una cuenta? <Link to="/registro-tutor" className="btn-registro">Regístrate aquí</Link></p>

                    
                </form>
            </div>
        </div>
    );
};

export default PruebaLogin;
