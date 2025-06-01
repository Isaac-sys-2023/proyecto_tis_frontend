import React from 'react';
import './styles/Spinner.css'; // O donde estén tus estilos
import { useEffect, useState } from 'react';

const FullScreenSpinner = () => {
    const [dots, setDots] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prev => (prev.length >= 3 ? '' : prev + '.'));
        }, 500); // actualiza cada 500ms

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fullscreen-spinner-container">
            <div className="spinner"></div>
            <h1 className="loading-text">Cargando{dots}</h1>
        </div>
    );
};

export default FullScreenSpinner;
