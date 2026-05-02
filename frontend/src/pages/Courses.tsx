import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { API_URL_DEV } from '../../config';

export default function Courses() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [buying, setBuying] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

  useEffect(() => {
    const success = searchParams.get('success');
    const canceled = searchParams.get('canceled');
    if (success === 'true') {
      setMessageType('success');
      setMessage('Pagamento aprovado! Seu acesso foi liberado.');
      window.history.replaceState({}, '', '/courses');
    } else if (canceled === 'true') {
      setMessageType('error');
      setMessage('Pagamento cancelado. Você pode tentar novamente.');
      window.history.replaceState({}, '', '/courses');
    }
  }, [searchParams]);

  const course = {
    id: 'python-completo',
    title: 'Python Completo',
    price: 19.90,
    description: 'Do zero ao avançado com projetos reais e correção automática.',
    features: [
      '80+ horas de vídeo',
      '150+ exercícios com correção automática',
      'Projetos práticos (API, automação, análise de dados)',
      'Certificado de conclusão',
      'Acesso vitalício'
    ]
  };

  const handleBuy = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    setBuying(true);
    setMessage('');
    setMessageType('');
    try {
      const res = await axios.post(
        `${API_URL_DEV}/api/create-preference`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.checkoutUrl) {
        window.location.href = res.data.checkoutUrl;
      } else {
        throw new Error('URL de checkout não retornada');
      }
    } catch (err: any) {
      console.error(err);
      setMessageType('error');
      setMessage(err.response?.data?.error || 'Erro ao iniciar pagamento. Tente mais tarde.');
    } finally {
      setBuying(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="auth-page">
        <div className="card" style={{ maxWidth: '600px' }}>
          <h2 className="text-center" style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>
            {course.title}
          </h2>
          <p style={{ textAlign: 'center', color: '#475569', marginBottom: '1rem' }}>
            {course.description}
          </p>
          <div style={{ textAlign: 'center', fontSize: '2.5rem', fontWeight: 'bold', color: '#1e3a5f', marginBottom: '1.5rem' }}>
            R$ {course.price.toFixed(2)}
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>O que você vai aprender:</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {course.features.map((feature, idx) => (
                <li key={idx} style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: '#10b981' }}>✓</span> {feature}
                </li>
              ))}
            </ul>
          </div>
          {message && (
            <div className={messageType === 'success' ? 'success-message' : 'error-message'}>
              {message}
            </div>
          )}
          <button
            onClick={handleBuy}
            disabled={buying}
            className="btn btn-primary"
            style={{ width: '100%' }}
          >
            {buying ? 'Processando...' : `Comprar agora - R$ ${course.price.toFixed(2)}`}
          </button>
        </div>
      </div>
    </>
  );
}