import MeGusta from "../assets/me-gusta.png";
import MeGustaMarcado from "../assets/me-gusta-marcado.png";
import Editar from '../assets/lapiz.png'

function TarjetaApunteCurso({ apunte, usuario, likedIds = [], onToggleLike, tipo, editingMode, handleEditNavigate, handleDeleteContenido }) {
  const isLiked = likedIds.includes(apunte.id);
  return (
    <li key={apunte.id} className="item-row">
      <div className="item-main">
        <a href={`http://localhost:3000/apuntes/files/${apunte.archivo}`} target="_blank" rel="noreferrer">{apunte.nombre || apunte.archivo}</a>
        {apunte.descripcion ? <p>{apunte.descripcion}</p> : null}
      </div>
      {tipo === 'profesor' && editingMode ? (
        <div className="edit-controls">
          <button onClick={() => handleEditNavigate('apunte', apunte)} title="Editar apunte"><img src={Editar} alt="Editar" /></button>
          <button onClick={() => handleDeleteContenido('apunte', apunte.id)} title="Borrar apunte">✖</button>
        </div>
      ) : null}
      <div className="apunte-like">
        {onToggleLike && usuario && usuario.id ? (
          <>
            <img src={isLiked ? MeGustaMarcado : MeGusta} alt="like" className={isLiked ? 'like-icon liked' : 'like-icon'} onClick={() => onToggleLike(apunte)} />
            <span className="like-count">{apunte.valoracion || 0}</span>
          </>
        ) : null}
      </div>
    </li>
  )
}

export default TarjetaApunteCurso;
