import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-pro">
      <div className="footer-pro-container">
        <div className="footer-pro-column">
          <div className="footer-pro-logo">
            <img src="https://i.postimg.cc/3N8WrL4W/Logo-Python-removebg-preview.png" alt="PythonPro" />
            <span>PythonPro</span>
          </div>
          <p className="footer-pro-description">
            Transforme sua carreira com Python. Do zero ao profissional com projetos reais e correção automática.
          </p>
          <div className="footer-pro-social-icons">
            <a href="https://wa.me/5516996167381" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <i className="fab fa-whatsapp"></i>
            </a>
            <a href="https://instagram.com/Fezinn_08" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://www.linkedin.com/in/FelipeFreitasRossi" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a href="mailto:feliperossidev@gmail.com" target="_blank" rel="noopener noreferrer" aria-label="E-mail">
              <i className="fas fa-envelope"></i>
            </a>
          </div>
        </div>
        <div className="footer-pro-column">
          <h3>Links rápidos</h3>
          <ul>
            <li><a href="#home">Início</a></li>
            <li><a href="/courses">Cursos</a></li>
            <li><a href="/register">Área do Aluno</a></li>
          </ul>
        </div>
        <div className="footer-pro-column">
          <h3>Contato</h3>
          <ul className="contact-list-pro">
            <li><i className="fas fa-envelope"></i> <a href="mailto:feliperossidev@gmail.com">feliperossidev@gmail.com</a></li>
            <li><i className="fab fa-whatsapp"></i> <a href="https://wa.me/5516996167381" target="_blank">(16) 99616-7381</a></li>
          </ul>
        </div>
        <div className="footer-pro-column">
          <h3>Sobre</h3>
          <p className="footer-pro-small-text">
            PythonPro é uma plataforma de ensino focada em formar desenvolvedores Python prontos para o mercado.
          </p>
          <p className="footer-pro-small-text">
            📍 Brasil<br />
            💻 Suporte 24/7
          </p>
        </div>
      </div>
      <div className="footer-pro-bottom">
        <p>© {currentYear} PythonPro. Todos os direitos reservados.</p>
        <p>🐍 Desenvolvido com paixão pela comunidade Python.</p>
      </div>
    </footer>
  );
};

export default Footer;