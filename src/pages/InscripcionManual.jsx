import React, { useState } from 'react'
import DetalleInscripcion from '../components/DetalleInscripcion';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import Registro from '../components/Registro';

const InscripcionManual = () => {
    const { idConvocatoria } = useParams();

    const tutor = JSON.parse(localStorage.getItem('tutor'));

    const [registro, setRegistro] = useState(false);

    const [indexEdit, setIndexEdit] = useState(-1);
    const [estudianteEdit, setEstudianteEdit] = useState({});

    const navigate = useNavigate();

    const location = useLocation();
    const [estudiantes, setEstudiantes] = useState(location.state?.estudiantes || []);


    const [areasSeleccionadas, setAreasSeleccionadas] = useState([]);
    const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]);

    const handleRegistrar = (nuevoEstudiante) => {
        const areasFormateadas = areasSeleccionadas.map((area) => ({
            idArea: area.id,
            tituloArea: area.nombre,
            descArea: area.descripcion || "",
            habilitada: area.habilitada ?? true, // por defecto true si no existe
            idConvocatoria: area.idConvocatoria || idConvocatoria, // si se tiene disponible
        }));
        
        const categoriasFormateadas = categoriasSeleccionadas.map((categoria) => {
            let idAreaEncontrado = null;
            areasSeleccionadas.forEach((area) => {
                const categoriaEncontrada = area.categorias.find(
                    (cat) => cat.id === categoria.id
                );
                if (categoriaEncontrada) {
                    idAreaEncontrado = area.id; // Asignar el idArea de la categoría
                }
            });
            return {
                idCategoria: categoria.id,
                nombreCategoria: categoria.nombre,
                descripcionCategoria: categoria.descripcion || "", // si se requiere
                idArea: idAreaEncontrado, // Asignar el idArea encontrado
                monto: categoria.monto || 50,
            };
        });


        nuevoEstudiante.areas = areasFormateadas;
        nuevoEstudiante.categorias = categoriasFormateadas;
        setEstudiantes([...estudiantes, nuevoEstudiante]);

        setAreasSeleccionadas([]);
        setCategoriasSeleccionadas([]);
        setRegistro(false);  // Cambiar el estado de registro a false
    };

    const handleActualizar = (nuevoEstudiante) => {
        const areasFormateadas = areasSeleccionadas.map((area) => ({
            idArea: area.id,
            tituloArea: area.nombre,
            descArea: area.descripcion || "",
            habilitada: area.habilitada ?? true, // por defecto true si no existe
            idConvocatoria: area.idConvocatoria || idConvocatoria, // si se tiene disponible
        }));
        const categoriasFormateadas = categoriasSeleccionadas.map((categoria) => {
            let idAreaEncontrado = null;
            areasSeleccionadas.forEach((area) => {
                const categoriaEncontrada = area.categorias.find(
                    (cat) => cat.id === categoria.id
                );
                if (categoriaEncontrada) {
                    idAreaEncontrado = area.id; // Asignar el idArea de la categoría
                }
            });
            return {
                idCategoria: categoria.id,
                nombreCategoria: categoria.nombre,
                descripcionCategoria: categoria.descripcion || "", // si se requiere
                idArea: idAreaEncontrado, // Asignar el idArea encontrado
                monto: categoria.monto || 50,
            };
        });

        nuevoEstudiante.areas = areasFormateadas;
        nuevoEstudiante.categorias = categoriasFormateadas;

        const estudiantesActualizados = [...estudiantes];
        if (indexEdit !== -1) {
            estudiantesActualizados[indexEdit] = nuevoEstudiante;
            setEstudiantes(estudiantesActualizados);
        }


        setAreasSeleccionadas([]);
        setCategoriasSeleccionadas([]);
        setIndexEdit(-1);
        setEstudianteEdit({});
        setRegistro(false);  // Cambiar el estado de registro a false
    }

    const handleEliminar = (index) => {
        const nuevoEstudiantes = [...estudiantes.slice(0, index), ...estudiantes.slice(index + 1)];
        setEstudiantes(nuevoEstudiantes);
    }

    const handleSiguiente = () => {
        if (estudiantes.length === 0) {
            alert("Debes registrar al menos un estudiante antes de continuar.");
            return;
        }

        navigate(`/convocatoria/${idConvocatoria}/ordenPago`, {
            state: {
                estudiantes: estudiantes.map(est => ({
                    ...est,
                    idTutor: tutor.idTutor,
                    tutor: { ...tutor },  // Datos del tutor actualizados
                })),
                from: "Manual",
            },
        });
    }

    return (
        <div>
            {registro === false && (
                <div>
                    <DetalleInscripcion
                        estudiantes={estudiantes}
                        onEliminar={handleEliminar}
                        setRegistro={setRegistro}
                        setEstudianteEdit={setEstudianteEdit}
                        setAreasSeleccionadas={setAreasSeleccionadas}
                        setCategoriasSeleccionadas={setCategoriasSeleccionadas}
                        setIndexEdit={setIndexEdit}
                    />
                    <div className="control">
                        <button className="boton-style btn-aceptacion" type="button" onClick={() => setRegistro(true)}>
                            Añadir nuevo
                        </button>
                        <button
                            className="boton-style btn-aceptacion"
                            onClick={handleSiguiente}
                        >
                            Siguiente
                        </button>
                        <Link to="/convocatorias" className="boton-style btn-rechazo">Cancelar</Link>
                    </div>
                </div>
            )}
            {registro === true && (
                <div>
                    <Registro
                        idConvocatoria={idConvocatoria}
                        estudiantes={estudiantes}
                        setEstudiantes={setEstudiantes}
                        areasSeleccionadas={areasSeleccionadas}
                        categoriasSeleccionadas={categoriasSeleccionadas}
                        setAreasSeleccionadas={setAreasSeleccionadas}
                        setCategoriasSeleccionadas={setCategoriasSeleccionadas}
                        handleRegistrar={handleRegistrar}
                        handleActualizar={handleActualizar}
                        setRegistro={setRegistro}
                        estudiante={estudianteEdit}
                    />
                </div>
            )}
        </div>
    )
}

export default InscripcionManual;