import { Link } from 'react-router-dom';
import { assetPath } from '../../utils/assetPath';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-brand-logos">
              <img src={assetPath('/assets/logos/Logo-Star.webp')} alt="Talentron Logo" className="footer-star-logo" />
              <img src={assetPath('/assets/logos/Logo_Talentron_1.webp')} alt="Talentron Brand" className="footer-text-logo" />
            </div>
            <p>Celebrate the spirit of art and creativity at Talentron '2K26 – Pune's premier student-led cultural extravaganza.</p>
          </div>
          <div className="footer-links-column">
            <h4>Navigations</h4>
            <div className="footer-quick-links">
              <Link to="/">Home</Link>
              <Link to="/rules">General Rules</Link>
              <Link to="/schedule">Event Schedule</Link>
              <Link to="/competitions">All Competitions</Link>
            </div>
          </div>
          <div className="footer-links-column">
            <h4>Quick Links</h4>
            <div className="footer-quick-links">
              <Link to="/sponsors">Our Sponsors</Link>
              <Link to="/contact">Contact Us</Link>
              <Link to="/book-stall">Book a Stall</Link>
              <Link to="/faq">FAQs</Link>
            </div>
          </div>
          <div className="footer-links-column">
            <h4>Follow Us</h4>
            <div className="footer-social-links">
                <a 
                    href="https://www.instagram.com/zeal_talentron/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="footer-social-link"
                    title="Follow us on Instagram"
                >
                    <img src={assetPath('/assets/icons/instagram.webp')} alt="Instagram" />
                </a>
            </div>
          </div>
          <div className="footer-location">
            <h4>Location</h4>
            <a 
            href="https://maps.app.goo.gl/RXpzvbPwm4s2CqDW6" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="location-link"
            >
            <img src={assetPath('/assets/icons/location.webp')} alt="Location" className="footer-location-icon" />
            <span>
                Zeal College of Engineering and Research,<br />
                Narhe, Pune, Maharashtra 411041
            </span>
            </a>
          </div>
        </div>

        <div className="footer-initiative">
          <a href="https://zealeducation.com/" target="_blank" rel="noopener noreferrer" className="initiative-logo">
            <img src={assetPath('/assets/logos/Logo Circular.webp')} alt="Zeal Education Logo" />
          </a>
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
