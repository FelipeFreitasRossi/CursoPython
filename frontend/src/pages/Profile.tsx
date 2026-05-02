import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { API_URL_DEV } from '../../config';

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    axios
      .get(`${API_URL_DEV}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data))
      .catch(() => {
        setError('Sessão expirada. Faça login novamente.');
        localStorage.removeItem('token');
        setTimeout(() => navigate('/login'), 2000);
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) return <div className="auth-page"><div className="card text-center">Carregando dados...</div></div>;
  if (error) return <div className="auth-page"><div className="card error-message">{error}</div></div>;

  return (
    <>
      <Navbar />
      <div className="auth-page">
        <div className="card" style={{ maxWidth: '550px' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>Meu perfil</h2>
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.75rem', marginBottom: '1.5rem' }}>
            <p><strong>ID:</strong> {user.id}</p>
            <p><strong>E-mail:</strong> {user.email}</p>
            <p><strong>Status do curso:</strong> {user.hasPurchased ? '✅ Liberado' : '⛔ Não comprado'}</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {!user.hasPurchased && (
              <Link to="/courses" className="btn btn-primary" style={{ flex: 1, textAlign: 'center' }}>Comprar curso</Link>
            )}
            {user.hasPurchased && (
              <Link to="/aulas" className="btn btn-primary" style={{ flex: 1, textAlign: 'center' }}>Acessar aulas</Link>
            )}
            <button onClick={handleLogout} className="btn btn-outline" style={{ flex: 1 }}>Sair da conta</button>
          </div>
        </div>
      </div>
    </>
  );
}