import SEO from '../../components/navigation/SEO';
import ComingSoon from '../../components/status/ComingSoon';
import './BookStall.css';

const BookStall = () => {
    return (
        <div className="book-stall-page">
            <SEO 
                title="Book a Stall | Talentron '26"
                description="Become a partner commerce entity at Talentron '26."
            />
            <ComingSoon 
              title="COMMERCE OPENING"
              subtitle="Stall bookings will open shortly. Stay tuned to grab your spot at the festival grounds!"
              image="/assets/logos/book_stall.webp"
            />
        </div>
    );
};

export default BookStall;
