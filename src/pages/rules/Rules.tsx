import { useNavigate } from 'react-router-dom';
import SEO from '../../components/navigation/SEO';
import { assetPath } from '../../utils/assetPath';
import RuleBookButton from '../../components/navigation/RuleBookButton';
import './Rules.css';

const Rules = () => {
    const navigate = useNavigate();

    const generalRules = [
        {
            id: 'eligibility',
            title: 'ELIGIBILITY',
            points: [
                'The competition is open to participants aged 16 to 30 years.',
                'Participants must carry a valid college ID or government ID for verification.'
            ]
        },
        {
            id: 'registration',
            title: 'REGISTRATION',
            points: [
                'Registration is mandatory for all participants.',
                'Each participant (Solo/Group) is strictly limited to only ONE competition across all genres.',
                'Multiple registrations using different emails to bypass this will lead to disqualification.',
                'On-spot registration is available on the day of Round 1 at the venue.',
                'We allow team member changes if needed; please ensure the Management Team is updated.'
            ]
        },
        {
            id: 'round-1',
            title: 'ROUND 1 & SELECTION',
            points: [
                'Band will have an online Round 1.',
                'Dance, Music, Drama, and Street Play will have offline Round 1 at the venue.',
                'Only shortlisted teams and participants will be invited to perform in the Final Round.'
            ]
        },
        {
            id: 'punctuality',
            title: 'REPORTING & PUNCTUALITY',
            points: [
                'Participants must be present 30 minutes before respective event.',
                'Performance slots are allocated by the Management Team on First Come First Serve basis.',
                'If a participant or team is absent during their slot, they may be marked absent for that round.'
            ]
        },
        {
            id: 'time-discipline',
            title: 'TIME DISCIPLINE',
            points: [
                'All performances are requested to follow the provided time limits.',
                'Exceeding time limits may lead to disqualification from the round.',
                'Warning and final signals will be used to help you manage your time.'
            ]
        },
        {
            id: 'tracks',
            title: 'TRACK SUBMISSION',
            points: [
                "Performance tracks should be shared via email.",
                "We recommend keeping a backup of your track in your device or in a pendrive.",
            ]
        },
        {
            id: 'props',
            title: 'PROPS, INSTRUMENTS & COSTUMES',
            points: [
                'All props, costumes, and instruments are to be managed by the participants.',
                'Please inform the Management Team about specific requirements in advance. (if any)',
                'Participants are requested to remove their props immediately after the performance.',
                'The safety and care of the venue and equipment are shared responsibilities of all participants.'
            ]
        },
        {
            id: 'prohibited',
            title: 'PROHIBITED ITEMS',
            points: [
                'To ensure safety, please avoid: Fire, Smoke machines, Crackers, Real weapons, and Sharp objects.'
            ]
        },
        {
            id: 'content',
            title: 'CONTENT GUIDELINES',
            points: [
                'We encourage creative expression while keeping content suitable for a diverse audience.',
                'Political or religious themes should be handled with sensitivity towards all communities.',
            ]
        },
        {
            id: 'technical',
            title: 'TECHNICAL ISSUES',
            points: [
                'In case of technical issues, the Management Team will facilitate a resolution.',
                'Participants are encouraged to attend any scheduled technical checks.'
            ]
        },
        {
            id: 'fees',
            title: 'FEES & CERTIFICATES',
            points: [
                'Registration fees are non-refundable.',
                'Certificates of participation will be provided to all registered participants who appear for their rounds.'
            ]
        },
        {
            id: 'judging-behavior',
            title: 'JUDGING & BEHAVIOR',
            points: [
                "JUDGING: The judges' decision is final. No arguments or appeals will be entertained regarding the results.",
                "BEHAVIOR: Any misconduct with volunteers, staff, or fellow participants will lead to the expulsion of the entire team/individual."
            ]
        },
        {
            id: 'management-rights',
            title: 'MANAGEMENT RIGHTS',
            points: [
                'The Management Team reserves the right to adjust rules, schedules, or formats if necessary in severe cases.',
                'Any such updates will be communicated promptly to the participants.'
            ]
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
                    <img 
                        src={assetPath('/assets/logos/general_rules.webp')} 
                        alt="General Rules" 
                        className="rules-title-img"
                    />
                    <p className="rules-subtitle">Applicable to all competitions. Ensure you follow these guidelines for a fair experience.</p>
                    <RuleBookButton className="rules-page-btn" />
                </header>

                <div className="rules-grid">
                    {generalRules.map((rule) => (
                        <div key={rule.id} className="rule-card">
                            <div className="rule-dot"></div>
                            <h3 className="rule-title">{rule.title}</h3>
                            <ul className="rule-points">
                                {rule.points.map((point, idx) => (
                                    <li key={idx}>{point}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
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
                        <div style={{ marginTop: '2rem' }}>
                            <RuleBookButton />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Rules;
