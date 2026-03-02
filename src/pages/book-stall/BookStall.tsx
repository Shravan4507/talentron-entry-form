import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import SEO from '../../components/navigation/SEO';
import { assetPath } from '../../utils/assetPath';
import SearchableDropdown from '../../components/searchable-dropdown/SearchableDropdown';
import './BookStall.css';

const BookStall = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        businessName: '',
        phoneNumber: '+91 ',
        stallType: 'Food & Beverages',
        message: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            await addDoc(collection(db, "stall_inquiries"), {
                ...formData,
                submittedAt: serverTimestamp(),
                status: 'unread'
            });
            setSubmitted(true);
            setFormData({ fullName: '', businessName: '', phoneNumber: '', stallType: 'Food & Beverages', message: '' });
        } catch (error) {
            console.error("Error submitting stall inquiry: ", error);
            alert("Something went wrong. Please try again later.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const stallOptions = [
        "Food & Beverages",
        "Beverages / Mocktails / Shakes",
        "Gourmet Snacks / Desserts",
        "Apparel / Fashion / Sneakers",
        "Anime & Pop-Culture Merch",
        "Handicrafts / Art / Decor",
        "Gaming / VR Experience",
        "Interactive Games / Photo Booths",
        "Tech & Mobile Accessories",
        "Beauty / Skincare Products",
        "Stationery / Books / Art Supplies",
        "Educational / Career Services",
        "Corporate Brand Promotion",
        "NGO / Awareness Stand",
        "Official Sponsorship Interest"
    ];

    return (
        <div className="book-stall-page">
            <SEO 
                title="Book a Stall | Talentron '26"
                description="Interested in setting up a stall at Talentron '26? Fill out the interest form and our team will get in touch with you."
            />

            <div className="stall-container">
                <header className="stall-header">
                    <img 
                        src={assetPath('/assets/logos/book_stall.webp')} 
                        alt="Book Your Stall" 
                        className="stall-header-image" 
                    />
                    <p className="stall-subtitle">Partner with Pune's biggest college fest. Show your brand to 5000+ students!</p>
                </header>

                <div className="stall-form-section">
                    {submitted ? (
                        <div className="success-message-box">
                            <div className="success-icon">✦</div>
                            <h2>Application Received!</h2>
                            <p>Our management team will review your interest and contact you shortly.</p>
                            <button className="reset-btn" onClick={() => setSubmitted(false)}>Submit Another</button>
                        </div>
                    ) : (
                        <div className="stall-card">
                            <form onSubmit={handleSubmit} className="stall-form">
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Full Name</label>
                                        <input 
                                            type="text" 
                                            name="fullName" 
                                            placeholder="Your Name"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            required 
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Business / Brand Name</label>
                                        <input 
                                            type="text" 
                                            name="businessName" 
                                            placeholder="Gourmet Delights etc."
                                            value={formData.businessName}
                                            onChange={handleChange}
                                            required 
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Phone Number (WhatsApp)</label>
                                        <input 
                                            type="tel" 
                                            name="phoneNumber" 
                                            placeholder="+91 00000 00000"
                                            value={formData.phoneNumber}
                                            onChange={handleChange}
                                            required 
                                        />
                                    </div>
                                    <div className="form-group">
                                        <SearchableDropdown 
                                            label="Type of Stall"
                                            options={stallOptions}
                                            value={formData.stallType}
                                            onChange={(val: string) => setFormData(prev => ({ ...prev, stallType: val }))}
                                            placeholder="Select or type..."
                                            required
                                            allowManual={true}
                                        />
                                    </div>
                                </div>

                                <div className="form-group full-width">
                                    <label>Briefly describe your stall requirements</label>
                                    <textarea 
                                        name="message" 
                                        rows={4} 
                                        placeholder="Space needed, power requirements, etc."
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                    ></textarea>
                                </div>

                                <button type="submit" className="stall-submit-btn" disabled={isSubmitting}>
                                    {isSubmitting ? 'SENDING INTEREST...' : 'SUBMIT INTEREST'}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookStall;
