import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { API_URL } from '../../config';

export default function Courses() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [buying, setBuying] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    const success = searchParams.get('success');
    const canceled = searchParams.get('canceled');
    if (success === 'true') {
      setMessageType('success');
      setMessage('Pagamento aprovado! Seu acesso foi liberado.');
      setTimeout(() => navigate('/profile'), 2000);
    } else if (canceled === 'true') {
      setMessageType('error');
      setMessage('Pagamento cancelado. Você pode tentar novamente.');
    }
  }, [searchParams, navigate]);

  const course = {
    title: 'Python Completo',
    price: 19.90,
    description: 'Domine Python do zero ao avançado com projetos reais, exercícios corrigidos automaticamente e certificado.',
    features: [
      '80+ horas de vídeo',
      '150+ exercícios com correção automática',
      'Projetos práticos: API, automação, análise de dados',
      'Certificado de conclusão',
      'Acesso vitalício'
    ]
  };

  const handleBuy = async () => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');
    setBuying(true);
    try {
      const res = await axios.post(`${API_URL}/api/create-preference`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.checkoutUrl) window.location.href = res.data.checkoutUrl;
      else throw new Error('Sem URL de checkout');
    } catch (err: any) {
      setMessageType('error');
      setMessage(err.response?.data?.error || 'Erro ao iniciar pagamento. Tente mais tarde.');
    } finally {
      setBuying(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="courses-page">
        <div className="courses-header">
          <div className="python-logo-header">
            <img 
              src="https://i.postimg.cc/3N8WrL4W/Logo-Python-removebg-preview.png" 
              alt="Python Logo" 
              style={{ height: '60px', marginBottom: '1rem' }}
            />
          </div>
          <h1>{course.title}</h1>
          <p>Adquira agora e comece sua jornada</p>
        </div>
        <div className="courses-grid">
          <div className="course-card">
            <div className="course-image">
              <img 
                src="https://i.postimg.cc/3N8WrL4W/Logo-Python-removebg-preview.png" 
                alt="Python" 
                style={{ width: '80px', filter: 'brightness(0) invert(1)' }}
              />
            </div>
            <div className="course-content">
              <h2 className="course-title">{course.title}</h2>
              <p className="course-description">{course.description}</p>
              <div className="course-price">R$ {course.price.toFixed(2)}</div>
              <ul className="course-features">
                {course.features.map((f, i) => <li key={i}>{f}</li>)}
              </ul>
              <button onClick={handleBuy} disabled={buying} className="btn-buy">
                {buying ? 'Processando...' : 'Comprar agora'}
              </button>
            </div>
          </div>
        </div>
        {message && (
          <div className={`message-box ${messageType === 'success' ? 'success' : 'error'}`}>
            {message}
          </div>
        )}
      </div>
    </>
  );
}