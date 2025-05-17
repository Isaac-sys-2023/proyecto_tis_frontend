import { useState, useEffect } from "react";
import Header from "../layout/Header";
import "./styles/AddColegios.css";
import { Link, useNavigate, useLocation } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL;

const EditColegios = () => {

    const location = useLocation();
    const colegio = location.state?.colegio;
    //console.log(colegio);


    const [departamento, setDepartamento] = useState(colegio.departamento || "");
    const [provincia, setProvincia] = useState(colegio.provincia || "");
    const [formData, setFormData] = useState({
        nombre: colegio.nombreColegio || "",
        rue: colegio.RUE || "",
        fechaCreacion: colegio.fecha_creacion || "",
        direccion: colegio.direccion || "",
    });

    const idColegio = colegio.idColegio;

    const navigate = useNavigate();

    const [departamentos, setDepartamentos] = useState([]);
    const [provincias, setProvincias] = useState([]);

    useEffect(() => {
        fetch(`${apiUrl}/verdepartamentos`)
            .then(response => response.json())
            .then(data => setDepartamentos(data))
            .catch(error => console.error("Error al obtener colegios:", error));
    }, []);

    useEffect(() => {
        if (departamento) {
            // Cuando se carga el departamento, obtenemos las provincias para ese departamento
            fetch(`${apiUrl}/verprovincias/departamento/${departamento}`)
                .then((response) => response.json())
                .then((data) => {
                    setProvincias(data);
                    // Establecer la provincia por defecto si la provincia inicial es válida
                    if (colegio.provincia) {
                        setProvincia(colegio.provincia);  // Seleccionamos la provincia predefinida
                    }
                })
                .catch((error) => console.error("Error al obtener provincias:", error));
        }
    }, [departamento, colegio.provincia]);  // Dependemos del departamento y la provincia del colegio


    const handleDepartamentoChange = (e) => {
        const nuevoDepartamento = e.target.value;
        setDepartamento(nuevoDepartamento);
        setProvincia("");

        fetch(`${apiUrl}/verprovincias/departamento/${nuevoDepartamento}`)
            .then(response => response.json())
            .then(data => setProvincias(data))
            .catch(error => console.error("Error al obtener provincias:", error));
    };

    const handleProvinciaChange = (e) => {
        setProvincia(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (departamento === "" || provincia === "" || formData.nombre === "" || formData.direccion === "" || formData.fechaCreacion === "" || formData.rue === "") {
            alert("Llena todos los campos por favor");
            return;
        }

        // const formDataToSend = new FormData();
        // formDataToSend.append("nombreColegio", formData.nombre);
        // formDataToSend.append("departamento", departamento);
        // formDataToSend.append("provincia", provincia);
        // formDataToSend.append("RUE", formData.rue);
        // formDataToSend.append("direccion", formData.direccion);
        // formDataToSend.append("fecha_creacion", formData.fechaCreacion);

        const dataToSend = {
            nombreColegio: formData.nombre,
            departamento,
            provincia,
            RUE: formData.rue,
            direccion: formData.direccion,
            fecha_creacion: formData.fechaCreacion,
        };
        

        try {
            // const response = await fetch(`http://localhost:8000/api/colegio/${idColegio}`, {
            //     method: "PUT",
            //     body: formDataToSend,
            // });

            // if (!response.ok) throw new Error("Error al enviar datos");

            const response = await fetch(`${apiUrl}/colegio/${idColegio}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(dataToSend),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error:", errorData);
                alert("Error al actualizar el colegio");
                return;
            }

            setDepartamento("");
            setProvincia("");
            setProvincias([]);

            navigate("/colegios");
        } catch (error) {
            console.error("Error en el envío:", error);
            alert("Ocurrió un error al guardar el colegio.");
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="contenedor-add-colegio">
            <h3 className="title-add-colegio">UNIDAD EDUCATIVA</h3>
            <form className="formulario" id="colegio-form" onSubmit={handleSubmit}>
                <div className="campo">
                    <label>NOMBRE DE LA UNIDAD EDUCATIVA:</label>
                    <input type="text" name="nombre" onChange={handleChange} value={formData.nombre} />
                </div>
                <div className="two-items">
                    <div className="campo-item1">
                        <label>CÓDIGO RUE:</label>
                        <input type="text" name="rue" onChange={handleChange} value={formData.rue} />
                    </div>
                    <div className="campo-item2">
                        <label>FECHA DE CREACIÓN:</label>
                        <div className="input-with-icon">
                            <input type="date" name="fechaCreacion" onChange={handleChange} value={formData.fechaCreacion} placeholder="dd/mm/yyyy" />
                        </div>
                    </div>
                </div>
                <div className="campo">
                    <label>DIRECCIÓN:</label>
                    <input type="text" name="direccion" onChange={handleChange} value={formData.direccion} />
                </div>
                <div className="two-items">
                    <div className="campo-item1">
                        <label>DEPARTAMENTO:</label>
                        <select value={departamento} onChange={handleDepartamentoChange}>
                            <option value="">Seleccionar Departamento</option>
                            {departamentos.map((dep) => (
                                <option key={dep.idDepartamento} value={dep.nombreDepartamento}>
                                    {dep.nombreDepartamento}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="campo-item2">
                        <label>PROVINCIA:</label>
                        <select value={provincia} onChange={handleProvinciaChange} disabled={!departamento}>
                            <option value="">Seleccionar Provincia</option>
                            {departamento &&
                                provincias.map((prov) => (
                                    <option key={prov.idProvincia} value={prov.nombreProvincia}>
                                        {prov.nombreProvincia}
                                    </option>
                                ))}
                        </select>
                    </div>
                </div>
            </form>
            <div className="control">
                <button type="submit" form="colegio-form" className="boton-style btn-aceptacion">
                    Modificar
                </button>
                <Link to="/colegios" className="boton-style btn-rechazo">Cancelar</Link>
            </div>
        </div>
    );
};

export default EditColegios;
