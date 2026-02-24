import OutlinedTitle from '../../components/heading/OutlinedTitle';
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
                <OutlinedTitle 
                    text="TERMS OF SERVICE" 
                    fillColor="linear-gradient(180deg, #ffea00 0%, #ffc800 100%)" 
                    outlineColor="#000000" 
                    shadowColor="#000000"
                    className="small"
                />
                <p className="last-updated">Last Updated: February 2026</p>
            </div>

            <div className="legal-content">
                <h2>1. Acceptance of Terms</h2>
                <p>By registering for Talentron '26, you agree to these terms. If registering for a team, you represent that all members have authorized you to accept these terms on their behalf.</p>

                <h2>2. Eligibility & Age Limit</h2>
                <p>Participation is open to students aged <strong>16 to 27 years</strong> only. A valid College ID card is mandatory. Any discrepancies in age or academic status will result in immediate disqualification without refund.</p>

                <h2>3. Registration & Fees</h2>
                <ul>
                    <li><strong>Non-Refundable:</strong> All registration fees are strictly <strong>NON-REFUNDABLE</strong> under any circumstances, including absence or disqualification.</li>
                    <li><strong>Payment Verification:</strong> It is the participant's responsibility to provide an accurate Transaction ID and a clear screenshot of the payment. Fake or incorrect details will lead to immediate cancellation.</li>
                </ul>

                <h2>4. Scheduling & Punctuality</h2>
                <p>Performance slots are allocated solely by the organizers. Failure to report at the designated time will result in automatic disqualification. Participants are advised to arrive at least 60 minutes before their scheduled slot.</p>

                <h2>5. Performance & Interruptions</h2>
                <p>Restarts due to technical issues, audio failures, or external disturbances are granted solely at the judges' discretion. In case of an emergency, participants must signal an organizer immediately. The judges' decision to continue or terminate a performance is final.</p>

                <h2>6. Code of Conduct</h2>
                <p>Misconduct, inappropriate behavior, or violation of the event's code of conduct will lead to immediate disqualification. ZCOER Pune campus rules must be strictly followed.</p>

                <h2>7. Final Authority</h2>
                <p>All decisions made by the Talentron '26 judges and organizing committee are <strong>final and binding</strong>. No appeals or disputes will be entertained.</p>
            </div>
        </div>
    );
};

export default TermsOfService;
