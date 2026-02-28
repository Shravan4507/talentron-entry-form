import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import SEO from '../../components/navigation/SEO';
import { assetPath } from '../../utils/assetPath';
import './Contact.css';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            await addDoc(collection(db, "contact_messages"), {
                ...formData,
                submittedAt: serverTimestamp(),
                status: 'unread'
            });
            setSubmitted(true);
            setFormData({ name: '', email: '', message: '' });
        } catch (error) {
            console.error("Error submitting form: ", error);
            alert("Something went wrong. Please try again later.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    const organizers = [
        {
            name: "Shrvan",
            team: "Technical Team",
            role: "Head",
            phone: "+91 94229 58592",
            email: "shravan45x@gmail.com",
            instagram: "069.f5",
            image: assetPath("/assets/members/Shrvan.webp")
        },
        {
            name: "Team Talentron",
            team: "MANAGEMENT",
            role: "Technical Support",
            phone: "+91 80104 53267",
            email: "support@talentron.in",
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
                        <img src={assetPath('/assets/logos/contact_us.webp')} alt="Contact Us" />
                    </div>
                </header>

                <div className="contact-main-grid">
                    <div className="contact-form-section">
                        <div className="contact-form-card">
                            <h2 className="section-title">GET IN TOUCH</h2>
                            <p className="section-subtitle">Drop us a message and we'll get back to you soon.</p>
                            
                            {submitted ? (
                                <div className="form-success-message">
                                    <div className="success-icon">✨</div>
                                    <h3>Message Sent!</h3>
                                    <p>Thanks for reaching out. We'll be in touch shortly.</p>
                                    <button onClick={() => setSubmitted(false)} className="back-btn">SEND ANOTHER</button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="contact-form">
                                    <div className="form-group">
                                        <label htmlFor="name">Full Name</label>
                                        <input 
                                            type="text" 
                                            id="name" 
                                            name="name" 
                                            placeholder="Enter your name" 
                                            required 
                                            value={formData.name}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="email">Email Address</label>
                                        <input 
                                            type="email" 
                                            id="email" 
                                            name="email" 
                                            placeholder="Enter your email" 
                                            required 
                                            value={formData.email}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="message">Your Message</label>
                                        <textarea 
                                            id="message" 
                                            name="message" 
                                            rows={5} 
                                            placeholder="Tell us about your query..." 
                                            required 
                                            value={formData.message}
                                            onChange={handleChange}
                                        ></textarea>
                                    </div>
                                    <button type="submit" className="submit-btn" disabled={isSubmitting}>
                                        {isSubmitting ? 'SENDING...' : 'SEND MESSAGE'}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>

                    <div className="contact-info-section">
                        <div className="organizers-list">
                            <h2 className="section-title">ORGANIZERS</h2>
                            <p className="section-subtitle">Reach out directly to our team leads.</p>
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
                                                <img src={assetPath('/assets/icons/phone.webp')} alt="" className="contact-icon" /> {person.phone}
                                            </a>
                                            <a href={`mailto:${person.email}`} className="org-contact-link">
                                                <img src={assetPath('/assets/icons/envelope.webp')} alt="" className="contact-icon" /> {person.email}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
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
