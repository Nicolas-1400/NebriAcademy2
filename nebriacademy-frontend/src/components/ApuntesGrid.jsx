import { useEffect, useState } from 'react'

function ApuntesGrid() {
  const [apuntes, setApuntes] = useState([])
  const [profesores, setProfesores] = useState([])
  const [alumnos, setAlumnos] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    setError(null)
    // cargar apuntes, profesores y alumnos en paralelo
    Promise.all([
      fetch('http://localhost:3000/apuntes').then((r) => r.json()),
      fetch('http://localhost:3000/profesores').then((r) => r.json()),
      fetch('http://localhost:3000/alumnos').then((r) => r.json()),
    ])
      .then(([apRes, profRes, alumRes]) => {
        const listAp = Array.isArray(apRes.Apuntes) ? apRes.Apuntes : apRes || []
        const listProf = Array.isArray(profRes.Profesores) ? profRes.Profesores : profRes || []
        const listAlum = Array.isArray(alumRes.Alumnos) ? alumRes.Alumnos : alumRes || []
        setApuntes(listAp)
        setProfesores(listProf)
        setAlumnos(listAlum)
      })
      .catch((e) => {
        console.error('Error cargando apuntes/autores:', e)
        setError('No se pudieron cargar los apuntes')
      })
  }, [])

  if (error) return <p>{error}</p>

  // agrupar apuntes por autor (usuarioId)
  const authorsMap = new Map()
  apuntes.forEach((a) => {
    const autorId = a.autor || 'anon'
    if (!authorsMap.has(autorId)) authorsMap.set(autorId, [])
    authorsMap.get(autorId).push(a)
  })

  const authorCards = []
  for (const [autorIdRaw, items] of authorsMap.entries()) {
    const autorId = Number(autorIdRaw);
    let nombre = 'Anónimo'
    let tipoAutor = null
    if (autorIdRaw !== 'anon') {
      // Priorizar búsqueda en alumnos (usuarioId o id)
        let al = alumnos.find((aa) => Number(aa.usuarioId) === autorId)
        if (!al) al = alumnos.find((aa) => Number(aa.id) === autorId)
        if (al) {
          nombre = `${al.nombre} ${al.apellidos}`
          tipoAutor = 'alumno'
        } else {
          // intentar buscar en profesores por usuarioId o id
          let p = profesores.find((pp) => Number(pp.usuarioId) === autorId)
          if (!p) p = profesores.find((pp) => Number(pp.id) === autorId)
          if (p) {
            nombre = `${p.nombre} ${p.apellidos}`
            tipoAutor = 'profesor'
          } else {
            nombre = `Usuario ID: ${autorId}`
          }
        }
    }
    authorCards.push({ autorId, nombre, tipoAutor, items })
  }

  return (
    <div className="ApuntesGrid">
      {authorCards.length > 0 ? (
        <div>
          <div className="apuntes-header">
            <h2>Apuntes subidos por usuarios</h2>
            <p>{apuntes.length} apuntes</p>
          </div>
          <div className="autores-list">
            {authorCards.map((ac) => (
              <div key={ac.autorId} className="autor-card">
                <div>
                  <div className="autor-nombre">{ac.nombre}</div>
                  <div className="autor-meta">{ac.tipoAutor ? ac.tipoAutor : 'Usuario'} — {ac.items.length} apuntes</div>
                </div>
                <div className="lista-apuntes">
                  {ac.items.map((it) => (
                    <div key={it.id} className="apunte-item">
                      <a href={`http://localhost:3000/apuntes/files/${it.archivo}`} target="_blank" rel="noreferrer">{it.nombre || it.archivo}</a>
                      {it.descripcion ? <p>{it.descripcion}</p> : null}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="no-apuntes">No hay apuntes subidos todavía.</p>
      )}
    </div>
  )
}

export default ApuntesGrid