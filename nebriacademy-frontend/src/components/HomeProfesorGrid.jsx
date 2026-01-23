import { useEffect, useState } from 'react'

function HomeProfesorGrid() {
    const [usuario, setUsuario] = useState(null);

        useEffect(() => {
            const usuarioIniciado = localStorage.getItem('usuario')
            if (usuarioIniciado) {
            setUsuario(JSON.parse(usuarioIniciado))
            }
        }, []);
    return (
        <div>
            <h1>Bienvenido/a {usuario ? `${usuario.nombre} ${usuario.apellidos}` : 'Usuario'}</h1>
        </div>
    )
}

export default HomeProfesorGrid