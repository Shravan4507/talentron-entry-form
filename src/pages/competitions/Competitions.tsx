import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { competitionsData } from '../../data/competitionsData';
import PopArtCard from '../../components/card/PopArtCard';
import CardSkeleton from '../../components/card/CardSkeleton';
import SEO from '../../components/navigation/SEO';
import { assetPath } from '../../utils/assetPath';
import './Competitions.css';

const getGenreImage = (category: string) => {
    const images: Record<string, string> = {
        "Music": assetPath("/assets/cards/music.webp"),
        "Dance": assetPath("/assets/cards/dance.webp"),
        "Drama": assetPath("/assets/cards/drama.webp"),
        "Band": assetPath("/assets/cards/band.webp"),
        "Street Play": assetPath("/assets/cards/street-play.webp"),
    };
    return images[category] || assetPath("/assets/cards/music.webp");
};

const Competitions: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    // Get unique categories
    const categories = Array.from(new Set(competitionsData.map(c => c.category))).map(cat => ({
        name: cat
    }));

    return (
        <div className="competitions-page">
            <SEO 
                title="Enter the Arena — Competition Categories"
                description="Explore the diverse range of competitions at Talentron '26."
            />
            <div className="comp-header">
                <div className="subtitle-wrapper">
                    <img 
                        src={assetPath('/assets/logos/the_stage_is_yours.png')} 
                        alt="The Stage is Yours" 
                        className="comp-logo-subtitle" 
                    />
                </div>
                <div className="main-title-wrapper">
                    <img 
                        src={assetPath('/assets/logos/art_forms.png')} 
                        alt="Art Forms" 
                        className="comp-logo-main" 
                    />
                </div>
                <p className="comp-description">Choose your category to explore competitions</p>
            </div>

            <div className="competitions-grid">
                {loading ? (
                    [...Array(5)].map((_, i) => <CardSkeleton key={i} />)
                ) : (
                    categories.map((cat, index) => (
                        <PopArtCard
                            key={index}
                            backgroundImage={getGenreImage(cat.name)}
                            footerText="VIEW GENRE"
                            onClick={() => navigate(`/competitions/${encodeURIComponent(cat.name)}`)}
                            onButtonClick={() => navigate(`/register/${encodeURIComponent(cat.name)}`)}
                            animationDelay={`${index * 0.05}s`}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default Competitions;
