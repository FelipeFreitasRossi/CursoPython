import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const API_URL = 'http://localhost:3001';

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
      .get(`${API_URL}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data))
      .catch((err) => {
        setError('Sessão expirada. Faça login novamente.');
        localStorage.removeItem('token');
        setTimeout(() => navigate('/login'), 2000);
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) return <div className="text-center" style={{ marginTop: '3rem' }}>Carregando...</div>;
  if (error) return <div className="text-center text-red-500" style={{ marginTop: '3rem' }}>{error}</div>;

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="card max-w-2xl mx-auto" style={{ marginTop: '2rem' }}>
          <h2 className="text-2xl font-bold mb-4">Meu Perfil</h2>
          <p><strong>ID:</strong> {user.id}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <div style={{ marginTop: '2rem' }}>
            <button
              onClick={() => {
                localStorage.removeItem('token');
                navigate('/login');
              }}
              className="btn btn-danger"
            >
              Sair da conta
            </button>
          </div>
        </div>
      </div>
    </>
  );
}