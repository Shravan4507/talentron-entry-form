import React from 'react';
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
                <p>By registering for Talentron '26, you agree to be bound by these Terms of Service. If you are registering on behalf of a team, you represent that you have the authority to bind all team members to these terms.</p>

                <h2>2. Eligibility</h2>
                <p>Participants must be bonafide students of a recognized college. A valid College ID card must be presented at the time of auditions and the final event. Any discrepancy in eligibility details may lead to immediate disqualification.</p>

                <h2>3. Registration & Team Participation</h2>
                <ul>
                    <li><strong>Solo/Group:</strong> Specific categories (Drama, Band, Street Play) are strictly for groups. Music and Dance allow solo or group entries.</li>
                    <li><strong>Group Details:</strong> For group registrations, the person registering (the representative) must provide full details of all team members at the time of auditions.</li>
                    <li><strong>Accuracy:</strong> All information provided during registration must be accurate. False information will result in cancellation of the entry.</li>
                </ul>

                <h2>4. Code of Conduct</h2>
                <p>Participants are expected to maintain professional behavior. Any form of misconduct, use of inappropriate language, or violation of campus rules at ZCOER Pune will lead to disqualification and potential reporting to your home institution.</p>

                <h2>5. Content Ownership & Media</h2>
                <p>By participating, you grant Talentron '26 the right to record, photograph, and use your performance for promotional purposes across digital and print media.</p>

                <h2>6. Decision Finality</h2>
                <p>The decisions of the judges and the Talentron organizing committee are final and binding in all matters related to the competitions. No appeals will be entertained.</p>

                <h2>7. Changes to Terms</h2>
                <p>The organizing committee reserves the right to modify these terms at any time. It is the participant's responsibility to check for updates.</p>
            </div>
        </div>
    );
};

export default TermsOfService;
