import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../../components/navigation/SEO';
import { assetPath } from '../../utils/assetPath';
import RuleBookButton from '../../components/navigation/RuleBookButton';
import './Home.css';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="home-page">
            <SEO 
                title="Registration Closed | Talentron 2K26 | Zeal College Pune"
                description="Registration for Talentron 2K26 is now closed. Thanks for the superb response! Selection Round 1 results have been declared."
                keywords="Talentron, Talentron 2026, Zeal College Pune, ZCOER, Zeal Fest, Results, Selection Round 1"
            />
            
            <div className="hero-section">
                <div className="hero-content">
                    <div className="hero-main-container">
                        <img 
                            src={assetPath('/assets/logos/hero_section_3.webp')} 
                            alt="Talentron 2K26 Registration Closed" 
                            className="hero-main-image" 
                        />
                    </div>
                    
                    <div className="closed-notice-overlay">
                        <motion.div 
                            className="notice-card"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2 className="notice-title">REGISTRATIONS CLOSED</h2>
                            <p className="notice-desc">Thanks for your superb responses! Registrations for Talentron 2K26 are now officially closed.</p>
                            <div className="notice-divider" />
                            <p className="notice-results">Results for Round 1 have been declared and shortlisted candidates have been notified via email.</p>
                        </motion.div>
                    </div>
                </div>
            </div>

            <div className="prizes-and-ctas">
                <div className="cta-container">
                    <button 
                        className="primary-cta secondary"
                        onClick={() => navigate('/schedule')}
                    >
                        VIEW SCHEDULE
                    </button>
                    <RuleBookButton className="hero-btn" />
                </div>
            </div>
        </div>
    );
};

export default Home;
