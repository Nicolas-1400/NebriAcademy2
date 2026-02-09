import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function EditarContenidoCursoGrid() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {};
  const { tipo, item, cursoId } = state;

  const [nombre, setNombre] = useState(item && item.nombre ? item.nombre : '');
  const [descripcion, setDescripcion] = useState(item && item.descripcion ? item.descripcion : '');
  const [newFile, setNewFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!tipo || !item) {
      // si no hay state, redirigir de vuelta al curso
      navigate(`/Home/Cursos/${cursoId || ''}`);
    }
  }, [tipo, item, navigate, cursoId]);

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);
      const endpoint = tipo === 'video' ? 'videos' : tipo === 'apunte' ? 'apuntes' : 'ejercicios';
      let res;
      if (newFile) {
        const form = new FormData();
        // enviar nombre para todos los tipos que tienen fichero
        form.append('nombre', nombre);
        if (tipo !== 'video') form.append('descripcion', descripcion);
        form.append('archivo', newFile);
        res = await fetch(`http://localhost:3000/${endpoint}/${item.id}`, {
          method: 'PUT',
          body: form,
        });
      } else {
        const body = {};
        body.nombre = nombre;
        if (tipo !== 'video') body.descripcion = descripcion;
        res = await fetch(`http://localhost:3000/${endpoint}/${item.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
      }
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || 'Error actualizando');
      }
      // volver al curso
      navigate(`/Home/Cursos/${cursoId}`);
    } catch (e) {
      console.error('save error', e);
      setError(e.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  const fileLink = () => {
    if (!item || !item.archivo) return null;
    if (tipo === 'video') return `http://localhost:3000/videos/files/${item.archivo}`;
    if (tipo === 'apunte') return `http://localhost:3000/apuntes/files/${item.archivo}`;
    return `http://localhost:3000/ejercicios/files/${item.archivo}`;
  };

  return (
    <div className="editar-curso-container">
      <h2>Editar {tipo}</h2>
      {item ? (
        <div className="add-contenido-form">
          <p><strong>Archivo:</strong> {item.archivo ? <a href={fileLink()} target="_blank" rel="noreferrer">{item.nombre || item.archivo}</a> : 'Sin archivo'}</p>
          <div className="form-group">
            <label>Nombre</label>
            <input className="input-area" value={nombre} onChange={(e) => setNombre(e.target.value)} />
          </div>
          {tipo !== 'video' ? (
            <div className="form-group">
              <label>Descripción</label>
              <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
            </div>
          ) : null}
          <div className="form-group">
            <label>Cambiar archivo</label>
            <input className="input-area" type="file" onChange={(e) => setNewFile(e.target.files && e.target.files[0])} />
            <small style={{ color: '#666', fontSize: '14px' }}>Si subes un nuevo archivo, este reemplazará al anterior.</small>
          </div>
          {error ? <p className="error">{error}</p> : null}
          <div className="form-botones">
            <button className="btn-subir" onClick={handleSave} disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</button>
            <button className="btn-cancel" onClick={() => navigate(`/Home/Cursos/${cursoId}`)}>Cancelar</button>
          </div>
        </div>
      ) : (
        <p>Cargando...</p>
      )}
    </div>
  )
}

export default EditarContenidoCursoGrid