import { useNavigate } from 'react-router-dom';
import OutlinedTitle from '../../components/heading/OutlinedTitle';
import SEO from '../../components/navigation/SEO';
import './Rules.css';

const Rules = () => {
    const navigate = useNavigate();

    const generalRules = [
        {
            id: 'eligibility',
            title: 'ELIGIBILITY',
            text: 'Open to participants aged 16 to 27 years. Valid student ID proof is mandatory.'
        },
        {
            id: 'scheduling',
            title: 'SCHEDULING',
            text: 'Performance slots are strictly allocated by the organizers. No requests for slot changes will be entertained.'
        },
        {
            id: 'punctuality',
            title: 'PUNCTUALITY',
            text: 'Failure to report at the scheduled time results in immediate disqualification. Arrive at least 60 minutes prior.'
        },
        {
            id: 'interruptions',
            title: 'INTERRUPTIONS',
            text: 'Restarts due to technical issues, external disturbances, or performer mishaps are granted solely at the judges\' discretion.'
        },
        {
            id: 'emergency',
            title: 'EMERGENCY STOPPAGE',
            text: 'If an emergency occurs, signal an organizer immediately. Judges will decide if the performance resumes or terminates.'
        },
        {
            id: 'time-limits',
            title: 'TIME LIMITS',
            text: 'Strict adherence to time limits is required; exceeding them will lead to penalties or disqualification.'
        },
        {
            id: 'conduct',
            title: 'CONDUCT',
            text: 'Any misconduct, inappropriate behavior, or violation of the event\'s code of conduct will lead to immediate disqualification.'
        },
        {
            id: 'fees',
            title: 'FEES & REFUNDS',
            text: 'Registration fees are strictly NON-REFUNDABLE. Contact organizers for unavoidable absences.'
        },
        {
            id: 'authority',
            title: 'FINAL AUTHORITY',
            text: 'All decisions made by judges and organizers are final, binding, and beyond challenge.'
        }
    ];

    return (
        <div className="rules-page">
            <SEO 
                title="General Rules & Guidelines | Talentron '26"
                description="Read the official general rules and guidelines for Talentron '26 cultural festival. Ensure your eligibility and understand the competition standards."
            />

            <div className="rules-container">
                <header className="rules-header">
                    <OutlinedTitle 
                        text="GENERAL RULES" 
                        fillColor="linear-gradient(180deg, #ffea00 0%, #ffc800 100%)" 
                        outlineColor="#000000" 
                        shadowColor="#ff0059"
                    />
                    <p className="rules-subtitle">Ensure you follow these guidelines for a fair and successful competition experience.</p>
                </header>

                <div className="rules-grid">
                    {generalRules.map((rule) => (
                        <div key={rule.id} className="rule-card">
                            <div className="rule-dot"></div>
                            <h3 className="rule-title">{rule.title}</h3>
                            <p className="rule-text">{rule.text}</p>
                        </div>
                    ))}
                </div>

                <div className="rules-mid-cta">
                    <button onClick={() => navigate('/competitions')} className="rules-secondary-btn">
                        VIEW CATEGORY SPECIFIC RULES
                    </button>
                </div>

                <div className="rules-cta-section">
                    <div className="cta-box">
                        <h3>READY TO COMPETE?</h3>
                        <p>Registration is open for all categories including Music, Dance, and Drama.</p>
                        <button 
                            className="rules-primary-btn"
                            onClick={() => navigate('/competitions')}
                        >
                            BROWSE COMPETITIONS
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Rules;
