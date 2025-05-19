
import React, { useState, useEffect } from 'react'

import "./styles/Disciplinas.css"
import { useNavigate } from 'react-router-dom';

const apiUrl = import.meta.env.VITE_API_URL;

const Convocatorias = () => {
    const navigate = useNavigate();

    const [convocatorias, setConvocatorias] = useState([]);

    useEffect(() => { //para hacer un get
        fetch(`${apiUrl}/todasconvocatorias`)
            .then(response => response.json())
            // .then(data => setConvocatorias(data))
            .then(data => {
                const convocatoriasHabilitadas = data.filter(conv => ((conv.habilitada === 1 || conv.habilitada === true) && (conv.eliminado === 0 || conv.eliminado === false)));
                setConvocatorias(convocatoriasHabilitadas);
                console.log("Convocatorias:", convocatoriasHabilitadas);
            })
            .catch(error => console.error("Error al obtener convocatorias:", error));
    }, []);


    const handleInscripcion = (idConvocatoria) => {
        navigate(`/convocatoria/${idConvocatoria}/tipo-inscripcion`);
    };

    return (
        <div className="Disciplina">

            <div className="grid-container">
                {convocatorias.map((convocatoria, index) => (
                    <div key={index} className="card">
                        <img src={convocatoria.portada} alt={convocatoria.titulo} className="imagen" />

                        <h3>{convocatoria.tituloConvocatoria}</h3>

                        <button onClick={() => handleInscripcion(convocatoria.idConvocatoria)}>Inscribirse</button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Convocatorias;