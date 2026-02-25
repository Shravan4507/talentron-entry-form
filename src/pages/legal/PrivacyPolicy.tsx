import OutlinedTitle from '../../components/heading/OutlinedTitle';
import SEO from '../../components/navigation/SEO';
import './LegalPage.css';

const PrivacyPolicy: React.FC = () => {
    return (
        <div className="legal-page">
            <SEO 
                title="Privacy Policy - Talentron '26"
                description="Our privacy policy regarding data collection and usage for Talentron '26."
            />

            <div className="legal-header">
                <OutlinedTitle 
                    text="PRIVACY POLICY" 
                    fillColor="linear-gradient(180deg, #ffea00 0%, #ffc800 100%)" 
                    outlineColor="#000000" 
                    shadowColor="#000000"
                    className="small"
                />
                <p className="last-updated">Last Updated: February 2026</p>
            </div>

            <div className="legal-content">
                <h2>1. Information We Collect</h2>
                <p>To facilitate your registration and participation in Talentron '26, we collect the following personal information:</p>
                <ul>
                    <li><strong>Personal Details:</strong> Full Name, Email Address, Date of Birth, and Sex/Gender.</li>
                    <li><strong>Contact Information:</strong> Active mobile number and WhatsApp number for coordination.</li>
                    <li><strong>Academic Details:</strong> College name and student status verification.</li>
                    <li><strong>Participation Details:</strong> Competition category (genre), team type, and track files (if applicable).</li>
                    <li><strong>Payment Information:</strong> Transaction IDs and screenshots of payment receipts to verify registration fees.</li>
                </ul>

                <h2>2. How We Use Your Information</h2>
                <p>Your data is processed solely for the organization of Talentron '26:</p>
                <ul>
                    <li>Verifying eligibility (age 16-27) and academic status.</li>
                    <li>Processing payments and confirming successful registrations.</li>
                    <li>Communicating schedules, audition slots, and rules updates.</li>
                    <li>Generating certificates of participation and excellence.</li>
                    <li>On-site check-ins and stage management.</li>
                </ul>

                <h2>3. Data Protection</h2>
                <p>We implement security measures to protect your data. Your information is stored using Google's secure infrastructure (specifically Google Apps Script and related services) and is only accessible by the authorized Talentron '26 organizing committee.</p>

                <h2>4. Sharing of Information</h2>
                <p>We do NOT sell or trade your personal information. Data is only shared with internal committee members and trusted technical partners (like Google) who assist us in operating our platform and conducting the event, under strict confidentiality.</p>

                <h2>5. Contact Us</h2>
                <p>For any privacy-related queries, please contact the Talentron Organizing Committee at Zeal College of Engineering and Research, Pune.</p>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
