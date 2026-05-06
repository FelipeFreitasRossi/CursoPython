import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import SocialBar from '../components/SocialBar';
import Footer from '../components/Footer';
import { API_URL } from '../../config';
import './Courses.css';

export default function Courses() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [buying, setBuying] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    axios
      .get(`${API_URL}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.hasPurchased) {
          navigate('/profile', { replace: true });
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [navigate]);

  useEffect(() => {
    const success = searchParams.get('success');
    const canceled = searchParams.get('canceled');
    const pending = searchParams.get('pending');

    if (success === 'true') {
      setMessage('✅ Pagamento aprovado! Redirecionando para seu perfil...');
      setTimeout(() => navigate('/profile'), 2000);
    } else if (canceled === 'true') {
      setMessageType('error');
      setMessage('❌ Pagamento cancelado. Você pode tentar novamente.');
    } else if (pending === 'true') {
      setMessageType('error');
      setMessage('⏳ Pagamento pendente. Aguarde a confirmação.');
    }
  }, [searchParams, navigate]);

  const course = {
    title: 'Python Completo',
    price: 19.90,
    description: 'Do zero ao avançado com projetos reais e correção automática.',
    features: [
      '80+ horas de vídeo',
      '150+ exercícios com correção automática',
      'Projetos práticos (API, automação, dados)',
      'Certificado de conclusão',
      'Acesso vitalício',
    ],
  };

  const handleBuy = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    setBuying(true);
    setMessage('');
    try {
      const res = await axios.post(
        `${API_URL}/api/create-preference`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.checkoutUrl) {
        window.location.href = res.data.checkoutUrl;
      } else {
        throw new Error('URL não recebida');
      }
    } catch (err: any) {
      setMessageType('error');
      setMessage(err.response?.data?.error || 'Erro ao iniciar pagamento.');
    } finally {
      setBuying(false);
    }
  };

  if (loading) return <div className="loading-screen">Carregando...</div>;

  return (
    <>
      <Navbar />
      <div className="payment-page">
        <div className="payment-container">
          <div className="payment-card">
            <div className="payment-header">
              <img
                src="https://i.postimg.cc/3N8WrL4W/Logo-Python-removebg-preview.png"
                alt="Python Logo"
                className="payment-logo"
              />
              <h1>{course.title}</h1>
              <p className="payment-description">{course.description}</p>
            </div>
            <div className="payment-price">
              <span className="price-currency">R$</span>
              <span className="price-value">{course.price.toFixed(2)}</span>
            </div>
            <ul className="payment-features">
              {course.features.map((feature, idx) => (
                <li key={idx}>
                  <span className="feature-icon">✓</span> {feature}
                </li>
              ))}
            </ul>
            {message && (
              <div className={`payment-message ${messageType === 'success' ? 'success' : 'error'}`}>
                {message}
              </div>
            )}
            <button onClick={handleBuy} disabled={buying} className="payment-button">
              {buying ? 'Processando...' : `Comprar agora - R$ ${course.price.toFixed(2)}`}
            </button>
            <div className="payment-guarantee">
              <span>🔒</span> Pagamento 100% seguro via Mercado Pago
            </div>
          </div>
        </div>
        <SocialBar />
      </div>
      <Footer />
    </>
  );
}