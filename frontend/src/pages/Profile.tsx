import { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { API_URL } from '../../config';

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');
    axios.get(`${API_URL}/api/profile`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setUser(res.data))
      .catch(() => {
        setError('Sessão expirada. Faça login novamente.');
        localStorage.removeItem('token');
        setTimeout(() => navigate('/login'), 2000);
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  // Efeito de scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('card-visible');
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal-card').forEach(card => observer.observe(card));
    return () => observer.disconnect();
  }, [loading]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;
  if (error) return <div className="auth-page"><div className="auth-card error-message">{error}</div></div>;

  const firstName = user?.name?.split(' ')[0] || 'Aluno';
  const progressPercentage = user?.hasPurchased ? 35 : 0;

  return (
    <>
      <Navbar />
      <div className="profile-container">
        {/* Cabeçalho */}
        <div className="profile-header">
          <div>
            <h1>Olá, {firstName} 👋</h1>
            <p>Seu progresso em Python está sendo registrado.</p>
          </div>
          <button onClick={handleLogout} className="btn-logout">Sair</button>
        </div>

        {/* Grid de cards com scroll reveal */}
        <div className="profile-grid">
          {/* Card 1 – Status do curso */}
          <div className="profile-card reveal-card">
            <div className="card-icon">🎓</div>
            <h3>Curso Python Completo</h3>
            <div className="status-badge">
              Status: <span className={user.hasPurchased ? 'badge-success' : 'badge-pending'}>
                {user.hasPurchased ? '✅ LIBERADO' : '⛔ NÃO COMPRADO'}
              </span>
            </div>
            {!user.hasPurchased ? (
              <Link to="/courses" className="btn-primary-card">Adquirir agora</Link>
            ) : (
              <Link to="/aulas" className="btn-primary-card">Acessar aulas</Link>
            )}
          </div>

          {/* Card 2 – Progresso com barra animada */}
          <div className="profile-card reveal-card">
            <div className="card-icon">📊</div>
            <h3>Progresso geral</h3>
            <div className="progress-section">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progressPercentage}%` }}></div>
              </div>
              <p>{progressPercentage}% concluído</p>
            </div>
            <p className="progress-note">
              {progressPercentage === 0 ? 'Adquira o curso para destravar o conteúdo' : 'Continue assim!'}
            </p>
          </div>

          {/* Card 3 – Informações pessoais */}
          <div className="profile-card reveal-card">
            <div className="card-icon">👤</div>
            <h3>Seu perfil</h3>
            <div className="info-line"><strong>Nome</strong> {user.name}</div>
            <div className="info-line"><strong>E-mail</strong> {user.email}</div>
            <div className="info-line"><strong>ID</strong> #{user.id}</div>
          </div>

          {/* Card 4 – Próximos passos / Conquistas (mock) */}
          <div className="profile-card reveal-card">
            <div className="card-icon">🏆</div>
            <h3>Próximos objetivos</h3>
            <ul className="goals-list">
              <li>Concluir o módulo 1 – Fundamentos</li>
              <li>Resolver 5 exercícios com correção automática</li>
              <li>Participar da comunidade</li>
            </ul>
          </div>
        </div>

        {/* Rodapé motivacional */}
        <div className="profile-footer">
          💡 “A prática leva à perfeição. Continue codificando!”
        </div>
      </div>
    </>
  );
}