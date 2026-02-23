import React from 'react';
import { useParams, Link } from 'react-router-dom';
import OutlinedTitle from '../../components/heading/OutlinedTitle';
import SEO from '../../components/navigation/SEO';
import './GenreDetails.css';

const GenreDetails: React.FC = () => {
    const { genre } = useParams<{ genre: string }>();

    return (
        <div className="genre-details-page">
            <SEO 
                title={`${genre} — Details`}
                description={`Learn more about the ${genre} competitions at Talentron '26.`}
            />
            
            <div className="genre-header">
                <OutlinedTitle 
                    text={genre?.toUpperCase() || 'GENRE'} 
                    fillColor="linear-gradient(180deg, #f0ff00 0%, #ff0070 100%)" 
                    outlineColor="#000000" 
                    shadowColor="#000000"
                    className="small"
                />
            </div>

            <div className="genre-content">
                <div className="info-card">
                    <h2>Information Coming Soon</h2>
                    <p>We are currently finalizing the rules and details for the {genre} category. Please check back later for full information.</p>
                </div>

                <div className="navigation-actions">
                    <Link to="/competitions" className="back-link">← Back to Art Forms</Link>
                    <Link to={`/register/${genre}`} className="register-cta">Register Now</Link>
                </div>
            </div>
        </div>
    );
};

export default GenreDetails;
