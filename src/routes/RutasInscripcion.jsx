import { Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';

import TipoInscripcion from '../pages/TipoInscripcion';
import InscripcionManual from '../pages/InscripcionManual';
import InscripcionExcel from '../pages/InscripcionExcel';
import OrdenPago from '../components/OrdenPago';

import Disciplinas from '../views/Disciplinas';

export const RutasInscripcion = () => (
  <>
    <Route
      path="/convocatoria/:idConvocatoria/tipo-inscripcion"
      element={
        <PrivateRoute allowedRoles={['Tutor', 'Admin']}>
          <TipoInscripcion />
        </PrivateRoute>
      }
    />
    <Route
      path="/convocatoria/:idConvocatoria/inscripcion-manual"
      element={
        <PrivateRoute allowedRoles={['Tutor', 'Admin']}>
          <InscripcionManual />
        </PrivateRoute>
      }
    />
    <Route
      path="/convocatoria/:idConvocatoria/inscripcion-excel"
      element={
        <PrivateRoute allowedRoles={['Tutor', 'Admin']}>
          <InscripcionExcel />
        </PrivateRoute>
      }
    />
    <Route
      path="/ordenPago"
      element={
        <PrivateRoute allowedRoles={['Tutor', 'Admin']}>
          <OrdenPago />
        </PrivateRoute>
      }
    />
    <Route
      path="/convocatoria/:idConvocatoria/ordenPago"
      element={
        <PrivateRoute allowedRoles={['Tutor', 'Admin']}>
          <OrdenPago />
        </PrivateRoute>
      }
    />
    <Route
      path="/disciplinas"
      element={
        <PrivateRoute allowedRoles={['Tutor', 'Admin']}>
          <Disciplinas />
        </PrivateRoute>
      }
    />
  </>
);
