import { Link } from 'react-router-dom';
import { assetPath } from '../../utils/assetPath';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-top">
          <div className="footer-brand">
            <img src={assetPath('/assets/logos/Logo-Star.jpg')} alt="Talentron Logo" className="footer-brand-logo" />
            <p>Empowering the next generation of digital talent through innovation and technology.</p>
          </div>
          <div className="footer-links-column">
            <h4>Quick Links</h4>
            <div className="footer-quick-links">
              <Link to="/">Home</Link>
              <Link to="/rules">General Rules</Link>
              <Link to="/competitions">All Competitions</Link>
              <Link to="/contact">Contact Us</Link>
            </div>
          </div>
          <div className="footer-location">
            <h4>Location</h4>
            <p>
              <a 
                href="https://maps.app.goo.gl/RXpzvbPwm4s2CqDW6" 
                target="_blank" 
                rel="noopener noreferrer"
                className="location-link"
              >
                Zeal College of Engineering and Research, Narhe, Pune, Maharashtra 411041
              </a>
            </p>
          </div>
        </div>

        <div className="footer-initiative">
          <div className="initiative-logo">
            <img src={assetPath('/assets/logos/ZCOER-Logo-White.png')} alt="ZCOER Logo" />
          </div>
          <div className="initiative-text">
            OFFICIAL INTER-COLLEGE COMPETITION OF ZCOER PUNE
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-copyright">
            © 2026 Talentron. All rights reserved.
            <span className="dev-signature">
              Handcrafted by <a href="https://www.instagram.com/069.f5/" target="_blank" rel="noopener noreferrer">Shrvan</a>
            </span>
          </div>
          <div className="footer-legal">
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms-of-service">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
