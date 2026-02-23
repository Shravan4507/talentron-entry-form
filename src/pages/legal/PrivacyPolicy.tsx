import React from 'react';
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
                <p>When you register for Talentron '26, we collect specific personal information to facilitate your participation in our competitions. This includes:</p>
                <ul>
                    <li>Name (First and Last)</li>
                    <li>Email Address</li>
                    <li>Phone Number and WhatsApp Number</li>
                    <li>Date of Birth</li>
                    <li>College Name</li>
                    <li>Competition Category and Team Details</li>
                </ul>

                <h2>2. How We Use Your Information</h2>
                <p>The information we collect is used solely for the following purposes:</p>
                <ul>
                    <li>Processing your registration for specific art forms.</li>
                    <li>Communicating essential event updates, schedules, and audition details.</li>
                    <li>Verifying your eligibility based on age and college affiliation.</li>
                    <li>Organizing team registrations and coordinating with group representatives.</li>
                </ul>

                <h2>3. Data Protection</h2>
                <p>We implement a variety of security measures to maintain the safety of your personal information. Your data is stored securely and is only accessible by the authorized organizing committee members of Talentron '26.</p>

                <h2>4. Sharing of Information</h2>
                <p>We do not sell, trade, or otherwise transfer your personal information to outside parties. This does not include trusted partners who assist us in conducting the event, so long as those parties agree to keep this information confidential.</p>

                <h2>5. Contact Us</h2>
                <p>If you have any questions regarding this privacy policy, you may contact the organizing committee at Zeal College of Engineering and Research, Pune.</p>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
