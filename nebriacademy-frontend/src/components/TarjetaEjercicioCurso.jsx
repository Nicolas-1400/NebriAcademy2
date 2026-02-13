import Editar from '../assets/lapiz.png'

function TarjetaEjercicioCurso({ ejercicio, tipo, editingMode, handleEditNavigate, handleDeleteContenido }) {
  return (
    <li key={ejercicio.id} className="item-row">
      <div className="item-main">
        <a href={`http://localhost:3000/ejercicios/files/${ejercicio.archivo}`} target="_blank" rel="noreferrer">{ejercicio.nombre}</a>
        <br />        
        {ejercicio.descripcion ? <p>{ejercicio.descripcion}</p> : null}
      </div>
      {tipo === 'profesor' && editingMode ? (
        <div className="edit-controls">
          <button onClick={() => handleEditNavigate('ejercicio', ejercicio)} title="Editar ejercicio"><img src={Editar} alt="Editar" /></button>
          <button onClick={() => handleDeleteContenido('ejercicio', ejercicio.id)} title="Borrar ejercicio">✖</button>
        </div>
      ) : null}
    </li>
  )
}

export default TarjetaEjercicioCurso;
