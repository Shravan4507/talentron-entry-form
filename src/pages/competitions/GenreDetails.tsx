import React from 'react';
import { useParams, Link } from 'react-router-dom';
import OutlinedTitle from '../../components/heading/OutlinedTitle';
import SEO from '../../components/navigation/SEO';
import { competitionsData } from '../../data/competitionsData';
import './GenreDetails.css';

const GenreDetails: React.FC = () => {
    const { genre } = useParams<{ genre: string }>();

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
                <OutlinedTitle 
                    text={genre?.toLowerCase() === 'street play' ? 'NUKKAD NATAK' : (genre?.toUpperCase() || 'GENRE')} 
                    fillColor="linear-gradient(180deg, #f0ff00 0%, #ff0070 100%)" 
                    outlineColor="#000000" 
                    shadowColor="#000000"
                    className="small"
                />
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
