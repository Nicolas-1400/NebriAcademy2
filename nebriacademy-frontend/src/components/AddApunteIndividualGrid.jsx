import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/useAuthStore'

function AddApunteIndividualGrid() {
  const navigate = useNavigate()
  const usuario = useAuthStore((s) => s.user)

  const [file, setFile] = useState(null)
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [categoria, setCategoria] = useState('')
  const [categorias, setCategorias] = useState([])

  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    const load = async () => {
      try {
        const r = await fetch('http://localhost:3000/apuntes/categorias')
        if (r.ok) {
          const d = await r.json()
          const list = Array.isArray(d.categorias) ? d.categorias : []
          setCategorias(list)
        }
      } catch (e) {
        console.error('Error cargando categorias:', e)
      }
    }
    load()
  }, [])
  

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    if (!file) return setError('Selecciona un archivo')
    if (!nombre || nombre.trim() === '') return setError('El nombre es obligatorio')
    setLoading(true)
    try {
      const endpoint = 'apuntes'
      const form = new FormData()
      form.append('archivo', file)
      form.append('nombre', nombre)
      form.append('descripcion', descripcion)
      if (categoria) form.append('categoria', categoria)
      if (usuario) {
        form.append('autor', usuario.id)
        if (usuario.usuarioId) form.append('usuarioId', usuario.usuarioId)
      }

      const res = await fetch(`http://localhost:3000/${endpoint}`, {
        method: 'POST',
        body: form,
      })
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        throw new Error(d.error || 'Error subiendo archivo')
      }
      navigate(-1)
    } catch (e) {
      console.error('upload error', e)
      setError(e.message || 'Error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="addcontenidocursogrid">
      <h2>Añadir apunte</h2>
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
          <select className="input-area" value={categoria} onChange={(e) => setCategoria(e.target.value)}>
            <option value="" disabled>-- Selecciona categoria --</option>
            {categorias.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
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

export default AddApunteIndividualGrid