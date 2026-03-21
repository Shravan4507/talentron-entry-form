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
    { label: 'Schedule', link: '/schedule' },
  ];

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <nav className={`navbar ${isOpen ? 'menu-open' : ''}`}>
      <div className="navbar-container">
        <div className="navbar-brand" onClick={() => navigate('/')}>
          <img src={assetPath('/assets/logos/Logo-Star.webp')} alt="Talentron Logo" className="navbar-logo" />
          <img src={assetPath('/assets/logos/Logo_Talentron_1.webp')} alt="Talentron Brand" className="brand-logo-text" />
        </div>


        {/* Desktop Links - Center */}
        <div className="navbar-center desktop">
          {menuItems.map((item) => (
            <Link 
              key={item.label} 
              to={item.link} 
              className={`nav-link ${location.pathname === item.link ? 'active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Desktop Register - Right */}
        <div className="navbar-right desktop">
          <button className="nav-register-btn" onClick={() => navigate('/')}>
            RESULTS OUT
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
          <button className="mobile-register-btn" onClick={() => navigate('/')}>
            RESULTS OUT
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
