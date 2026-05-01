import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

const API_URL = 'http://localhost:3001';

interface Aula {
  id: number;
  titulo: string;
  descricao: string;
  videoUrl: string;
  duracao: string;
}

export default function Aulas() {
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [loading, setLoading] = useState(true);
  const [acessoNegado, setAcessoNegado] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Verificar se o usuário tem acesso ao curso e buscar as aulas
    axios
      .get(`${API_URL}/api/aulas`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setAulas(res.data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.response?.status === 403) {
          setAcessoNegado(true);
        } else {
          console.error(err);
        }
        setLoading(false);
      });
  }, [navigate]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="auth-page">
          <div className="card text-center">Carregando aulas...</div>
        </div>
      </>
    );
  }

  if (acessoNegado) {
    return (
      <>
        <Navbar />
        <div className="auth-page">
          <div className="card text-center">
            <h2>Acesso negado</h2>
            <p>Você ainda não adquiriu este curso. </p>
            <button onClick={() => navigate('/courses')} className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Adquirir agora
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="auth-page" style={{ display: 'block', padding: '2rem' }}>
        <div className="container">
          <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Conteúdo do curso</h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {aulas.map((aula) => (
              <div key={aula.id} className="card" style={{ padding: '1rem' }}>
                <h3 style={{ marginBottom: '0.5rem' }}>{aula.titulo}</h3>
                <p style={{ color: '#475569', marginBottom: '0.5rem' }}>{aula.descricao}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Duração: {aula.duracao}</span>
                  <button
                    className="btn btn-primary"
                    style={{ padding: '0.3rem 1rem', fontSize: '0.8rem' }}
                    onClick={() => window.open(aula.videoUrl, '_blank')}
                  >
                    Assistir aula
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}