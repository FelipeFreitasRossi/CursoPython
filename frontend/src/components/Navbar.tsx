import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Navbar() {
  const [menuAberto, setMenuAberto] = useState(false);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    setMenuAberto(false);
  };

  return (
    <>
      <nav className="navbar-landing">
        <div className="container nav-container">
          <div className="logo">
            <img
              src="https://i.postimg.cc/3N8WrL4W/Logo-Python-removebg-preview.png"
              alt="Python Logo"
              className="python-logo-realista"
            />
            <span>PythonPro</span>
          </div>

          {/* Links Desktop */}
          <ul className="nav-links desktop-nav">
            <li><Link to="/">Início</Link></li>
            {token ? (
              <>
                <li><Link to="/courses">Cursos</Link></li>
                <li><Link to="/profile">Perfil</Link></li>
                <li><button onClick={handleLogout} className="link-button">Sair</button></li>
              </>
            ) : (
              <>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Cadastro</Link></li>
              </>
            )}
          </ul>

          {/* Botão Hamburguer (mobile) */}
          <button className="hamburguer" onClick={() => setMenuAberto(!menuAberto)}>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </button>
        </div>
      </nav>

      {/* Menu Lateral Mobile */}
      <div className={`mobile-menu ${menuAberto ? 'aberto' : ''}`}>
        <button className="close-menu" onClick={() => setMenuAberto(false)}>✕</button>
        <ul>
          <li><Link to="/" onClick={() => setMenuAberto(false)}>Início</Link></li>
          {token ? (
            <>
              <li><Link to="/courses" onClick={() => setMenuAberto(false)}>Cursos</Link></li>
              <li><Link to="/profile" onClick={() => setMenuAberto(false)}>Perfil</Link></li>
              <li><button className="btn-aluno-mobile" onClick={handleLogout}>Sair</button></li>
            </>
          ) : (
            <>
              <li><Link to="/login" onClick={() => setMenuAberto(false)}>Login</Link></li>
              <li><Link to="/register" onClick={() => setMenuAberto(false)}>Cadastro</Link></li>
            </>
          )}
        </ul>
      </div>
    </>
  );
}