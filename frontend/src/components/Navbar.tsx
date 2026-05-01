import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav style={{ backgroundColor: '#0f172a', color: 'white', padding: '1rem 0' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link 
          to="/" 
          style={{ 
            color: 'white', 
            textDecoration: 'none', 
            fontWeight: 'bold', 
            fontSize: '1.25rem', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem' 
          }}
        >
          <img 
            src="https://i.postimg.cc/3N8WrL4W/Logo-Python-removebg-preview.png" 
            alt="Python Logo" 
            style={{ height: '32px', width: 'auto' }}
          />
          <span>PythonPro</span>
        </Link>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link to="/" style={{ color: '#e2e8f0', textDecoration: 'none' }}>Início</Link>
          {!token ? (
            <>
              <Link to="/login" style={{ color: '#e2e8f0', textDecoration: 'none' }}>Login</Link>
              <Link to="/register" style={{ color: '#e2e8f0', textDecoration: 'none' }}>Cadastro</Link>
            </>
          ) : (
            <>
              <Link to="/courses" style={{ color: '#e2e8f0', textDecoration: 'none' }}>Cursos</Link>
              <Link to="/profile" style={{ color: '#e2e8f0', textDecoration: 'none' }}>Perfil</Link>
              <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#e2e8f0', cursor: 'pointer' }}>
                Sair
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}