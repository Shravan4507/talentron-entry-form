import SEO from '../../components/navigation/SEO';
import ComingSoon from '../../components/status/ComingSoon';
import './Sponsors.css';

const Sponsors: React.FC = () => {
    return (
        <div className="sponsors-page">
            <SEO 
                title="Sponsors & Partners | Talentron '26"
                description="The visionaries building the spectacle."
            />
            <ComingSoon 
              title="PARTNERS REVEALING"
              subtitle="We're finalizing our lists of brands that power Talentron '26. See you soon!"
              image="/assets/logos/sponsors.webp"
            />
        </div>
    );
};

export default Sponsors;
