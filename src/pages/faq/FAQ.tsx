import React, { useState } from 'react';
import SEO from '../../components/navigation/SEO';
import { assetPath } from '../../utils/assetPath';
import './FAQ.css';

interface FAQItemProps {
    question: string;
    answer: string;
    isOpen: boolean;
    onClick: () => void;
    id: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer, isOpen, onClick, id }) => {
    return (
        <div className={`faq-item ${isOpen ? 'open' : ''}`} id={id}>
            <button className="faq-question" onClick={onClick} aria-expanded={isOpen}>
                <span>{question}</span>
                <span className="faq-icon">{isOpen ? '−' : '+'}</span>
            </button>
            <div className="faq-answer">
                <div className="faq-answer-content">
                    {answer}
                </div>
            </div>
        </div>
    );
};

const FAQ: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const faqs = [
        {
            question: "How do I register for Talentron '26?",
            answer: "You can register by visiting the 'Competitions' page, selecting your desired category, and filling out the registration form. Don't forget to upload your payment screenshot for verification!"
        },
        {
            question: "Can I participate in multiple events?",
            answer: "No, you can't participate in multiple events. You can only register and pay for one event."
        },
        {
            question: "Is Talentron open to students from other colleges?",
            answer: "Absolutely! Talentron is an inter-college cultural extravaganza. We welcome students from all recognized universities and colleges across India."
        },
        {
            question: "What is the reporting time for the events?",
            answer: "The general reporting time is 9:00 AM SHARP at the Zeal Institutes (Narhe Campus). However, specific reporting times for each competition will be shared via your registered WhatsApp number and Email."
        },
        {
            question: "Will I receive a certificate for participation?",
            answer: "Yes, all recognized participants will receive a certificate of participation. Winners and runners-up will also receive special merit certificates and trophies."
        },
        {
            question: "Can I register on-the-spot on the day of the event?",
            answer: "While we recommend online registration to avoid clashing slots, on-the-spot registrations may be available depending on the remaining slots for specific competitions."
        },
        {
            question: "What should I bring on the event day?",
            answer: "You must bring your College ID card (mandatory) and the registration confirmation mail. If your event requires specific props or equipment (like instruments or costumes), please bring them along."
        },
        {
            question: "Is there an entry fee for visitors/audience?",
            answer: "Entry to the campus is free for visitors."
        }
    ];

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="faq-page">
            <SEO 
                title="FAQ | Frequently Asked Questions | Talentron '26"
                description="Find answers to common questions about Talentron '26 registrations, event rules, reporting times, and more."
            />

            <div className="faq-container">
                <header className="faq-header">
                    <img 
                        src={assetPath('/assets/logos/doubts.webp')} 
                        alt="Any Doubts?" 
                        className="faq-header-image" 
                    />
                    <p className="faq-subtitle">Everything you need to know about Talentron '26. If you still have questions, reach out to us via the contact page.</p>
                </header>

                <div className="faq-list">
                    {faqs.map((faq, index) => (
                        <FAQItem 
                            key={index}
                            id={`faq-item-${index}`}
                            question={faq.question}
                            answer={faq.answer}
                            isOpen={openIndex === index}
                            onClick={() => toggleFAQ(index)}
                        />
                    ))}
                </div>

                <div className="faq-cta-section">
                    <div className="faq-cta-card">
                        <h3>STILL CONFUSED?</h3>
                        <p>Our helpdesk is active to solve your queries.</p>
                        <a href="/contact" className="faq-contact-link">TALK TO US</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FAQ;
