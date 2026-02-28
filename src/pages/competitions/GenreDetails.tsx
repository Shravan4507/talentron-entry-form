import React from 'react';
import { useParams, Link } from 'react-router-dom';
import SEO from '../../components/navigation/SEO';
import { assetPath } from '../../utils/assetPath';
import { competitionsData } from '../../data/competitionsData';
import './GenreDetails.css';

const GenreDetails: React.FC = () => {
    const { genre } = useParams<{ genre: string }>();

    // Map genre names to their respective logo assets
    const genreImageMap: Record<string, string> = {
        'music': '/assets/logos/music.png',
        'dance': '/assets/logos/dance.png',
        'drama': '/assets/logos/dramatics.png',
        'band': '/assets/logos/Band.png',
        'street play': '/assets/logos/street play.png'
    };

    const headerImage = genreImageMap[genre?.toLowerCase() || ''];

    // Filter competitions belonging to this category
    const categoryCompetitions = competitionsData.filter(
        comp => comp.category.toLowerCase() === genre?.toLowerCase()
    );

    const groupRules = (rules: string[]) => {
        const commonRules: string[] = [];
        const specificRules: string[] = [];
        let target: 'common' | 'specific' = 'common';

        rules.forEach(rule => {
            if (rule.toLowerCase().includes('common rules')) {
                target = 'common';
                return;
            }
            if (rule.toLowerCase().includes('competition-specific rules')) {
                target = 'specific';
                return;
            }
            
            if (target === 'common') commonRules.push(rule);
            else specificRules.push(rule);
        });

        return { commonRules, specificRules };
    };

    return (
        <div className="genre-details-page">
            <SEO 
                title={`${genre} — Rules & Details | Talentron '26`}
                description={`Specific rules, regulations, and competition details for the ${genre} category at Talentron '26.`}
            />
            
            <div className="genre-header">
                {headerImage ? (
                    <img 
                        src={assetPath(headerImage)} 
                        alt={genre || 'Competition Genre'} 
                        className="genre-header-image" 
                    />
                ) : (
                    <h1 className="genre-title-fallback">{genre?.toUpperCase()}</h1>
                )}
            </div>

            <div className="genre-content">
                {categoryCompetitions.length > 0 ? (
                    <div className="competitions-list">
                        {categoryCompetitions.map((comp, index) => {
                            const { commonRules, specificRules } = groupRules(comp.rules || []);
                            
                            return (
                                <div key={index} className="competition-detail-card">
                                    <div className="comp-info-main">
                                        <h2>{comp.name}</h2>
                                        <div className="comp-badges">
                                             <span className="badge type">{comp.type}</span>
                                             {comp.prize && <span className="badge prize">🏆 {comp.prize}</span>}
                                             {comp.fees && <span className="badge fee">₹{comp.fees} per person</span>}
                                         </div>
                                        <p className="description">{comp.description}</p>
                                    </div>

                                    {(commonRules.length > 0 || specificRules.length > 0) && (
                                        <div className="rules-container-grid">
                                            {commonRules.length > 0 && (
                                                <div className="rules-column common">
                                                    <h3>COMMON RULES</h3>
                                                    <ul className="rules-list">
                                                        {commonRules.map((rule, idx) => (
                                                            <li key={idx} className="rule-item">{rule}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                            {specificRules.length > 0 && (
                                                <div className="rules-column specific">
                                                    <h3>COMPETITION SPECIFIC</h3>
                                                    <ul className="rules-list">
                                                        {specificRules.map((rule, idx) => (
                                                            <li key={idx} className="rule-item">{rule}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="info-card">
                        <h2>Information Coming Soon</h2>
                        <p>We are currently finalizing the rules and details for the {genre} category. Please check back later for full information.</p>
                    </div>
                )}

                <div className="navigation-actions">
                    <Link to="/competitions" className="back-link">← Back to Art Forms</Link>
                    <Link to={`/register/${genre}`} className="register-cta">Register Now</Link>
                </div>
            </div>
        </div>
    );
};

export default GenreDetails;
