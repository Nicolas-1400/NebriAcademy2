import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import useAuthStore from '../store/useAuthStore'

function AddContenidoCursoGrid() {
  const location = useLocation()
  const navigate = useNavigate()
  const params = useParams()
  const paramsId = params.id
  const state = location.state || {}
  const cursoIdFromState = state.cursoId || null
  const tipoFromState = state.tipo || null
  const cursoId = (cursoIdFromState && Number(cursoIdFromState) > 0) ? Number(cursoIdFromState) : (paramsId && Number(paramsId) > 0 ? Number(paramsId) : null)

  const usuario = useAuthStore((s) => s.user)
  const tipoUsuario = useAuthStore((s) => s.tipo)

  const [tipo, setTipo] = useState(tipoFromState || (tipoUsuario === 'alumno' ? 'apunte' : 'apunte'))
  const [file, setFile] = useState(null)
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [categoria, setCategoria] = useState('')
  const [categorias, setCategorias] = useState([])

  useEffect(() => {
    // si el usuario es alumno forzamos tipo apunte
    if (tipoUsuario !== 'profesor') setTipo('apunte')
    else if (tipoFromState) setTipo(tipoFromState)
  }, [tipoFromState, tipoUsuario])

  useEffect(() => {
    const load = async () => {
      try {
        if (cursoId) {
          const r = await fetch(`http://localhost:3000/cursos/${cursoId}`)
          if (r.ok) {
            const c = await r.json()
            setCategoria(c.categoria || '')
          }
        } else {
          const r = await fetch('http://localhost:3000/cursos')
          if (r.ok) {
            const d = await r.json()
            const list = Array.isArray(d.Cursos) ? d.Cursos : []
            const uniq = [...new Set(list.map((x) => x.categoria).filter(Boolean))]
            setCategorias(uniq)
            if (uniq.length > 0) setCategoria(uniq[0])
          }
        }
      } catch (e) {
        console.error('Error cargando categorias:', e)
      }
    }
    load()
  }, [cursoId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    if (!file) return setError('Selecciona un archivo')
    if ((tipo === 'apunte' || tipo === 'ejercicio') && (!nombre || nombre.trim() === '')) return setError('El nombre es obligatorio')
    setLoading(true)
    try {
      const endpoint = tipo === 'video' ? 'videos' : tipo === 'apunte' ? 'apuntes' : 'ejercicios'
      const form = new FormData()
      form.append('archivo', file)
      if (cursoId) form.append('curso', parseInt(cursoId))
      // todos los tipos con fichero deben enviar nombre (obligatorio para apunte/ejercicio/video)
      form.append('nombre', nombre)
      if (tipo !== 'video') form.append('descripcion', descripcion)
      if (categoria) form.append('categoria', categoria)
      // autor: enviamos el id del usuario autenticado
      if (usuario && usuario.id) form.append('autor', usuario.id)

      const res = await fetch(`http://localhost:3000/${endpoint}`, {
        method: 'POST',
        body: form,
      })
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        throw new Error(d.error || 'Error subiendo archivo')
      }
      navigate(`/Home/Cursos/${cursoId}`)
    } catch (e) {
      console.error('upload error', e)
      setError(e.message || 'Error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="addcontenidocursogrid">
      <h2>Añadir {tipo} al curso</h2>
      <form onSubmit={handleSubmit} className="add-contenido-form">
        <div className="form-group">
          <label>Nombre</label>
          <input className="input-area" value={nombre} onChange={(e) => setNombre(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Descripción</label>
          <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Archivo</label>
          <input className="input-area" type="file" onChange={(e) => setFile(e.target.files && e.target.files[0])} />
        </div>
        <div className="form-group">
          <label>Categoria</label>
          {cursoId ? (
            <input className="input-area" value={categoria} disabled />
          ) : (
            <select className="input-area" value={categoria} onChange={(e) => setCategoria(e.target.value)}>
              <option value="">-- Selecciona categoria --</option>
              {categorias.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          )}
        </div>
        {error ? <p className="error">{error}</p> : null}
        <div className="form-botones">
          <button type="submit" className="btn-subir" disabled={loading}>{loading ? 'Subiendo...' : 'Subir'}</button>
          <button type="button" className="btn-cancel" onClick={() => navigate(-1)}>Cancelar</button>
        </div>
      </form>
    </div>
  )
}

export default AddContenidoCursoGrid