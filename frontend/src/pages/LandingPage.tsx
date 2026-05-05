import { useEffect, useRef, useState } from 'react';
import SocialBar from '../components/SocialBar';
import Footer from '../components/Footer';
import './LandingPage.css';

export default function LandingPage() {
  const [menuAberto, setMenuAberto] = useState(false);
  const scrollRevealRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('ativo');
        });
      },
      { threshold: 0.2 }
    );
    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach((el) => observer.observe(el));
    scrollRevealRef.current = observer;

    if (menuAberto) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }

    return () => {
      if (scrollRevealRef.current) scrollRevealRef.current.disconnect();
      document.body.classList.remove('menu-open');
    };
  }, [menuAberto]);

  const scrollToSection = (id: string) => {
    setMenuAberto(false);
    const section = document.getElementById(id);
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="landing-page">
      {/* Navbar */}
      <nav className="navbar-landing">
        <div className="container nav-container">
          <div className="logo">
            <img src="https://i.postimg.cc/3N8WrL4W/Logo-Python-removebg-preview.png" alt="Python Logo" className="python-logo-realista" />
            <span>PythonPro</span>
          </div>
          <ul className="nav-links desktop-nav">
            <li><a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>Início</a></li>
            <li><a href="#diferenciais" onClick={(e) => { e.preventDefault(); scrollToSection('diferenciais'); }}>Diferenciais</a></li>
            <li><a href="#depoimentos" onClick={(e) => { e.preventDefault(); scrollToSection('depoimentos'); }}>Depoimentos</a></li>
            <li><a href="#faq" onClick={(e) => { e.preventDefault(); scrollToSection('faq'); }}>FAQ</a></li>
          </ul>
          <a href="/register" className="btn-aluno desktop-nav">Área do Aluno</a>
          <button className="hamburguer" onClick={() => setMenuAberto(!menuAberto)}>
            <span className="bar"></span><span className="bar"></span><span className="bar"></span>
          </button>
        </div>
      </nav>

      <div className={`mobile-menu ${menuAberto ? 'aberto' : ''}`}>
        <button className="close-menu" onClick={() => setMenuAberto(false)}>✕</button>
        <ul>
          <li><a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>Início</a></li>
          <li><a href="#diferenciais" onClick={(e) => { e.preventDefault(); scrollToSection('diferenciais'); }}>Diferenciais</a></li>
          <li><a href="#depoimentos" onClick={(e) => { e.preventDefault(); scrollToSection('depoimentos'); }}>Depoimentos</a></li>
          <li><a href="#faq" onClick={(e) => { e.preventDefault(); scrollToSection('faq'); }}>FAQ</a></li>
          <li><a href="/register" className="btn-aluno-mobile">Área do Aluno</a></li>
        </ul>
      </div>

      <main className="main-content">
        {/* Hero */}
        <section id="home" className="hero reveal">
          <div className="container hero-content">
            <div className="hero-text">
              <h1>Domine <span className="python-color">Python</span> do zero ao avançado</h1>
              <p>Aprenda com projetos reais, exercícios corrigidos automaticamente e comunidade ativa. Torne-se um desenvolvedor Python pronto para o mercado.</p>
              <div className="hero-buttons">
                <a href="/register" className="btn btn-primary">Começar agora →</a>
                <button className="btn btn-outline" onClick={() => scrollToSection('diferenciais')}>Ver diferenciais</button>
              </div>
              <div className="hero-stats">
                <span>💬 Aprenda com facilidade</span>
                <span>📝 60+ exercícios</span>
                <span>🛜 Acesso vitalício</span>
              </div>
            </div>
            <div className="hero-image desktop-only">
              <div className="python-illustration"></div>
            </div>
          </div>
        </section>

        {/* Diferenciais */}
        <section id="diferenciais" className="diferenciais reveal">
          <div className="container">
            <h2>Por que este curso é diferente?</h2>
            <div className="diferenciais-grid">
              <div className="diferencial"><div className="diferencial-icon">⚙️</div><h3>Correção automática de exercícios</h3><p>Escreva seu código Python e receba feedback instantâneo – como em uma entrevista técnica.</p></div>
              <div className="diferencial"><div className="diferencial-icon">📈</div><h3>Projetos do mundo real</h3><p>Construa um dashboard, um bot para Telegram, um web scraper e uma API com Flask.</p></div>
              <div className="diferencial"><div className="diferencial-icon">🎓</div><h3>Comunidade exclusiva</h3><p>Tire dúvidas diretamente com os instrutores e outros alunos em nosso fórum privado.</p></div>
            </div>
          </div>
        </section>

        {/* Dores */}
        <section id="porque-aprender" className="porque-aprender reveal">
          <div className="container">
            <h2>Você já sentiu alguma dessas dores?</h2>
            <p className="section-subtitle">Python resolve problemas reais que atrasam seu dia a dia</p>
            <div className="dores-grid-desktop">
              <div className="dor-item imagem"><img src="https://i.postimg.cc/gJCyjbyd/Foto1.png" alt="" /></div>
              <div className="dor-item texto"><h3>Tarefas manuais repetitivas</h3><p>Planilhas, renomear arquivos, enviar e-mails, baixar dados… horas perdidas toda semana. Com Python, você automatiza tudo em minutos.</p></div>
              <div className="dor-item texto"><h3>Dados bagunçados e sem análise</h3><p>Você tem informações, mas não consegue extrair insights. Python organiza, limpa e gera gráficos que impressionam qualquer gestor.</p></div>
              <div className="dor-item imagem"><img src="https://i.postimg.cc/pLLj2dNC/Foto2.png" alt="" /></div>
              <div className="dor-item imagem"><img src="https://i.postimg.cc/rsTd7VCr/Foto3.png" alt="" /></div>
              <div className="dor-item texto"><h3>Falta de oportunidades na carreira</h3><p>As vagas mais quentes do mercado (dados, IA, backend, automação) exigem Python. Aprender agora é abrir portas para empregos de alto valor.</p></div>
              <div className="dor-item texto"><h3>Dependência de ferramentas pagas</h3><p>Excel avançado, Power BI, softwares proprietários… Python é gratuito e ilimitado, faz tudo isso e muito mais sem custos extras.</p></div>
              <div className="dor-item imagem"><img src="https://i.postimg.cc/QMRKkkFR/Foto4.png" alt="" /></div>
            </div>
            <div className="dores-grid-mobile">
              <div className="dor-card"><img src="https://i.postimg.cc/gJCyjbyd/Foto1.png" className="dor-image" /><h3>Tarefas manuais repetitivas</h3><p>Planilhas, renomear arquivos, enviar e-mails, baixar dados… horas perdidas toda semana. Com Python, você automatiza tudo em minutos.</p></div>
              <div className="dor-card"><img src="https://i.postimg.cc/pLLj2dNC/Foto2.png" className="dor-image" /><h3>Dados bagunçados e sem análise</h3><p>Você tem informações, mas não consegue extrair insights. Python organiza, limpa e gera gráficos que impressionam qualquer gestor.</p></div>
              <div className="dor-card"><img src="https://i.postimg.cc/rsTd7VCr/Foto3.png" className="dor-image" /><h3>Falta de oportunidades na carreira</h3><p>As vagas mais quentes do mercado (dados, IA, backend, automação) exigem Python. Aprender agora é abrir portas para empregos de alto valor.</p></div>
              <div className="dor-card"><img src="https://i.postimg.cc/QMRKkkFR/Foto4.png" className="dor-image" /><h3>Dependência de ferramentas pagas</h3><p>Excel avançado, Power BI, softwares proprietários… Python é gratuito e ilimitado, faz tudo isso e muito mais sem custos extras.</p></div>
            </div>
          </div>
        </section>

        {/* Depoimentos */}
        <section id="depoimentos" className="depoimentos reveal">
          <div className="container">
            <h2>O que nossos alunos dizem</h2>
            <div className="depoimentos-grid">
              <div className="depoimento-card"><p>"Consegui meu primeiro emprego como desenvolvedor Python graças aos projetos e à correção automática. Recomendo demais!"</p><div className="aluno-info">— Carlos Mendes, Aluno</div></div>
              <div className="depoimento-card"><p>"O curso é muito prático. A cada aula você escreve código de verdade, e o sistema de correção me ajudou a fixar cada conceito."</p><div className="aluno-info">— Ricardo Alves, Aluno</div></div>
              <div className="depoimento-card"><p>"Material atualizado, suporte rápido e comunidade ativa. Melhor investimento da minha carreira."</p><div className="aluno-info">— Fernando Lima, Aluno</div></div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="faq reveal">
          <div className="container">
            <h2>Perguntas frequentes</h2>
            <div className="faq-list">
              <details><summary>Preciso saber programar antes?</summary><p>Não! O curso começa do absoluto zero. Você só precisa saber usar o computador e ter vontade de aprender.</p></details>
              <details><summary>Por quanto tempo tenho acesso?</summary><p>Acesso vitalício a todo o conteúdo e futuras atualizações.</p></details>
              <details><summary>Como funciona a correção automática de código?</summary><p>Você envia seu código Python pelo ambiente do curso e recebe feedback imediato sobre acertos e erros.</p></details>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="cta-enhanced reveal">
          <div className="container cta-enhanced-container">
            <div className="cta-enhanced-content">
              <h2>Pronto para transformar sua carreira?</h2>
              <p>
                <span className="cta-highlight">Python</span> é a linguagem mais requisitada do mercado.
                <br />
                Não fique para trás — comece hoje mesmo e conquiste as melhores oportunidades.
              </p>
              <div className="cta-buttons">
                <a href="/register" className="btn-cta-primary">🚀 Quero me inscrever agora</a>
                <a href="#diferenciais" className="btn-cta-secondary">Ver diferenciais</a>
              </div>
              <div className="cta-guarantee">
                <span className="guarantee-icon">✓</span> Garantia de 7 dias • 
                <span className="guarantee-icon">✓</span> Acesso vitalício • 
                <span className="guarantee-icon">✓</span> Certificado
              </div>
            </div>
            <div className="cta-enhanced-image">
              <i className="fab fa-python cta-python-icon"></i>
            </div>
          </div>
        </section>

        <SocialBar />
      </main>

      <Footer />
    </div>
  );
}