import React from 'react';

/**
 * Componente de tabla genérico para la gestión de cuentas.
 * Maneja el filtrado de datos y el renderizado de filas editables o estáticas.
 */
function CuentasTable({ 
  title, 
  data, 
  filtros, 
  headers, 
  columnKeys, 
  rol, 
  onBlur, 
  onDelete, 
  className,
  getExtraCol 
}) {
  // ── FILTRADO ────────────────────────────────────────────────────────────────
  // Aplicamos los filtros de búsqueda a los datos recibidos
  const filteredData = data.filter((c) =>
    (!filtros.nombre || (c.nombre || '').toLowerCase().includes(filtros.nombre.toLowerCase())) &&
    (!filtros.apellidos || (c.apellidos || '').toLowerCase().includes(filtros.apellidos.toLowerCase())) &&
    (!filtros.email || (c.email || '').toLowerCase().includes(filtros.email.toLowerCase())) &&
    (!filtros.dni || (c.dni || '').toLowerCase().includes(filtros.dni.toLowerCase())) &&
    (!filtros.numTelefono || (c.numTelefono || '').toLowerCase().includes(filtros.numTelefono.toLowerCase())) &&
    (!filtros.pais || (c.pais || '').toLowerCase().includes(filtros.pais.toLowerCase())) &&
    (!filtros.localidad || (c.localidad || '').toLowerCase().includes(filtros.localidad.toLowerCase()))
  );

  return (
    <>
      <h3>{title}</h3>
      <div className="tabla-contenedor">
        <table className={`tabla ${className}`}>
          <thead className="head-tabla">
            <tr>
              {headers.map((h, i) => (
                <th key={i}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="contenido-tabla">
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={headers.length} className="mensaje-vacio-tabla">
                  No se han encontrado {title.toLowerCase()} que coincidan con la búsqueda.
                </td>
              </tr>
            ) : (
              filteredData.map((c) => (
                <tr key={`${rol}-${c.id}`}>
                  {/* Columna extra opcional al principio (ej: Profesor vinculado) */}
                  {getExtraCol && <td>{getExtraCol(c)}</td>}
                  
                  {/* Columnas de datos principales */}
                  {columnKeys.map((k) => (
                    <td
                      key={k}
                      contentEditable={onBlur ? true : false}
                      suppressContentEditableWarning={onBlur ? true : false}
                      onBlur={onBlur ? (e) => onBlur(e, c.id, rol, k, c[k]) : undefined}
                    >
                      {c[k] || ""}
                    </td>
                  ))}

                  {/* Columna de acciones opcional (Borrar) */}
                  {onDelete && (
                    <td>
                      <button onClick={() => onDelete(c.id, rol, c.esVinculado)}>
                        Borrar
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default CuentasTable;
