import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

const API_URL = 'http://localhost:3001';

export default function Courses() {
  const navigate = useNavigate();
  const [buying, setBuying] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const courses = [
    { id: 'python-basico', title: 'Python Básico', price: 9700, description: 'Fundamentos, lógica de programação e primeiros projetos.' },
    { id: 'python-avancado', title: 'Python Avançado', price: 19700, description: 'POO, APIs, web scraping e análise de dados.' },
  ];

  const handleBuy = async (courseId: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    setBuying(courseId);
    setMessage('');
    try {
      const res = await axios.post(
        `${API_URL}/api/create-checkout-session`,
        { courseId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.checkoutUrl) {
        window.location.href = res.data.checkoutUrl;
      } else {
        setMessage('Link de pagamento não recebido. Tente novamente.');
      }
    } catch (err: any) {
      setMessage(err.response?.data?.error || 'Erro ao iniciar pagamento. Backend não configurado ainda.');
    } finally {
      setBuying(null);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container" style={{ padding: '2rem 1.5rem' }}>
        <h1 className="text-2xl font-bold">Nossos Cursos</h1>
        <p className="mb-4">Escolha o curso que melhor se adapta ao seu objetivo.</p>

        {message && <div className="card" style={{ backgroundColor: '#fee2e2', color: '#b91c1c' }}>{message}</div>}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
          {courses.map((course) => (
            <div key={course.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 className="text-xl font-bold">{course.title}</h3>
                <p style={{ color: '#475569', marginTop: '0.5rem' }}>{course.description}</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: '1rem' }}>
                  R$ {(course.price / 100).toFixed(2)}
                </p>
              </div>
              <button
                onClick={() => handleBuy(course.id)}
                disabled={buying === course.id}
                className="btn btn-primary"
                style={{ marginTop: '1.5rem', width: '100%' }}
              >
                {buying === course.id ? 'Processando...' : 'Comprar agora'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}