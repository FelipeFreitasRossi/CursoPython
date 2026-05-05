import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import SocialBar from '../components/SocialBar';
import Footer from '../components/Footer';
import { API_URL } from '../../config';
import './Profile.css';

const DICAS = [
  "✨ Revise o código que você escreveu ontem – ajuda a fixar.",
  "🐍 Use list comprehension para deixar seu código mais limpo.",
  "🧪 Teste pequenos trechos no terminal interativo (REPL).",
  "📘 Leia a documentação oficial sempre que tiver dúvida.",
  "🤝 Ajude um colega no fórum – ensinar é a melhor forma de aprender.",
  "🎯 Defina uma meta pequena para hoje: 20 minutos de prática.",
  "🔁 Pratique refatorar um código antigo – você vai aprender algo novo.",
  "📝 Anote as dúvidas para pesquisar depois – são oportunidades de aprendizado.",
];

const getDicaDoDia = () => {
  const today = new Date().toDateString();
  const storedDate = localStorage.getItem('dica_date');
  const storedDica = localStorage.getItem('dica_text');
  if (storedDate === today && storedDica) return storedDica;
  const newDica = DICAS[Math.floor(Math.random() * DICAS.length)];
  localStorage.setItem('dica_date', today);
  localStorage.setItem('dica_text', newDica);
  return newDica;
};

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem('dashboard_goals');
    if (saved) return JSON.parse(saved);
    return [
      { text: 'Concluir o módulo 1 — Fundamentos', done: false },
      { text: 'Resolver 5 exercícios com correção automática', done: false },
      { text: 'Participar da comunidade', done: false },
      { text: 'Concluir o módulo 2 — Funções', done: false },
    ];
  });

  const toggleGoal = (index: number) => {
    setGoals((prev: any[]) => {
      const newGoals = [...prev];
      newGoals[index] = { ...newGoals[index], done: !newGoals[index].done };
      localStorage.setItem('dashboard_goals', JSON.stringify(newGoals));
      return newGoals;
    });
  };

  const [streak, setStreak] = useState(() => {
    const stored = localStorage.getItem('dashboard_streak');
    return stored ? parseInt(stored) : 0;
  });
  const [lastStudyDate, setLastStudyDate] = useState(() => localStorage.getItem('dashboard_last_study') || '');
  const [popupMessage, setPopupMessage] = useState('');
  const [popupVisible, setPopupVisible] = useState(false);

  const showPopup = (message: string, duration = 3000) => {
    setPopupMessage(message);
    setPopupVisible(true);
    setTimeout(() => setPopupVisible(false), duration);
  };

  const registerStudyDay = () => {
    const today = new Date().toDateString();
    if (lastStudyDate === today) {
      showPopup('📅 Você já registrou estudo hoje! Continue amanhã.', 2000);
      return;
    }
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const isConsecutive = lastStudyDate === yesterday.toDateString();
    const newStreak = isConsecutive ? streak + 1 : 1;
    setStreak(newStreak);
    setLastStudyDate(today);
    localStorage.setItem('dashboard_streak', newStreak.toString());
    localStorage.setItem('dashboard_last_study', today);

    if (newStreak === 1) showPopup('🎉 Primeiro dia de estudo! Continue assim!', 3000);
    else if (newStreak === 5) showPopup('🔥 5 dias seguidos! Você está pegando o ritmo!', 3000);
    else if (newStreak === 10) showPopup('🏆 10 dias! Parabéns pela disciplina!', 3000);
    else if (newStreak % 7 === 0) showPopup(`🎯 ${newStreak} dias! Sequência impecável!`, 3000);
    else showPopup(`✅ Estudo registrado! Sequência atual: ${newStreak} dia(s)`, 2500);
  };

  const weekDays = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'];
  const streakDaysArray = Array(7).fill(false).map((_, i) => i < Math.min(streak, 7));

  const [dica, setDica] = useState(getDicaDoDia);
  const refreshDica = () => {
    const newDica = DICAS[Math.floor(Math.random() * DICAS.length)];
    setDica(newDica);
    localStorage.setItem('dica_date', new Date().toDateString());
    localStorage.setItem('dica_text', newDica);
  };

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

  if (loading) return <div className="loading-screen">Carregando...</div>;
  if (error) return <div className="error-screen">{error}</div>;

  const firstName = user?.name?.split(' ')[0] || 'Aluno';
  const initials = user?.name?.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase() || 'AL';
  const progressPercentage = user?.hasPurchased ? 35 : 0;

  const modules = [
    { id: 1, title: 'Módulo 1 — Fundamentos', lessons: 8, hours: '3h 20min', state: progressPercentage > 0 ? 'done' : 'locked' },
    { id: 2, title: 'Módulo 2 — Funções e Escopo', lessons: 6, hours: '2h 10min', state: progressPercentage > 0 ? 'active' : 'locked' },
    { id: 3, title: 'Módulo 3 — POO', lessons: 10, hours: '4h', state: 'locked' },
    { id: 4, title: 'Módulo 4 — Banco de Dados', lessons: 8, hours: '3h 30min', state: 'locked' },
    { id: 5, title: 'Módulo 5 — Projeto Final', lessons: 5, hours: '2h', state: 'locked' },
  ];

  const moduleStateIcon = (state: string) => (state === 'done' ? '✅' : state === 'active' ? '▶' : '🔒');
  const moduleStateLabel = (state: string) => (state === 'done' ? 'Concluído' : state === 'active' ? 'Em progresso' : 'Bloqueado');

  return (
    <div className="dash">
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-logo">
          <div className="logo-icon">🐍</div>
          <span className="logo-text">PythonPro</span>
          <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>✕</button>
        </div>
        <nav className="sidebar-nav">
          <span className="nav-section">Menu</span>
          <div className="nav-item active"><span className="nav-icon">📊</span> Dashboard</div>
          {user?.hasPurchased ? (
            <Link to="/aulas" className="nav-item" onClick={() => setSidebarOpen(false)}><span className="nav-icon">📚</span> Aulas</Link>
          ) : (
            <Link to="/courses" className="nav-item" onClick={() => setSidebarOpen(false)}><span className="nav-icon">🛒</span> Comprar</Link>
          )}
          <div className="nav-item"><span className="nav-icon">✏️</span> Exercícios</div>
          <div className="nav-item"><span className="nav-icon">🏆</span> Conquistas</div>
          <span className="nav-section">Conta</span>
          <div className="nav-item"><span className="nav-icon">👤</span> Perfil</div>
          <div className="nav-item"><span className="nav-icon">⚙️</span> Configurações</div>
        </nav>
        <div className="sidebar-user">
          <div className="avatar-sm">{initials}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user.name}</div>
            <div className="sidebar-user-role">{user.hasPurchased ? 'Plano Completo' : 'Sem plano'}</div>
          </div>
          <button className="logout-icon-btn" onClick={handleLogout} title="Sair">⏏</button>
        </div>
      </aside>

      <main className="dash-main">
        <header className="dash-topbar">
          <div className="topbar-left">
            <button className={`hamburger ${sidebarOpen ? 'active' : ''}`} onClick={() => setSidebarOpen(!sidebarOpen)}>
              <span className="bar"></span><span className="bar"></span><span className="bar"></span>
            </button>
            <div className="greeting"><h1>Olá, {firstName} 👋</h1><p>{user.hasPurchased ? 'Continue de onde parou!' : 'Adquira o curso para começar.'}</p></div>
          </div>
          <div className="topbar-right">
            {user.hasPurchased ? <Link to="/aulas" className="btn-continue">▶ Estudar</Link> : <Link to="/courses" className="btn-continue btn-buy">🛒 Adquirir</Link>}
          </div>
        </header>

        <section className="stats-row">
          <div className="stat-card"><div className="stat-icon-wrap">📖</div><div className="stat-label">Aulas</div><div className="stat-value">{user.hasPurchased ? '14' : '0'}</div><div className="stat-badge badge-blue">{user.hasPurchased ? '+2' : 'Nenhuma'}</div></div>
          <div className="stat-card"><div className="stat-icon-wrap">⏱</div><div className="stat-label">Horas</div><div className="stat-value">{user.hasPurchased ? '8h' : '0h'}</div><div className="stat-badge badge-green">Meta: 10h</div></div>
          <div className="stat-card"><div className="stat-icon-wrap">🎯</div><div className="stat-label">Progresso</div><div className="stat-value">{progressPercentage}%</div><div className="stat-badge badge-yellow">{progressPercentage > 0 ? 'Andamento' : 'Não iniciado'}</div></div>
          <div className="stat-card"><div className="stat-icon-wrap">🔥</div><div className="stat-label">Sequência</div><div className="stat-value">{streak}</div><div className="stat-badge badge-red">{streak > 0 ? 'Ativa' : 'Sem sequência'}</div></div>
        </section>

        <div className="content-grid">
          <div className="col-left">
            <div className="course-card">
              <div className="course-card-header"><div className="course-badge">🐍 Python</div><div className={`course-status ${user.hasPurchased ? 'status-active' : 'status-locked'}`}>{user.hasPurchased ? '✅ LIBERADO' : '⛔ BLOQUEADO'}</div></div>
              <h2 className="course-title">Python do Zero ao Profissional</h2>
              <p className="course-desc">{user.hasPurchased ? 'Continue sua jornada!' : 'Adquira o curso para ter acesso.'}</p>
              <div className="progress-block"><div className="progress-row-label"><span>Progresso</span><strong>{progressPercentage}%</strong></div><div className="pbar"><div className="pfill" style={{ width: `${progressPercentage}%` }} /></div></div>
              <div className="course-meta-row"><span className="meta-chip">📚 5 módulos</span><span className="meta-chip">📄 37 aulas</span><span className="meta-chip">⏱ 15h</span><span className="meta-chip">🏅 Certificado</span></div>
              <div className="course-card-actions">{user.hasPurchased ? <Link to="/aulas" className="btn-primary-action">▶ Continuar</Link> : <Link to="/courses" className="btn-primary-action btn-buy-action">🛒 Adquirir</Link>}</div>
            </div>
            <div className="modules-list">
              {modules.map(mod => (
                <div key={mod.id} className={`module-item mod-${mod.state}`} onClick={() => mod.state !== 'locked' && navigate('/aulas')} style={{ cursor: mod.state !== 'locked' ? 'pointer' : 'not-allowed' }}>
                  <div className={`mod-icon-box mod-icon-${mod.state}`}>{moduleStateIcon(mod.state)}</div>
                  <div className="mod-info"><div className="mod-title">{mod.title}</div><div className="mod-sub">{mod.lessons} aulas · {mod.hours}</div></div>
                  <span className={`mod-badge mod-badge-${mod.state}`}>{moduleStateLabel(mod.state)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="col-right">
            <div className="widget-card">
              <div className="avatar-lg">{initials}</div><div className="profile-name">{user.name}</div><div className="profile-email">{user.email}</div><div className="profile-id">ID #{user.id}</div>
              <div className={`plan-pill ${user.hasPurchased ? 'plan-active' : 'plan-none'}`}>{user.hasPurchased ? '🎓 Plano Completo' : '⛔ Sem plano'}</div>
              <div className="profile-stats-grid"><div className="pstat"><div className="pstat-val">{user.hasPurchased ? '14' : '0'}</div><div className="pstat-label">Aulas</div></div><div className="pstat"><div className="pstat-val">{user.hasPurchased ? '3' : '0'}</div><div className="pstat-label">Exercícios</div></div></div>
              <button className="btn-logout-widget" onClick={handleLogout}>Sair</button>
            </div>
            <div className="widget-card">
              <div className="streak-top"><div className="streak-label-top">Sequência</div><div className="streak-num">{streak} dias 🔥</div></div>
              <div className="streak-days">{weekDays.map((day, i) => <div key={i} className={`day-dot ${streakDaysArray[i] ? 'day-done' : 'day-miss'}`}>{day}</div>)}</div>
              <button onClick={registerStudyDay} className="btn-study-today">✅ Estudei hoje</button>
              <p className="streak-hint">Registre seus dias de estudo!</p>
            </div>
            <div className="widget-card">
              <div className="section-label">Objetivos</div>
              {goals.map((goal: any, i: number) => (
                <div key={i} className="goal-row" onClick={() => toggleGoal(i)}>
                  <div className={`goal-check ${goal.done ? 'check-done' : 'check-todo'}`}>{goal.done ? '✓' : ''}</div>
                  <span className={`goal-text ${goal.done ? 'goal-done' : ''}`}>{goal.text}</span>
                </div>
              ))}
            </div>
            <div className="widget-card widget-tip">
              <div className="section-label">Dica do dia</div>
              <p>💡 {dica}</p>
              <button onClick={refreshDica} className="refresh-tip">🔄 Nova dica</button>
            </div>
          </div>
        </div>
        <SocialBar />
        <Footer />
      </main>
      {popupVisible && <div className="popup-toast"><span className="popup-icon">🎓</span><span className="popup-text">{popupMessage}</span></div>}
    </div>
  );
}