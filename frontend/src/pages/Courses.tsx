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

  // Redireciona imediatamente se o pagamento foi bem-sucedido
  useEffect(() => {
    const success = searchParams.get('success');
    const canceled = searchParams.get('canceled');
    if (success === 'true') {
      // Redireciona para o perfil após 500ms (apenas para dar tempo de exibir a mensagem, opcional)
      setMessage('✅ Pagamento aprovado! Redirecionando...');
      setTimeout(() => navigate('/profile', { replace: true }), 500);
    } else if (canceled === 'true') {
      setMessageType('error');
      setMessage('❌ Pagamento cancelado. Você pode tentar novamente.');
    }
  }, [searchParams, navigate]);

  const course = {
    title: 'Python Completo',
    price: 19.90,
    description: 'Do zero ao avançado com projetos reais, correção automática e certificado.',
    features: [
      '80+ horas de vídeo',
      '150+ exercícios com correção automática',
      'Projetos práticos (API, automação, análise de dados)',
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
    setMessageType('');
    try {
      const res = await axios.post(
        `${API_URL}/api/create-preference`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.checkoutUrl) {
        window.location.href = res.data.checkoutUrl;
      } else {
        throw new Error('URL de checkout não recebida');
      }
    } catch (err: any) {
      setMessageType('error');
      setMessage(err.response?.data?.error || 'Erro ao iniciar pagamento. Tente novamente.');
    } finally {
      setBuying(false);
    }
  };

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
                  <span className="feature-icon">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
            {message && (
              <div className={`payment-message ${messageType}`}>
                {message}
              </div>
            )}
            <button
              onClick={handleBuy}
              disabled={buying}
              className="payment-button"
            >
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