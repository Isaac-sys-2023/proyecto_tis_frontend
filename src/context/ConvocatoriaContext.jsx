// import React, { createContext, useState } from "react";

// export const ConvocatoriaContext = createContext();

// export const ConvocatoriaProvider = ({ children }) => {
//   const [convocatoria, setConvocatoria] = useState({
//     titulo: "",
//     fechaPublicacion: "",
//     fechaInicioInsc: "",
//     fechaFinInsc: "",
//     portada: "",
//     habilitada: true,
//     fechaInicioOlimp: "",
//     fechaFinOlimp: "",
//     maximoPostPorArea: 1,
//   });

//   const [areas, setAreas] = useState([]);

//   const agregarConvocatoria = (datos) => {
//     setConvocatoria({ ...convocatoria, ...datos });
//   };

//   const agregarArea = (area) => {
//     setAreas((prev) => [...prev, { ...area, categorias: [] }]);
//   };

//   const agregarCategoria = (indexArea, categoria) => {
//     setAreas((prev) =>
//       prev.map((area, idx) =>
//         idx === indexArea
//           ? { ...area, categorias: [...area.categorias, categoria] }
//           : area
//       )
//     );
//   };

//   const obtenerJSONFinal = () => ({
//     convocatoria,
//     areas,
//   });

//   return (
//     <ConvocatoriaContext.Provider
//       value={{
//         convocatoria,
//         areas,
//         agregarConvocatoria,
//         agregarArea,
//         agregarCategoria,
//         obtenerJSONFinal,
//       }}
//     >
//       {children}
//     </ConvocatoriaContext.Provider>
//   );
// };

// En ConvocatoriaContext.jsx
import { createContext, useState, useContext } from "react";
import { useAuth } from "./AuthContext";

const apiUrl = import.meta.env.VITE_API_URL;

export const ConvocatoriaContext = createContext();

export const ConvocatoriaProvider = ({ children }) => {
  const [convocatoria, setConvocatoria] = useState({});

  const [permissions, setPermissions]       = useState([]);
  const { token, user } = useAuth();

  // const agregarConvocatoria = (data) => {
  //   setConvocatoria(data);
  // };
  const agregarConvocatoria = (datos) => {
    setConvocatoria({ ...convocatoria, ...datos });
  };

  const cambiarConvocatoria = async (convData) => {
    setConvocatoria(convData);

    // 1) pido la lista de usuarios-roles de esta convocatoria
    const res = await fetch(
      `${apiUrl}/convocatoria/${convData.idConvocatoria}/roles`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!res.ok) {
      setPermissions([]); 
      return;
    }
    const assignments = await res.json();
    // assignments = [ { user_id, name, role } , ... ]

    // 2) busco mi asignación
    const mine = assignments.find(a => a.user_id === user.id);
    if (!mine) {
      setPermissions([]);
      return;
    }

    // 3) traigo permisos de ese rol
    const rolRes = await fetch(
      `${apiUrl}/roles/${mine.role}`, 
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!rolRes.ok) {
      setPermissions([]);
      return;
    }
    const rolDetail = await rolRes.json(); 
    // rolDetail.permissions = [ { name, guard_name, ... } ]

    setPermissions(rolDetail.permissions.map(p => p.name));
  };


  return (
    <ConvocatoriaContext.Provider value={{ convocatoria, agregarConvocatoria, permissions, cambiarConvocatoria }}>
      {children}
    </ConvocatoriaContext.Provider>
  );
};
