import './SocialBar.css';

const SocialBar = () => {
  const socialLinks = [
    { name: 'WhatsApp', url: 'https://wa.me/5516996167381', iconClass: 'fab fa-whatsapp' },
    { name: 'Instagram', url: 'https://instagram.com/Fezinn_08', iconClass: 'fab fa-instagram' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/FelipeFreitasRossi', iconClass: 'fab fa-linkedin-in' },
    { name: 'E-mail', url: 'mailto:feliperossidev@gmail.com', iconClass: 'fas fa-envelope' },
  ];

  return (
    <div className="social-bar-container">
      <ul className="social-bar">
        {socialLinks.map((item) => (
          <li key={item.name} className="icon-content">
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={item.name}
              data-social={item.name.toLowerCase()}
              className="link"
            >
              <i className={item.iconClass}></i>
            </a>
            <div className="tooltip">{item.name}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SocialBar;