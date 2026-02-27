import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import OutlinedTitle from '../components/heading/OutlinedTitle';
import SEO from '../components/navigation/SEO';
import { assetPath } from '../utils/assetPath';
import './NotFound.css';

const NotFound: React.FC = () => {
    const navigate = useNavigate();

    const quickLinks = [
        { name: 'Home', path: '/' },
        { name: 'Competitions', path: '/competitions' },
        { name: 'Rules', path: '/rules' },
        { name: 'Contact', path: '/contact' }
    ];

    return (
        <div className="not-found-page">
            <SEO 
                title="404 - Page Not Found" 
                description="Oops! Looks like you've wandered into the void. Let's get you back to Talentron."
            />
            
            <div className="not-found-container">
                <motion.div 
                    className="error-visual"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="error-code-bg">404</div>
                    <div className="error-code-fg">404</div>
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <OutlinedTitle 
                        text="LOST IN THE VIBE?" 
                        fillColor="linear-gradient(180deg, #ffea00 0%, #ffc800 100%)" 
                        outlineColor="#000000" 
                        shadowColor="#ff0059"
                    />
                    
                    <p className="not-found-subtitle">
                        Looks like you took a wrong turn at the main stage. This page doesn't exist anymore or was moved.
                    </p>
                </motion.div>

                <motion.div 
                    className="quick-links-section"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <span className="links-label">Quick Escape:</span>
                    <div className="links-grid">
                        {quickLinks.map(link => (
                            <Link key={link.path} to={link.path} className="quick-link-btn">
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </motion.div>

                <motion.button 
                    className="home-master-btn" 
                    onClick={() => navigate('/')}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <img src={assetPath('/assets/icons/send.png')} alt="" className="btn-inline-icon" />
                    BACK TO MAIN STAGE
                </motion.button>
            </div>
        </div>
    );
};

export default NotFound;
