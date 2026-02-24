import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { assetPath } from '../../utils/assetPath';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: 'Home', link: '/' },
    { label: 'Rules', link: '/rules' },
    { label: 'Competitions', link: '/competitions' },
  ];

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <nav className={`navbar ${isOpen ? 'menu-open' : ''}`}>
      <div className="navbar-container">
        <div className="navbar-brand" onClick={() => navigate('/')}>
          <img src={assetPath('/assets/logos/Logo-Star.jpg')} alt="Talentron Logo" className="navbar-logo" />
          <img src={assetPath('/assets/logos/Logo_Talentron.png')} alt="Talentron Brand" className="brand-logo-text" />
        </div>

        <div className="navbar-center">
          <a href="https://zcoer.in" target="_blank" rel="noopener noreferrer">
            <img src={assetPath('/assets/logos/ZCOER-Logo-White.png')} alt="ZCOER Logo" className="navbar-center-logo" />
          </a>
        </div>

        {/* Desktop Links */}
        <div className="navbar-links desktop">
          {menuItems.map((item) => (
            <Link 
              key={item.label} 
              to={item.link} 
              className={`nav-link ${location.pathname === item.link ? 'active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
          <button className="nav-register-btn" onClick={() => navigate('/competitions')}>
            Register Now
          </button>
        </div>

        {/* Mobile Toggle */}
        <button className={`mobile-toggle ${isOpen ? 'active' : ''}`} onClick={() => setIsOpen(!isOpen)} aria-label="Toggle Menu">
          <span className="hamburger-bar"></span>
          <span className="hamburger-bar"></span>
          <span className="hamburger-bar"></span>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
        <div className="mobile-menu-content">
          {menuItems.map((item) => (
            <Link 
              key={item.label} 
              to={item.link} 
              className={`mobile-nav-link ${location.pathname === item.link ? 'active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
          <button className="mobile-register-btn" onClick={() => navigate('/competitions')}>
            Register Now
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
