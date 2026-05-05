import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { API_URL } from '../../config';
import './Aulas.css';

const secoes = [
  {
    id: 'preparacao',
    titulo: '🔧 1. Preparando o ambiente',
    icon: '🛠️',
    conteudo: 'Antes de programar, precisamos configurar tudo corretamente. Neste módulo você aprenderá a instalar o Python, o VS Code e fará seu primeiro programa.',
    imagem: 'https://images.unsplash.com/photo-1580894908361-967195033215?w=400&q=80'
  },
  {
    id: 'instalacao-python',
    titulo: '1.1 Instalação do Python',
    icon: '🐍',
    conteudo: `Acesse o site oficial python.org/downloads e baixe a versão mais recente. Durante a instalação no Windows, marque "Add Python to PATH". Verifique com \`python --version\`.`,
    codigo: 'python --version',
    imagem: 'https://www.python.org/static/img/python-logo.png'
  },
  {
    id: 'instalacao-vscode',
    titulo: '1.2 Instalação do VS Code',
    icon: '📝',
    conteudo: 'Baixe e instale o Visual Studio Code em code.visualstudio.com. Após instalar, adicione as extensões: Python (Microsoft), Pylance e Code Runner.',
    imagem: 'https://code.visualstudio.com/assets/images/code-stable.png'
  },
  {
    id: 'fundamentos',
    titulo: '📘 2. Fundamentos da Linguagem',
    icon: '📘',
    conteudo: 'Variáveis, tipos de dados, entrada/saída e estruturas condicionais.',
    codigos: [
      'nome = input("Digite seu nome: ")\nidade = int(input("Digite sua idade: "))\nprint(f"Olá {nome}, você tem {idade} anos.")',
      'if idade >= 18:\n    print("Maior de idade")\nelse:\n    print("Menor de idade")'
    ]
  }
];

export default function Aulas() {
  const [acessoNegado, setAcessoNegado] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const success = searchParams.get('success');
  const [popup, setPopup] = useState('');

  useEffect(() => {
    if (success === 'true') {
      setPopup('✅ Pagamento confirmado! Todo o conteúdo está liberado.');
      setTimeout(() => setPopup(''), 4000);
    }
  }, [success]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetch(`${API_URL}/api/aulas`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (res.status === 403) setAcessoNegado(true);
        else return res.json();
      })
      .catch(() => setAcessoNegado(true))
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;
  if (acessoNegado) return (
    <>
      <Navbar />
      <div className="glass-container"><div className="glass-card"><h2>Acesso restrito</h2><p>Você ainda não adquiriu este curso.</p><button onClick={() => navigate('/courses')} className="btn-buy">Adquirir agora</button></div></div>
    </>
  );

  return (
    <>
      <Navbar />
      <div className="aulas-dashboard">
        <div className="aulas-header">
          <img src="https://i.postimg.cc/3N8WrL4W/Logo-Python-removebg-preview.png" alt="Python Logo" className="python-logo-header" />
          <h1>Conteúdo programático</h1>
          <p>Material completo em texto, exemplos de código e orientações passo a passo</p>
        </div>
        <div className="secoes-container">
          {secoes.map(secao => (
            <div key={secao.id} className="secao-conteudo">
              <div className="secao-header"><div className="secao-titulo"><span className="secao-icone">{secao.icon}</span><h2>{secao.titulo}</h2></div></div>
              <div className="secao-body">
                <p className="secao-texto">{secao.conteudo}</p>
                {secao.imagem && <div className="secao-imagem"><img src={secao.imagem} alt={secao.titulo} /></div>}
                {secao.codigo && <div className="secao-codigos"><pre><code>{secao.codigo}</code></pre></div>}
                {secao.codigos && secao.codigos.map((cod, idx) => <div key={idx} className="secao-codigos"><pre><code>{cod}</code></pre></div>)}
              </div>
            </div>
          ))}
        </div>
        {popup && <div className="popup-success">{popup}</div>}
      </div>
    </>
  );
}