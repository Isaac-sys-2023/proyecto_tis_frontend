import React from 'react';
import * as XLSX from "xlsx";
import { saveAs } from 'file-saver';

const ExcelDownload = () => {
  const handleDownload = () => {
    const data = [
        [
            "nombrePost", "apellidoPost", "carnet", "fechaNaciPost", "correoPost", "telefonoPost",
            "departamento", "provincia", "curso", "areas", "categorias"
        ],
        [
            "Juan", "Pérez", "123456", "2005-04-14", "juan@email.com", "76451234", 
            "Cochabamba", "Cercado", "3° Primaria", "Area1,Area2", "CategoriaEnArea1,CategoriaEnArea2"
        ]
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(data);

    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    //const blob = XLSX.write(wb, {bookType: 'xlsx', type: 'blob'});
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });

    saveAs(blob, 'plantilla.xlsx');
  };

  return (
    <button onClick={handleDownload}>Descargar Plantilla</button>
  )
}

export default ExcelDownload;