import { useEffect, useState } from 'react'
import useAuthStore from '../store/useAuthStore'
import TarjetaCursos from './TarjetaCursos';

function HomeProfesorGrid() {
    const [usuario, setUsuario] = useState(null);
    const [cursos, setCursos] = useState([]);
    const [error, setError] = useState(null);

    const storeUser = useAuthStore(state => state.user)
    useEffect(() => {
        if (!storeUser) return
        setUsuario(storeUser)
        fetchCursosProfesor(storeUser.id);
    }, [storeUser]);

    const fetchCursosProfesor = async (profesorId) => {
        try {
            // Obtener todos los cursos y filtrar por el campo "profesor"
            const resCursos = await fetch('http://localhost:3000/cursos');
            const dataCursos = await resCursos.json();
            const todos = dataCursos.Cursos || [];
            const cursosDelProfesor = todos.filter((c) => c.profesor === profesorId);
            setCursos(cursosDelProfesor);
        } catch (err) {
            console.error(err);
            setError('Error al cargar cursos');
        }
    }
    if (error) return <div>{error}</div>

    return (
        <div className='home-profesor-grid'>
            <h1>Bienvenido/a {usuario ? `${usuario.nombre} ${usuario.apellidos}` : 'Usuario'}</h1>
            <div className="grid-cursos-profesor">
                {cursos.length === 0 ? (
                    <p>No tienes cursos asignados todavía.</p>
                ) : (
                    cursos.map((c) => (
                        <TarjetaCursos
                            key={c.id}
                            name={c.nombreCurso}
                            cursoId={c.id}
                            categoria={c.categoria}
                            nivel={c.nivel}
                            descripcion={c.descripcion}
                            profesor={usuario ? `${usuario.nombre} ${usuario.apellidos}` : ''}
                            valoracion={c.valoracion}
                        />
                    ))
                )}
            </div>
        </div>
    )
}

export default HomeProfesorGrid