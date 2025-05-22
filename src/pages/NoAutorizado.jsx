import React from 'react';
import { Link } from 'react-router-dom';

const NoAutorizado = () => {
    return (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h1>🚫 Acceso Denegado</h1>
            <p>No tienes permiso para acceder a esta página.</p>
            <Link to="/">Volver al inicio</Link>
        </div>
    );
};

export default NoAutorizado;
