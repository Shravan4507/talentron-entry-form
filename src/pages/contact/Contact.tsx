import OutlinedTitle from '../../components/heading/OutlinedTitle';
import SEO from '../../components/navigation/SEO';
import { assetPath } from '../../utils/assetPath';
import './Contact.css';

const Contact = () => {
    const organizers = [
        {
            name: "Shrvan",
            role: "Event Coordinator",
            phone: "+91 80104 53267",
            instagram: "069.f5",
            image: assetPath("/assets/organizers/shrvan.jpg")
        },
        {
            name: "Team Talentron",
            role: "Technical Support",
            phone: "+91 80104 53267",
            instagram: "talentron.zcoer",
            image: assetPath("/assets/organizers/support.jpg")
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
                    <OutlinedTitle 
                        text="CONTACT US" 
                        fillColor="linear-gradient(180deg, #00d1ff 0%, #0047ff 100%)" 
                        outlineColor="#000000" 
                        shadowColor="#ff0059"
                    />
                    <p className="contact-subtitle">Have questions? Reach out to our organizing committee for assistance.</p>
                </header>

                <div className="contact-grid">
                    {organizers.map((person, index) => (
                        <div key={index} className="contact-card">
                            <div className="contact-image-wrapper">
                                <img src={person.image} alt={person.name} className="contact-image" />
                                <div className="contact-role-badge">{person.role}</div>
                            </div>
                            <div className="contact-info">
                                <h3 className="contact-name">{person.name}</h3>
                                <div className="contact-details">
                                    <a href={`tel:${person.phone.replace(/\s/g, '')}`} className="contact-link">
                                        <span className="icon">📞</span> {person.phone}
                                    </a>
                                    <a href={`https://instagram.com/${person.instagram}`} target="_blank" rel="noopener noreferrer" className="contact-link">
                                        <span className="icon">📸</span> @{person.instagram}
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
