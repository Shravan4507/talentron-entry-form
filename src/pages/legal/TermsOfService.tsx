import { assetPath } from '../../utils/assetPath';
import SEO from '../../components/navigation/SEO';
import './LegalPage.css';

const TermsOfService: React.FC = () => {
    return (
        <div className="legal-page">
            <SEO 
                title="Terms of Service - Talentron '26"
                description="Terms and conditions for participating in Talentron '26 competitions."
            />

            <div className="legal-header">
                <img 
                    src={assetPath('/assets/logos/terms_of_service.png')} 
                    alt="Terms of Service" 
                    className="legal-header-image" 
                />
                <p className="last-updated">Last Updated: February 2026</p>
            </div>

            <div className="legal-content">
                <h2>1. Acceptance of Terms</h2>
                <p>By registering for Talentron '26, you agree to these terms. If registering for a team, you represent that all members have authorized you to accept these terms on their behalf.</p>

                <h2>2. Eligibility & Verification</h2>
                <p>Participation is open to students aged <strong>16 to 30 years</strong> only. A valid College ID or Government-issued ID card is mandatory for verification. Any discrepancies in age or status will result in immediate disqualification without refund.</p>

                <h2>3. Registration & Team Management</h2>
                <ul>
                    <li><strong>Non-Refundable:</strong> All registration fees are strictly <strong>non-refundable</strong>.</li>
                    <li><strong>Team Changes:</strong> Team member changes are generally permitted; please notify the Management Team before the performance.</li>
                    <li><strong>Verification:</strong> Providing incorrect Transaction IDs or fake payment screenshots will lead to immediate cancellation.</li>
                </ul>

                <h2>4. Round 1 & Selection</h2>
                <p>Shortlisting involves both offline and online formats depending on the category. Only shortlisted participants/teams are eligible for the Final Round.</p>

                <h2>5. Punctuality & Reporting</h2>
                <p>Participants must report at least <strong>30 minutes</strong> before their competition's Round 1. Failure to report on time may result in slot adjustments or disqualification.</p>

                <h2>6. Track & Props Submission</h2>
                <p>All performance tracks should be shared with us via email or on the day of Round 1. We recommend keeping a backup of your track in a pendrive. Participants are responsible for managing and immediately removing their own props and instruments.</p>

                <h2>7. Prohibited Items & Safety</h2>
                <p>Strictly prohibited: Fire, smoke machines, crackers, real weapons, sharp objects, and hazardous liquids. Any damage to the venue or equipment will be the responsibility of the involved participants.</p>

                <h2>8. Content & Conduct</h2>
                <ul>
                    <li><strong>Judging:</strong> The judges' decision is final. No arguments or appeals will be entertained regarding the results.</li>
                    <li><strong>Behavior:</strong> Any misconduct with volunteers, staff, or fellow participants will lead to the expulsion of the entire team/individual.</li>
                    <li><strong>General:</strong> Plagiarism or copying performances will lead to disqualification. Misconduct with judges or the Management Team will result in eviction from the event.</li>
                </ul>

                <h2>9. Final Authority</h2>
                <p>The Management Team reserves the right to modify rules, schedules, or formats as needed. ZCOER Pune campus rules must be strictly followed.</p>
            </div>
        </div>
    );
};

export default TermsOfService;
