import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { ConvocatoriaContext } from '../context/ConvocatoriaContext';

const RequirePermission = ({ permiso, children }) => {
  //const { permissions } = useContext(ConvocatoriaContext);
  const location = useLocation();

  if (user?.rol === 'admin') {
    console.log('[RequirePermission] Admin, acceso total');
    return children;
  }

  const { permissions } = React.useContext(
    require('../context/ConvocatoriaContext').ConvocatoriaContext
  );

  if (permissions === null) {
    return <div>Cargando permisos…</div>;
  }

  if (!permissions.includes(permiso)) {
    console.warn(`[RequirePermission] Acceso denegado: falta permiso "${permiso}"`);
    return <Navigate to="/no-autorizado" state={{ from: location }} replace />;
  }

  return children;
};

export default RequirePermission;