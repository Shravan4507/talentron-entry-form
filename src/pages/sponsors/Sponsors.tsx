import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/navigation/SEO';
import { assetPath } from '../../utils/assetPath';
import './Sponsors.css';

const Sponsors: React.FC = () => {
    const sponsorCategories = [
        {
            category: "Title Sponsor",
            sponsors: [
                { name: "Sponsor Name", logo: "/assets/logos/Logo-Star.png", link: "#" }
            ]
        },
        {
            category: "Gold Sponsors",
            sponsors: [
                { name: "Partner 1", logo: "/assets/logos/Logo-Star.png", link: "#" },
                { name: "Partner 2", logo: "/assets/logos/Logo-Star.png", link: "#" }
            ]
        },
        {
            category: "Media Partners",
            sponsors: [
                { name: "Media 1", logo: "/assets/logos/Logo-Star.png", link: "#" },
                { name: "Media 2", logo: "/assets/logos/Logo-Star.png", link: "#" },
                { name: "Media 3", logo: "/assets/logos/Logo-Star.png", link: "#" }
            ]
        }
    ];

    return (
        <div className="sponsors-page">
            <SEO 
                title="Our Sponsors & Partners | Talentron '26"
                description="Powering the creativity! Meet the official sponsors and partners supporting Talentron '26 at Zeal College, Pune."
            />

            <div className="sponsors-container">
                <header className="sponsors-header">
                    <img 
                        src={assetPath('/assets/logos/sponsors.png')} 
                        alt="Our Sponsors" 
                        className="sponsors-header-image" 
                    />
                    <p className="sponsors-subtitle">The visionaries behind the spectacle. Join us in celebrating the brands that fuel Talentron '26.</p>
                </header>

                <div className="sponsors-grid-list">
                    {sponsorCategories.map((cat, idx) => (
                        <section key={idx} className="sponsor-category-section">
                            <h2 className="category-label">{cat.category}</h2>
                            <div className={`sponsors-row ${cat.category.toLowerCase().replace(' ', '-')}`}>
                                {cat.sponsors.map((sponsor, sIdx) => (
                                    <a 
                                        key={sIdx} 
                                        href={sponsor.link} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="sponsor-card"
                                    >
                                        <div className="sponsor-logo-container">
                                            <img src={assetPath(sponsor.logo)} alt={sponsor.name} />
                                        </div>
                                        <span className="sponsor-name">{sponsor.name}</span>
                                    </a>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>

                <div className="sponsorship-call">
                    <div className="cta-paper">
                        <h3>WANT TO PARTNER WITH US?</h3>
                        <p>Be a part of Pune's most vibrant cultural fest. Reach out to our marketing team for sponsorship opportunities.</p>
                        <Link to="/contact" className="sponsor-contact-btn">GET IN TOUCH</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sponsors;
