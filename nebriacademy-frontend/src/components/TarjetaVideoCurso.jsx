import Editar from '../assets/lapiz.png'

function TarjetaVideoCurso({ video, tipo, editingMode, handleEditNavigate, handleDeleteContenido }) {
  return (
    <div key={video.id} className="video-item">
      <div>
        <h5>{video.nombre}</h5>
        {tipo === 'profesor' && editingMode ? (
          <div className="edit-controls">
            <button onClick={() => handleEditNavigate('video', video)} title="Editar video"><img src={Editar} alt="Editar" /></button>
            <button onClick={() => handleDeleteContenido('video', video.id)} title="Borrar video">✖</button>
          </div>
        ) : null}
      </div>
      <video controls>
        <source src={`http://localhost:3000/videos/files/${video.archivo}`} type="video/mp4" />
        Tu navegador no soporta el elemento <code>video</code>.
      </video>
    </div>
  )
}

export default TarjetaVideoCurso;
