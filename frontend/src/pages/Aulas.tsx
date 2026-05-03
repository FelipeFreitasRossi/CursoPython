import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { API_URL } from '../../config';

// Conteúdo das seções (textos ricos, códigos, imagens)
const secoes = [
  {
    id: 'preparacao',
    titulo: '🔧 1. Preparando o ambiente',
    icone: '🛠️',
    conteudo: 'Antes de programar, precisamos configurar tudo corretamente. Neste módulo você aprenderá a instalar o Python, o VS Code e fará seu primeiro programa.',
    imagem: 'https://images.unsplash.com/photo-1580894908361-967195033215?w=400&q=80'
  },
  {
    id: 'instalacao-python',
    titulo: '1.1 Instalação do Python',
    icone: '🐍',
    conteudo: `Acesse o site oficial python.org/downloads e baixe a versão mais recente para seu sistema operacional. Durante a instalação no Windows, **marque a opção "Add Python to PATH"** – isso evita problemas futuros. No macOS e Linux, você pode usar o terminal ou baixar o executável.
    Após instalar, abra o terminal (Prompt de Comando no Windows, Terminal no Mac/Linux) e digite: \`python --version\`. Você deve ver a versão instalada.`,
    codigo: 'python --version',
    imagem: 'https://www.python.org/static/img/python-logo.png'
  },
  {
    id: 'instalacao-vscode',
    titulo: '1.2 Instalação do VS Code',
    icone: '📝',
    conteudo: `Visual Studio Code é um editor de código leve, gratuito e altamente extensível. Baixe em code.visualstudio.com e instale.
    Após a instalação, abra o VS Code e vá na aba de extensões (Ctrl+Shift+X). Procure e instale:
    - **Python** (da Microsoft)
    - **Pylance**
    - **Code Runner** (opcional, para executar trechos rapidamente)
    Essas extensões fornecem realce de sintaxe, autocompletar e depuração.`,
    imagem: 'https://code.visualstudio.com/assets/images/code-stable.png'
  },
  {
    id: 'primeiro-programa',
    titulo: '1.3 Primeiro programa: Hello, World!',
    icone: '🌍',
    conteudo: `Crie uma nova pasta para seus projetos. No VS Code, clique em "Open Folder" e selecione essa pasta. Crie um arquivo chamado \`hello.py\` e digite o código ao lado. Para executar, clique no botão play (triângulo) no canto superior direito ou abra o terminal integrado (Ctrl+´) e digite \`python hello.py\`.`,
    codigo: 'print("Olá, mundo!")',
    imagem: 'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=400&q=80'
  },
  {
    id: 'fundamentos',
    titulo: '📘 2. Fundamentos da Linguagem',
    icone: '📘',
    conteudo: `Python é conhecido por sua sintaxe limpa. Nesta seção veremos variáveis, tipos de dados, entrada/saída e estruturas de controle.`,
    codigos: [
      'nome = input("Digite seu nome: ")\nidade = int(input("Digite sua idade: "))\nprint(f"Olá {nome}, você tem {idade} anos.")',
      'if idade >= 18:\n    print("Maior de idade")\nelse:\n    print("Menor de idade")'
    ]
  },
  {
    id: 'estruturas-dados',
    titulo: '🗂️ 3. Estruturas de dados',
    icone: '🗂️',
    conteudo: `Listas, tuplas, dicionários e conjuntos são fundamentais. Uma lista é ordenada e mutável, um dicionário armazena pares chave-valor.`,
    codigos: [
      'frutas = ["maçã", "banana", "laranja"]\nfrutas.append("uva")\nprint(frutas)',
      'aluno = {"nome": "João", "idade": 20}\nprint(aluno["nome"])'
    ]
  },
  {
    id: 'poo',
    titulo: '🧩 4. Programação Orientada a Objetos',
    icone: '🧩',
    conteudo: `Classes e objetos são a base da POO. Uma classe define um molde e um objeto é uma instância dessa classe.`,
    codigo: `class Pessoa:\n    def __init__(self, nome, idade):\n        self.nome = nome\n        self.idade = idade\n    def saudacao(self):\n        return f"Olá, meu nome é {self.nome}"\n\np = Pessoa("Ana", 25)\nprint(p.saudacao())`
  },
  {
    id: 'erros-arquivos',
    titulo: '⚠️ 5. Tratamento de erros e arquivos',
    icone: '⚠️',
    conteudo: `Use try/except para capturar exceções e não parar o programa. Aprenda também a ler e escrever arquivos de texto.`,
    codigos: [
      'try:\n    numero = int(input("Digite um número: "))\n    print(10/numero)\nexcept ZeroDivisionError:\n    print("Não pode dividir por zero")\nexcept ValueError:\n    print("Digite um número válido")',
      'with open("exemplo.txt", "w") as arquivo:\n    arquivo.write("Escrevendo dados")'
    ]
  },
  {
    id: 'projetos',
    titulo: '🚀 6. Próximos passos – Projetos práticos',
    icone: '🚀',
    conteudo: `Com os fundamentos, você pode criar desde um bot de automação até uma API web. Explore bibliotecas como pandas, beautifulsoup e flask. O curso continua com projetos detalhados nas próximas seções!`
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
    // Verifica acesso ao curso (opcional, por enquanto comentamos para exibir conteúdo)
    // Se quiser ativar, descomente o bloco abaixo. Porém, para teste, vamos mostrar o conteúdo.
    setAcessoNegado(false);
    setLoading(false);
  }, [navigate]);

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('secao-visible');
          }
        });
      },
      { threshold: 0.15 }
    );
    document.querySelectorAll('.secao-conteudo').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  if (acessoNegado) {
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
  }

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
          <h1>Conteúdo programático</h1>
          <p>Material completo em texto, exemplos de código e orientações passo a passo</p>
        </div>

        <div className="secoes-container">
          {secoes.map((secao) => (
            <div key={secao.id} className="secao-conteudo">
              <div className="secao-header">
                <div className="secao-titulo">
                  <span className="secao-icone">{secao.icone}</span>
                  <h2>{secao.titulo}</h2>
                </div>
              </div>
              <div className="secao-body">
                <p className="secao-texto">{secao.conteudo}</p>
                {secao.imagem && (
                  <div className="secao-imagem">
                    <img src={secao.imagem} alt={secao.titulo} />
                  </div>
                )}
                {secao.codigo && (
                  <div className="secao-codigos">
                    <h4>Exemplo de código:</h4>
                    <pre><code>{secao.codigo}</code></pre>
                  </div>
                )}
                {secao.codigos && secao.codigos.length > 0 && (
                  <div className="secao-codigos">
                    <h4>Exemplos de código:</h4>
                    {secao.codigos.map((cod, idx) => (
                      <pre key={idx}><code>{cod}</code></pre>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {popup && <div className="popup-success">{popup}</div>}
      </div>
    </>
  );
}