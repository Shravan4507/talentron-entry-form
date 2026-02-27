import { useNavigate } from 'react-router-dom';
import SEO from '../../components/navigation/SEO';
import { assetPath } from '../../utils/assetPath';
import RuleBookButton from '../../components/navigation/RuleBookButton';
import './Home.css';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="home-page">
            <SEO 
                title="Official Entry Form | Talentron '26 | Zeal College Pune"
                description="Register for Talentron '26, Pune's biggest college cultural festival at Zeal College of Engineering and Research. Music, Dance, Drama, and more. Showcase your talent now!"
                keywords="Talentron, Talentron 2026, Zeal College Pune, ZCOER, Zeal Fest, Pune Cultural Competition, Talentron Registration, Singing Competition Pune, Dancing Competition Pune"
                schema={{
                    "@context": "https://schema.org",
                    "@type": "Event",
                    "name": "Talentron '26",
                    "startDate": "2026-03-01", 
                    "location": {
                        "@type": "Place",
                        "name": "Zeal College of Engineering and Research",
                        "address": {
                            "@type": "PostalAddress",
                            "streetAddress": "Narhe",
                            "addressLocality": "Pune",
                            "addressRegion": "MH",
                            "postalCode": "411041",
                            "addressCountry": "IN"
                        }
                    },
                    "description": "Talentron '26 is an inter-college cultural competition featuring music, dance, drama, and more.",
                    "organizer": {
                        "@type": "Organization",
                        "name": "Zeal Education Society",
                        "url": "https://www.talentron.in"
                    }
                }}
            />
            
            <div className="hero-section">
                <div className="hero-content">
                    <div className="hero-main-container">
                        <img 
                            src={assetPath('/assets/logos/hero_section_3.png')} 
                            alt="Talentron '26 - Are You Ready? Join the biggest student-led competition in Pune." 
                            className="hero-main-image" 
                        />
                    </div>
                    <div className="cta-container">
                        <button 
                            className="primary-cta"
                            onClick={() => navigate('/competitions')}
                        >
                            REGISTER NOW
                        </button>
                        <RuleBookButton className="hero-btn" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
