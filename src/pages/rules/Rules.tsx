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
                'The competition is open to participants aged 16 to 27 years.',
                'Participants must carry a valid college ID or government ID for verification.'
            ]
        },
        {
            id: 'registration',
            title: 'REGISTRATION',
            points: [
                'Registration is mandatory for all participants.',
                'On-spot entries are not allowed unless prior permission is given by the event team.',
                'Team member changes are not allowed after registration without prior approval of the organizers.',
                'Replacement of members is allowed only in genuine emergencies and with prior approval.'
            ]
        },
        {
            id: 'auditions',
            title: 'AUDITIONS & SELECTION',
            points: [
                'Dance, Music and Dramatics will have offline auditions.',
                'Street Play and Band will have online auditions.',
                'Only shortlisted teams/participants will be allowed to perform in the final round.',
                'Participants not selected in auditions will be eliminated from further rounds.'
            ]
        },
        {
            id: 'punctuality',
            title: 'REPORTING & PUNCTUALITY',
            points: [
                'Participants/teams must report at least 30 minutes before their allotted slot.',
                'Performance slots are strictly allocated by the organizers.',
                'Failure to report on time may result in: Performance slot shift, Points deduction, or Disqualification in serious cases.',
                'If a participant/team is absent during their slot, they will be marked absent and disqualified from that round.'
            ]
        },
        {
            id: 'time-discipline',
            title: 'TIME DISCIPLINE',
            points: [
                'All performances must strictly follow the given time limits.',
                'Exceeding time limits may lead to penalties or disqualification.',
                'Warning and final bells (if applicable) will be strictly followed.'
            ]
        },
        {
            id: 'tracks',
            title: 'TRACK SUBMISSION',
            points: [
                'If a track is required, participants can upload it during registration.',
                'Tracks may also be submitted on the audition day if not uploaded earlier.',
                'If selected for finals, the final track must be submitted at least 48 hours before the performance.',
                'Track format: MP3 only. Must be submitted via email. Pendrives will not be accepted.',
                'Failure to submit tracks within the deadline may result in penalties or disqualification.',
                'Participants are advised to submit tracks in advance and keep a backup.'
            ]
        },
        {
            id: 'props',
            title: 'PROPS, INSTRUMENTS & COSTUMES',
            points: [
                'All props, costumes, and instruments must be arranged and managed by participants.',
                'Participants must remove all props immediately after their performance.',
                'Any damage caused to the venue or equipment will be the responsibility of the participants.'
            ]
        },
        {
            id: 'prohibited',
            title: 'PROHIBITED ITEMS',
            points: [
                'Strictly prohibited: Fire, Smoke machines, Crackers, Real weapons, Sharp objects, and liquids that may cause damage or slipping hazards.'
            ]
        },
        {
            id: 'content',
            title: 'CONTENT GUIDELINES',
            points: [
                'Vulgarity, abusive language, hate speech, or obscene content is not allowed.',
                'Political or religious content must not target or insult any community.',
                'Any content promoting hatred or discrimination may lead to disqualification.',
                'Plagiarism or copied performances may lead to disqualification.',
                'Language used must be respectful and suitable for a college audience.'
            ]
        },
        {
            id: 'technical',
            title: 'TECHNICAL ISSUES & EMERGENCIES',
            points: [
                'Restarts due to technical issues or external disturbances will be granted only at the judges’ discretion.',
                'Participants must attend technical checks if called by the event team.',
                'In case of any emergency, participants must immediately inform the organizers.',
                'Judges will decide whether the performance resumes or is terminated.'
            ]
        },
        {
            id: 'conduct',
            title: 'CONDUCT',
            points: [
                'Misbehavior, arguing with judges, or violation of event discipline may lead to disqualification.',
                'Organizers have the right to stop any performance violating rules or safety norms.'
            ]
        },
        {
            id: 'judging',
            title: 'JUDGING & RESULTS',
            points: [
                'Judges’ decisions are final and binding.',
                'Arguments or disputes regarding marks will not be entertained.',
                'In case of a tie, a tie-breaker round will be conducted. Judges’ decision will be final.'
            ]
        },
        {
            id: 'fees',
            title: 'FEES, REFUNDS & CERTIFICATES',
            points: [
                'Registration fees are strictly non-refundable.',
                'Participants eliminated in auditions are not eligible for refunds.',
                'Certificates of participation will be provided to all registered participants who appear for auditions or performances.'
            ]
        },
        {
            id: 'organizer-rights',
            title: 'ORGANIZER RIGHTS',
            points: [
                'The organizers reserve the right to modify rules, schedules, or formats in case of unavoidable situations.',
                'Any updates will be communicated to participants.'
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
                        src={assetPath('/assets/logos/general_rules.png')} 
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
