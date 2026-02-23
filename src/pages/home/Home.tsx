import { useNavigate } from 'react-router-dom';
import OutlinedTitle from '../../components/heading/OutlinedTitle';
import SEO from '../../components/navigation/SEO';
import './Home.css';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="home-page">
            <SEO 
                title="Submit Your Entry"
                description="The official entry form for Talentron '26. Register now and showcase your talent."
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
