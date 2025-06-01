import React from 'react';
import "./styles/TipoInscripcion.css"
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

const TipoInscripcion = () => {
    const { idConvocatoria } = useParams();

    const navigate = useNavigate();

    const [isMobile, setIsMobile] = useState(window.innerWidth < 480);

    useEffect(() => {
        // const handleResize = () => setIsMobile(window.innerWidth < 480);
        // window.addEventListener('resize', handleResize);
        // handleResize();
        // return () => window.removeEventListener('resize', handleResize);
        const mediaQuery = window.matchMedia('(max-width: 480px)');
        const updateIsMobile = () => setIsMobile(mediaQuery.matches);

        updateIsMobile();
        mediaQuery.addEventListener('change', updateIsMobile);

        return () => mediaQuery.removeEventListener('change', updateIsMobile);
    }, []);

    const handleManual = () => {
        navigate(`/convocatoria/${idConvocatoria}/inscripcion-manual`);
    }

    //Excel
    const handleExcel = () => {
        navigate(`/convocatoria/${idConvocatoria}/inscripcion-excel`);
    }

    return (
        <div className="container-tipo">
            <h1 className="title-tipo">Puede registrar al postulante(s) mediante:</h1>
            <div className="buttons-tipo">
                <div className='button-tipo' onClick={isMobile ? handleExcel : undefined}>
                    <h1>{isMobile ? 'Excel' : 'Planilla de Excel'}</h1>
                    <button className="image-button" onClick={handleExcel}>
                        <img src="/ExcelImage.png" alt="Mediante Excel" />
                    </button>
                </div>
                <div className='button-tipo' onClick={isMobile ? handleManual : undefined}>
                    <h1>{isMobile ? 'Manual' : 'Manualmente'}</h1>
                    <button className="image-button" onClick={handleManual}>
                        <img src="/ManoImage.png" alt="Manualmente" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default TipoInscripcion;