import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { API_URL } from '../../config';

interface Aula {
  id: number;
  titulo: string;
  descricao: string;
  videoUrl: string;
  duracao: string;
  modulo?: string;
}

interface Modulo {
  nome: string;
  aulas: Aula[];
  icone: string;
}

export default function Aulas() {
  const [modulos, setModulos] = useState<Modulo[]>([]);
  const [loading, setLoading] = useState(true);
  const [acessoNegado, setAcessoNegado] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const success = searchParams.get('success');
  const [popup, setPopup] = useState('');

  useEffect(() => {
    if (success === 'true') {
      setPopup('✅ Pagamento confirmado! Todas as aulas foram liberadas.');
      setTimeout(() => setPopup(''), 4000);
    }
  }, [success]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    axios
      .get(`${API_URL}/api/aulas`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const aulasPlanas: Aula[] = res.data;
        // Agrupar aulas em módulos (definição manual baseada nos títulos)
        const grupos: { [key: string]: Aula[] } = {
          'Fundamentos': [],
          'Estruturas de Dados': [],
          'Programação Orientada a Objetos': [],
          'Projetos Práticos': [],
        };
        aulasPlanas.forEach((aula) => {
          if (aula.titulo.toLowerCase().includes('variável') || aula.titulo.toLowerCase().includes('função') || aula.titulo.toLowerCase().includes('introdução')) {
            grupos['Fundamentos'].push(aula);
          } else if (aula.titulo.toLowerCase().includes('lista') || aula.titulo.toLowerCase().includes('dicionário')) {
            grupos['Estruturas de Dados'].push(aula);
          } else if (aula.titulo.toLowerCase().includes('classe') || aula.titulo.toLowerCase().includes('objeto')) {
            grupos['Programação Orientada a Objetos'].push(aula);
          } else {
            grupos['Projetos Práticos'].push(aula);
          }
        });
        // Montar array de módulos
        const modulosArray: Modulo[] = [
          { nome: 'Fundamentos', aulas: grupos['Fundamentos'], icone: '🐍' },
          { nome: 'Estruturas de Dados', aulas: grupos['Estruturas de Dados'], icone: '📚' },
          { nome: 'Programação Orientada a Objetos', aulas: grupos['Programação Orientada a Objetos'], icone: '🧩' },
          { nome: 'Projetos Práticos', aulas: grupos['Projetos Práticos'], icone: '⚙️' },
        ].filter(mod => mod.aulas.length > 0);
        setModulos(modulosArray);
        setLoading(false);
      })
      .catch((err) => {
        if (err.response?.status === 403) setAcessoNegado(true);
        else console.error(err);
        setLoading(false);
      });
  }, [navigate]);

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('modulo-visible');
          }
        });
      },
      { threshold: 0.2 }
    );
    document.querySelectorAll('.modulo-card').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [modulos]);

  if (loading)
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
      </div>
    );

  if (acessoNegado)
    return (
      <>
        <Navbar />
        <div className="glass-container">
          <div className="glass-card">
            <h2>Acesso restrito</h2>
            <p>Você ainda não adquiriu este curso.</p>
            <button onClick={() => navigate('/courses')} className="btn-buy">
              Adquirir agora
            </button>
          </div>
        </div>
      </>
    );

  return (
    <>
      <Navbar />
      <div className="aulas-dashboard">
        <div className="aulas-header">
          <img
            src="https://i.postimg.cc/3N8WrL4W/Logo-Python-removebg-preview.png"
            alt="Python Logo"
            className="python-logo-header"
          />
          <h1>Conteúdo do Curso</h1>
          <p>Domine Python com aulas organizadas por módulos</p>
        </div>

        <div className="modulos-grid">
          {modulos.map((modulo, idx) => (
            <div key={idx} className="modulo-card">
              <div className="modulo-header">
                <span className="modulo-icon">{modulo.icone}</span>
                <h2>{modulo.nome}</h2>
              </div>
              <div className="aulas-list">
                {modulo.aulas.map((aula) => (
                  <div key={aula.id} className="aula-item">
                    <div className="aula-info">
                      <span className="aula-titulo">{aula.titulo}</span>
                      <span className="aula-duracao">⏱️ {aula.duracao}</span>
                    </div>
                    <button
                      className="btn-assistir-aula"
                      onClick={() => window.open(aula.videoUrl, '_blank')}
                    >
                      Assistir
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {popup && <div className="popup-success">{popup}</div>}
      </div>
    </>
  );
}