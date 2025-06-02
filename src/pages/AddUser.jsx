import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./styles/AddUser.css";
import { sub } from "date-fns";
import FullScreenSpinner from "../components/FullScreenSpinner";
import SpinnerInsideButton from "../components/SpinnerInsideButton";

const apiUrl = import.meta.env.VITE_API_URL;

const AddUser = () => {
  const navigate = useNavigate();
  const { id } = useParams();


  const [nombre, setNombre] = useState("");
  const [apellido, setApellidos] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const [cargando, setCargando] = useState(false);
  const [subiendo, setSubiendo] = useState(false);

  useEffect(() => {
    if (id) {
      setCargando(true);
      const metodo = async () => {

        fetch(`${apiUrl}/especificousers/${id}`)
          .then(response => response.json())
          .then(data => {
            console.log(data);

            const usuario = {
              nombre: data.name,
              apellido: data.apellido,
              email: data.email
            }
            if (usuario) {
              setNombre(usuario.nombre);
              setApellidos(usuario.apellido);
              setEmail(usuario.email);
              console.log(usuario);
            }
          })
          .catch(error => console.error("Error al obtener colegios:", error))
          .finally(() => setCargando(false));
      }
      metodo();
    }
  }, [id]);

  const handleCancelar = () => {
    navigate("/tablaUsuarios");
  };

  const handleGuardar = async () => {
    setSubiendo(true);

    if (!nombre || !apellido || !email) {
      alert("Debe llenar todos los campos");
      setSubiendo(false);
      return;
    }

    if(!id && !password) {
        alert("Debe llenar todos los campos");
        setSubiendo(false);
        return;
      }
    

    if (id) {
      const dataToSend = {
        name: nombre,
        apellido: apellido,
        email: email,
      }
      try {
        const res = await fetch(`${apiUrl}/editausers/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(dataToSend),
        });
        if (!res.ok) {
          const errorData = await res.json();
          console.error("Error:", errorData);
          alert("Error al actualizar el usuario");
          return;
        }
      } catch (error) {
        console.error('Error al actualizar el usuario: ', error);
      } finally {
        setSubiendo(false);
      }
    } else {
      const dataToSend = {
        name: nombre,
        apellido: apellido,
        email: email,
        password: password
      }
      try {
        const res = await fetch(`${apiUrl}/guardausers`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(dataToSend),
        });
        if (!res.ok) {
          const errorData = await res.json();
          console.error("Error:", errorData);
          alert("Error al guardar el usuario");
          return;
        }
      } catch (error) {
        console.error('Error al guardar el usuario: ', error);
      } finally {
        setSubiendo(false);
      }
    }

    navigate("/tablaUsuarios");
  };

  return (
    <div className="form-container">
      <div className="form-title">{id ? "Editar Usuario" : "Registrar Usuarios"}</div>
      <div className="form-body">
        {cargando ? <FullScreenSpinner /> : (
          <>
            <div className="form-group">
              <label>Nombre(s):</label>
              <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} disabled={cargando || subiendo} />
            </div>
            <div className="form-group">
              <label>Apellidos</label>
              <input type="text" value={apellido} onChange={(e) => setApellidos(e.target.value)} disabled={cargando || subiendo} />
            </div>
            {!id && (
              <div className="form-group">
                <label>password :</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={cargando || subiendo} />
              </div>
            )}
            <div className="form-group">
              <label>email :</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={cargando || subiendo} />
            </div>
          </>
        )}

        <div className="form-buttons">
          <button className="btn-agregar-addusr" onClick={handleGuardar} disabled={cargando || subiendo}>
            {subiendo ? <span><SpinnerInsideButton /></span> : id ? "✏️" : "💾"}

          </button>
          <button className="btn-cancelar-addusr" onClick={handleCancelar} disabled={cargando || subiendo}>❌</button>
        </div>
      </div>
    </div>
  );
};

export default AddUser;
