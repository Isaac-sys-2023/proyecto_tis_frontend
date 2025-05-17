import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./styles/AddUser.css";

const AddUser = () => {
  const navigate = useNavigate();
  const { id } = useParams();


  const [nombre, setNombre] = useState("");
  const [apellido, setApellidos] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (id) {
      const metodo = async () => {
        fetch(`http://localhost:8000/api/especificousers/${id}`)
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
          .catch(error => console.error("Error al obtener colegios:", error));

      }
      metodo();
    }
  }, [id]);

  const handleCancelar = () => {
    navigate("/tablaUsuarios");
  };

  const handleGuardar = async () => {
    if (id) {
      const dataToSend = {
        name: nombre,
        apellido: apellido,
        email: email,
      }
      try {
        const res = await fetch(`http://localhost:8000/api/editausers/${id}`, {
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
      }
    } else {
      const dataToSend = {
        name: nombre,
        apellido: apellido,
        email: email,
        password: password
      }
      try {
        const res = await fetch(`http://localhost:8000/api/guardausers`, {
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
      }
    }

    navigate("/tablaUsuarios");
  };

  return (
    <div className="form-container">
      <div className="form-title">{id ? "Editar Usuario" : "Add USUARIOS"}</div>
      <div className="form-body">
        <div className="form-group">
          <label>Nombre(s):</label>
          <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Apellidos</label>
          <input type="text" value={apellido} onChange={(e) => setApellidos(e.target.value)} />
        </div>
        {!id && (
          <div className="form-group">
            <label>password :</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
        )}
        <div className="form-group">
          <label>email :</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="form-buttons">
          <button className="btn-agregar" onClick={handleGuardar}>
            {id ? "✏️" : "💾"}
          </button>
          <button className="btn-cancelar" onClick={handleCancelar}>❌</button>
        </div>
      </div>
    </div>
  );
};

export default AddUser;
