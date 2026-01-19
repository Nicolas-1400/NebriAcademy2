

function LoginGrid() {

  return (
    <div className="login-grid">
      <div className="formulario-login-contenedor">
        <form className="formulario-login">
          <input type="text" placeholder="Usuario" />
          <input type="password" placeholder="Contraseña" />
          <button type="button" >
            Iniciar Sesión
          </button>
        </form>

        <a href="/">Crear cuenta</a>
      </div>
    </div>
  );
}

export default LoginGrid;
