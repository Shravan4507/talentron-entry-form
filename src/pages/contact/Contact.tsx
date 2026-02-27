import SEO from '../../components/navigation/SEO';
import { assetPath } from '../../utils/assetPath';
import './Contact.css';

const Contact = () => {
    const organizers = [
        {
            name: "Shrvan",
            team: "Technical Team",
            role: "Head",
            phone: "+91 94229 58592",
            email: "shravan45x@gmail.com",
            instagram: "069.f5",
            image: assetPath("/assets/members/Shrvan.png")
        },
        {
            name: "Team Talentron",
            team: "MANAGEMENT",
            role: "Technical Support",
            phone: "+91 80104 53267",
            email: "admin@talentron.in",
            instagram: "talentron.zcoer",
            image: assetPath("/assets/members/Support.png")
        }
    ];

    return (
        <div className="contact-page">
            <SEO 
                title="Contact Us | Talentron '26"
                description="Get in touch with the Talentron '26 organizing committee for any queries regarding competitions, registrations, or event details."
            />

            <div className="contact-container">
                <header className="contact-header">
                    <div className="contact-hero-logo">
                        <img src={assetPath('/assets/logos/contact_us.png')} alt="Contact Us" />
                    </div>
                    <p className="contact-subtitle">Have questions? Reach out to our organizing committee for assistance.</p>
                </header>

                <div className="contact-grid">
                    {organizers.map((person, index) => (
                        <div key={index} className="organizer-card">
                            <div className="organizer-image-container">
                                <img src={person.image} alt={person.name} className="organizer-img" />
                            </div>
                            
                            <div className="organizer-content">
                                <div className="organizer-header-row">
                                    <h3 className="organizer-name">{person.name}</h3>
                                    <span className="organizer-handle">@{person.instagram}</span>
                                </div>
                                <p className="organizer-role">{person.role}</p>
                                <p className="organizer-team">{person.team}</p>
                                
                                <div className="organizer-contact-info">
                                    <a href={`tel:${person.phone.replace(/\s/g, '')}`} className="org-contact-link">
                                        <img src={assetPath('/assets/icons/phone.png')} alt="" className="contact-icon" /> {person.phone}
                                    </a>
                                    <a href={`mailto:${person.email}`} className="org-contact-link">
                                        <img src={assetPath('/assets/icons/envelope.png')} alt="" className="contact-icon" /> {person.email}
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="contact-location-section">
                    <div className="location-card">
                        <h3>VISIT US</h3>
                        <p>Zeal College of Engineering and Research, Narhe, Pune</p>
                        <a 
                            href="https://maps.app.goo.gl/RXpzvbPwm4s2CqDW6" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="location-btn"
                        >
                            VIEW ON MAP
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
