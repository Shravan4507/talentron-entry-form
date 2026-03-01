import SEO from '../../components/navigation/SEO';
import ComingSoon from '../../components/status/ComingSoon';
import './Schedule.css';

const Schedule: React.FC = () => {
    return (
        <div className="schedule-page">
            <SEO 
                title="Event Schedule | Talentron '26"
                description="Live countdown and event schedule for Talentron '26."
            />
            <ComingSoon 
              title="SCHEDULE REVEALING"
              subtitle="The battle plan is being drafted. Check back soon for the full Phase 1 & Phase 2 timings!"
              image="/assets/logos/schedule.webp"
            />
        </div>
    );
};

export default Schedule;

