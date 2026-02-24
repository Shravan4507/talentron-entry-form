import { useNavigate } from 'react-router-dom';
import OutlinedTitle from '../../components/heading/OutlinedTitle';
import SEO from '../../components/navigation/SEO';
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
                    <div className="hero-badge">TALENTRON '26</div>
                    <div className="hero-title-wrapper">
                        <OutlinedTitle 
                            text="ARE YOU READY?" 
                            fillColor="linear-gradient(180deg, #ff0059 0%, #ff8c00 100%)" 
                            outlineColor="#000000" 
                            shadowColor="#000000"
                            hasGrain={true}
                        />
                    </div>
                    <p className="hero-description">
                        Join the biggest student-led competition in Pune. 
                        Singing, Dancing, Dramatics, and more – choose your stage.
                    </p>
                    <div className="cta-container">
                        <button 
                            className="primary-cta"
                            onClick={() => navigate('/competitions')}
                        >
                            REGISTER NOW
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
