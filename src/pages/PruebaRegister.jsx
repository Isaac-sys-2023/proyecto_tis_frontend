import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './styles/PruebaRegister.css';

const apiUrl = import.meta.env.VITE_API_URL;

const PruebaRegister = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        lastName: '',
        email: '',
        password: '',
        password_confirmation: '',
        telefono: '',
        fechaNacimiento: ''
    });

    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [mostrarContraseña, setMostrarContraseña] = useState(false); // Estado para controlar la visibilidad de la contraseña
    const [mostrarConfirmarContraseña, setMostrarConfirmarContraseña] = useState(false); // Estado para controlar la visibilidad de la confirmación de contraseña

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setSuccessMessage('');

        try {
            const response = await axios.post(`${apiUrl}/register`, formData);
            setSuccessMessage('Registro exitoso. Ahora puede iniciar sesión.');
            console.log('Usuario registrado:', response.data.user);

            setFormData({
                name: '',
                lastName: '',
                email: '',
                password: '',
                password_confirmation: '',
                telefono: '',
                fechaNacimiento: ''
            });
        } catch (error) {
            if (error.response && error.response.data.errors) {
                setErrors(error.response.data.errors);
            } else {
                console.error('Error desconocido', error);
            }
        }
    };

    const handleCancel = () => {
        setFormData({
            name: '',
            lastName: '',
            email: '',
            password: '',
            password_confirmation: '',
            telefono: '',
            fechaNacimiento: ''
        });
        setErrors({});
        navigate('/');
    };

    return (
        <div className="register-page">
            <div className="register-box">
                <h2>REGISTRO</h2>
                {successMessage && <div className="success-message">{successMessage}</div>}

                <form onSubmit={handleSubmit}>
                    <label htmlFor="name">Nombre</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} />
                    {errors.name && <small className="error">{errors.name[0]}</small>}

                    <label htmlFor="lastName">Apellido</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
                    {errors.lastName && <small className="error">{errors.lastName[0]}</small>}

                    <label htmlFor="email">Correo electrónico</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} />
                    {errors.email && <small className="error">{errors.email[0]}</small>}

                    <label htmlFor="password">Contraseña</label>
                    <input
                        type={mostrarContraseña ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    {errors.password && <small className="error">{errors.password[0]}</small>}
                    <span onClick={() => setMostrarContraseña(!mostrarContraseña)}>{mostrarContraseña ? '👁️' : '👁️'}</span>

                    <label htmlFor="password_confirmation">Confirmar contraseña</label>
                    <input
                        type={mostrarConfirmarContraseña ? 'text' : 'password'}
                        name="password_confirmation"
                        value={formData.password_confirmation}
                        onChange={handleChange}
                    />
                    <span onClick={() => setMostrarConfirmarContraseña(!mostrarConfirmarContraseña)}>{mostrarConfirmarContraseña ? '👁️' : '👁️'}</span>
                    {errors.password_confirmation && <small className="error">{errors.password_confirmation[0]}</small>}

                    <label htmlFor="telefono">Teléfono</label>
                    <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} />
                    {errors.telefono && <small className="error">{errors.telefono[0]}</small>}

                    <div className="form-group">
                        <label htmlFor="fechaNacimiento">Fecha de nacimiento</label>
                        <input type="date" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange} />
                        {errors.fechaNacimiento && <small className="error">{errors.fechaNacimiento[0]}</small>}
                    </div>

                    <div className="button-container">
                        <button type="submit" className="btn-registrarse">REGISTRARSE</button>
                        <button type="button" className="btn-cancelar" onClick={handleCancel}>CANCELAR</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PruebaRegister;


