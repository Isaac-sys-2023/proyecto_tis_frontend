import React from 'react';
import "./styles/TipoInscripcion.css"
import { useNavigate, useParams } from 'react-router-dom';

const TipoInscripcion = () => {
    const { idConvocatoria } = useParams();

    const navigate = useNavigate();
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
                <div className='button-tipo'>
                    <h1>Planilla de Excel</h1>
                    <button className="image-button" onClick={handleExcel}>                    
                        <img src="/ExcelImage.png" alt="Mediante Excel" />
                    </button>
                </div>                
                <div className='button-tipo'>
                    <h1>Manualmente</h1>
                    <button className="image-button" onClick={handleManual}>                                      
                        <img src="/ManoImage.png" alt="Manualmente" />
                    </button>
                </div>                
            </div>
        </div>
    )
}

export default TipoInscripcion;