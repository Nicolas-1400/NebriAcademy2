// ── COMPONENTE ──────────────────────────────────────────────────────────────
// Genera un avatar visual. Si no se provee imagen, genera un círculo con iniciales y color aleatorio basado en el nombre.
const Avatar = ({ name, src, size = '40px' }) => {
  // ── FUNCIONES ──────────────────────────────────────────────────────────────────
  // Extrae la primera letra del nombre y apellido para formar las iniciales (Ej: Juan Perez -> JP)
  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0][0].toUpperCase();
  };

  // Asigna un color fijo de una paleta predefinida basado en el hash del string del nombre
  // Esto asegura que el mismo nombre siempre tenga el mismo color.
  const getRandomColor = (name) => {
    const colors = [
      '#C2002F', // Rojo Nebrija
      '#2C3E50', // Azul Medianoche
      '#1A1A1A', // Carbón
      '#8E44AD', // Púrpura
      '#2980B9', // Azul
      '#27AE60', // Verde
      '#D35400', // Naranja Oscuro
      '#7F8C8D', // Gris Sólido
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  // Configuración de estilo en línea para flexibilizar su uso en diferentes contenedores
  const style = {
    width: size,
    height: size,
    fontSize: `calc(${size} * 0.45)`,
    backgroundColor: src ? 'transparent' : getRandomColor(name || 'User'),
    color: 'white', // Aseguramos letra blanca para contraste
  };

  // ── RENDER ───────────────────────────────────────────────────────────────────
  return (
    <div className="avatar-container" style={style}>
      {src ? (
        <img src={src} alt={name} className="avatar-img" />
      ) : (
        <span className="avatar-initials">{getInitials(name)}</span>
      )}
    </div>
  );
};

export default Avatar;
