import React, { useState } from "react";
import "./Header.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => setMenuOpen(!menuOpen);
    const closeMenu = () => setMenuOpen(false);

    const rol = user?.rol?.toLowerCase();
    const isTutor = rol === "tutor";
    const isAdmin = rol === "admin";
    const isLoggedIn = !!user;

    return (
        <header className="header">
            <div className="logo">
                <img src="/UmssLogo.png" alt="Umss Logo" />
                <div className="title-container">
                    <h1 className="title">Oh! SanSi</h1>
                    <p className="subtitle">Olimpiadas Científicas Oh SanSi</p>
                </div>
            </div>

            <div className={`menu-toggle ${menuOpen ? "open" : ""}`} onClick={toggleMenu}>
                <span></span><span></span><span></span>
            </div>

            <nav className={`buttons ${menuOpen ? "active" : ""}`}>
                {/* Siempre visibles */}
                <Link to="/" className="boton-header" onClick={closeMenu}>Inicio</Link>
                {!isLoggedIn && (
                    <Link to="/nosotros" className="boton-header" onClick={closeMenu}>Nosotros</Link>
                )}

                {/* Tutor y Administrador */}
                {isLoggedIn && (
                    <>
                        <Link to="/convocatorias" className="boton-header" onClick={closeMenu}>Inscripciones</Link>
                        <Link to="/ordenes-pago" className="boton-header" onClick={closeMenu}>Mis pagos</Link>
                    </>
                )}

                {/* Solo Administrador */}
                {isAdmin && (
                    <div className="dropdown">
                        <button className="boton-header">Gestión ▼</button>
                        <div className="dropdown-content">
                            <Link to="/detalle-convocatoria" onClick={closeMenu}>Convocatorias</Link>
                            <Link to="/colegios" onClick={closeMenu}>Colegios</Link>
                            <Link to="/addRoles" onClick={closeMenu}>Crear Rol</Link>
                            <Link to="/addUser" onClick={closeMenu}>Registrar Usuario</Link>
                            <Link to="/asignarRoles" onClick={closeMenu}>Asignar Roles</Link>
                            <Link to="/tablaRoles" onClick={closeMenu}>Gestionar Roles</Link>
                            <Link to="/tablaUsuarios" onClick={closeMenu}>Lista de Usuarios</Link>
                            <Link to="/listaRoles" onClick={closeMenu}>Lista de Roles</Link>
                            <Link to="/registroPago" onClick={closeMenu}>Ordenes de pago</Link>
                            <Link to="/reportes" onClick={closeMenu}>Reportes</Link>
                        </div>
                    </div>
                )}

                {/* Login / Logout y nombre */}
                {isLoggedIn ? (
                    <>
                        <span className="boton-header">Hola, {user.name}</span>
                        <button
                            className="boton-header"
                            onClick={() => {
                                logout();
                                navigate("/login");
                                closeMenu();
                            }}
                        >
                            Cerrar sesión
                        </button>
                    </>
                ) : (
                    <Link to="/login" className="boton-header" onClick={closeMenu}>Iniciar sesión</Link>
                )}
            </nav>
        </header>
    );
};

export default Header;
