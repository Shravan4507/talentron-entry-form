import React from 'react';
import { useNavigate } from 'react-router-dom';
import OutlinedTitle from '../components/heading/OutlinedTitle';
import SEO from '../components/navigation/SEO';
import './NotFound.css';

const NotFound: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="not-found-page">
            <SEO 
                title="404 - Page Not Found" 
                description="The page you are looking for does not exist."
            />
            <div className="not-found-container">
                <div className="error-code">404</div>
                <OutlinedTitle 
                    text="LOST IN SPACE?" 
                    fillColor="linear-gradient(180deg, #ff0059 0%, #ffc800 100%)" 
                    outlineColor="#000000" 
                    shadowColor="#000000"
                />
                <p className="not-found-text">
                    The page you're looking for has either been moved, deleted, or never existed in the first place.
                </p>
                <button className="home-btn" onClick={() => navigate('/')}>
                    BACK TO REALITY
                </button>
            </div>
        </div>
    );
};

export default NotFound;
