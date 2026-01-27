import { useEffect, useState } from 'react'
import ImagenPerfil from '../assets/imagenPerfilUsuario.png'

function PerfilGrid() {
    const [usuario, setUsuario] = useState(null);
    const [formData, setFormData] = useState({
        nombre: '',
        apellidos: '',
        contrasena: '',
        numeroTarjeta: '',
        numTelefono: '',
        redes: '',
        pais: '',
        localidad: ''
    });
    const [mensajeExito, setMensajeExito] = useState('');
    const [mensajeError, setMensajeError] = useState('');

    useEffect(() => {
        const usuarioIniciado = localStorage.getItem('usuario')
        const tipoIniciado = localStorage.getItem('tipo') || localStorage.getItem('tipoUsuario')
        
        if (usuarioIniciado && tipoIniciado === 'alumno') {
            const usuarioParsed = JSON.parse(usuarioIniciado)
            setUsuario(usuarioParsed)
            
            fetch(`http://localhost:3000/usuarios/${usuarioParsed.id}?tipo=alumno`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error al obtener datos del usuario')
                    }
                    return response.json()
                })
                .then(datosCompletos => {
                    setUsuario(datosCompletos)
                    localStorage.setItem('usuario', JSON.stringify(datosCompletos))
                    
                    setFormData({
                        nombre: datosCompletos.nombre || '',
                        apellidos: datosCompletos.apellidos || '',
                        contrasena: '',
                        numeroTarjeta: datosCompletos.numeroTarjeta || '',
                        numTelefono: datosCompletos.numTelefono || '',
                        redes: datosCompletos.redes || '',
                        pais: datosCompletos.pais || '',
                        localidad: datosCompletos.localidad || ''
                    })
                })
                .catch(error => {
                    const usuarioParsed = JSON.parse(usuarioIniciado)
                    setFormData({
                        nombre: usuarioParsed.nombre || '',
                        apellidos: usuarioParsed.apellidos || '',
                        contrasena: '',
                        numeroTarjeta: usuarioParsed.numeroTarjeta || '',
                        numTelefono: usuarioParsed.numTelefono || '',
                        redes: usuarioParsed.redes || '',
                        pais: usuarioParsed.pais || '',
                        localidad: usuarioParsed.localidad || ''
                    })
                })
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setMensajeError('')
        
        try {
            const datosActualizar = {
                ...formData,
                tipo: 'alumno'
            }

            if (!formData.contrasena) {
                delete datosActualizar.contrasena
            }

            const response = await fetch(`http://localhost:3000/usuarios/${usuario.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datosActualizar)
            })

            if (response.ok) {
                const usuarioActualizado = await response.json()
                localStorage.setItem('usuario', JSON.stringify(usuarioActualizado))
                setUsuario(usuarioActualizado)
                setMensajeExito('¡Perfil actualizado correctamente!')
                setFormData(prevState => ({
                    ...prevState,
                    contrasena: ''
                }))
                setTimeout(() => setMensajeExito(''), 3000)
            } else {
                const error = await response.json()
                setMensajeError(error.error || 'Error al actualizar el perfil')
            }
        } catch (error) {
            setMensajeError('Error al conectar con el servidor')
        }
    }

    return (
        <div className="perfil">
            <div className="datosPerfil">
                <h1>Mi Perfil</h1>
                <img className="imagenPerfil" src={ImagenPerfil} alt="Perfil Usuario" />
                <h2 className="nombrePerfil">{usuario ? `${usuario.nombre} ${usuario.apellidos}` : 'Usuario'}</h2>
                <p className="correoPerfil">{usuario ? usuario.email : 'correo@example.com'}</p>
                <p className="tipoPerfil">Alumno</p>
                {usuario?.numTelefono && <p className="telPerfil">📱 {usuario.numTelefono}</p>}
                {usuario?.pais && <p className="paisPerfil">🌍 {usuario.pais}</p>}
                {usuario?.localidad && <p className="localidadPerfil">🏙️ {usuario.localidad}</p>}
            </div>
            <div className="formularioEditarPerfil">
                <h3>Editar Perfil</h3>
                {mensajeExito && <p className="mensaje-exito">{mensajeExito}</p>}
                {mensajeError && <p className="mensaje-error">{mensajeError}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="formulario-grupo">
                        <label htmlFor="nombre">Nombre:</label>
                        <input
                            type="text"
                            id="nombre"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleInputChange}
                            placeholder="Tu nombre"
                        />
                    </div>

                    <div className="formulario-grupo">
                        <label htmlFor="apellidos">Apellidos:</label>
                        <input
                            type="text"
                            id="apellidos"
                            name="apellidos"
                            value={formData.apellidos}
                            onChange={handleInputChange}
                            placeholder="Tus apellidos"
                        />
                    </div>

                    <div className="formulario-grupo">
                        <label htmlFor="contrasena">Contraseña:</label>
                        <input
                            type="password"
                            id="contrasena"
                            name="contrasena"
                            value={formData.contrasena}
                            onChange={handleInputChange}
                            placeholder="Dejar en blanco para no cambiar"
                        />
                    </div>

                    <div className="formulario-grupo">
                        <label htmlFor="numeroTarjeta">Número de Tarjeta:</label>
                        <input
                            type="text"
                            id="numeroTarjeta"
                            name="numeroTarjeta"
                            value={formData.numeroTarjeta}
                            onChange={handleInputChange}
                            placeholder="Tu número de tarjeta"
                        />
                    </div>

                    <div className="formulario-grupo">
                        <label htmlFor="numTelefono">Número de Teléfono:</label>
                        <input
                            type="tel"
                            id="numTelefono"
                            name="numTelefono"
                            value={formData.numTelefono}
                            onChange={handleInputChange}
                            placeholder="Tu número de teléfono"
                        />
                    </div>

                    <div className="formulario-grupo">
                        <label htmlFor="redes">Redes Sociales:</label>
                        <input
                            type="text"
                            id="redes"
                            name="redes"
                            value={formData.redes}
                            onChange={handleInputChange}
                            placeholder="Tus redes sociales (ej: @usuario)"
                        />
                    </div>

                    <div className="formulario-grupo">
                        <label htmlFor="pais">País:</label>
                        <input
                            type="text"
                            id="pais"
                            name="pais"
                            value={formData.pais}
                            onChange={handleInputChange}
                            placeholder="Tu país"
                        />
                    </div>

                    <div className="formulario-grupo">
                        <label htmlFor="localidad">Localidad:</label>
                        <input
                            type="text"
                            id="localidad"
                            name="localidad"
                            value={formData.localidad}
                            onChange={handleInputChange}
                            placeholder="Tu localidad"
                        />
                    </div>

                    <button type="submit" className="boton-editar-perfil">Guardar Cambios</button>
                </form>
            </div>
        </div>
    )
}

export default PerfilGrid