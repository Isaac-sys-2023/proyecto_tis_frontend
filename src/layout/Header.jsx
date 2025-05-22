import React from "react";
import "./Header.css";
import Navbar from "./Navbar";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = () => {
    //const user = JSON.parse(localStorage.getItem('user'));
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="header">
            <div className="logo">
                <img src="/UmssLogo.png" alt="Umss Logo" />
                <div className="title-container">
                    <h1 className="title">Oh! SanSi</h1>
                    <p className="subtitle">Olimpiadas Científicas Oh SanSi</p>
                </div>
            </div>
            <div className="buttons">
                <Link to="/" className="boton-header">Inicio</Link>
                <button className="boton-header">Nosotros</button>
                {/* <button className="boton-header">Eventos</button>
                <Link to="/disciplinas" className="boton-header">Areas</Link> */}
    
                {user && (
                    <>
                        <Link to="/convocatorias" className="boton-header">Inscripciones</Link>
                        <Link to="/ordenes-pago" className="boton-header">Mis Pagos</Link>
                    </>                  
                )}

                {/* <button className="boton-header">Iniciar Sesion</button> */}
                {user ? (
                    <>
                        <span className="boton-header">Hola, {user.name}</span>
                        <button
                            className="boton-header"
                            onClick={() => {
                                // localStorage.removeItem('token');
                                // localStorage.removeItem('user');
                                // localStorage.removeItem('tutor');
                                logout();
                                navigate('/login');
                            }}
                        >
                            Cerrar sesión
                        </button> 
                    </>

                ) : (
                    <Link to="/login" className="boton-header">Iniciar Sesión</Link>
                )}
            </div>
        </div>
    );
}

export default Header;
