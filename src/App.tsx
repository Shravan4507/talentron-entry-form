import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home/Home';
import Competitions from './pages/competitions/Competitions';
import GenreDetails from './pages/competitions/GenreDetails';
import RegistrationForm from './pages/competitions/RegistrationForm';
import Rules from './pages/rules/Rules';
import Contact from './pages/contact/Contact';
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import TermsOfService from './pages/legal/TermsOfService';
import NotFound from './pages/NotFound';
import Grainient from './components/background/Grainient';
import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';
import ScrollToTop from './components/navigation/ScrollToTop';
import './components/background/Grainient.css';
import './App.css';

function AppContent() {
  return (
    <div className="app-container">
      <ScrollToTop />
      <div className="grainient-background-wrapper">
        <Grainient
          color1="#ff0059" color2="#3600cc" color3="#ffc800"
          timeSpeed={0.25} warpStrength={1} warpFrequency={5}
          warpSpeed={2} warpAmplitude={50} grainAmount={0.15}
          contrast={1.2} zoom={0.9}
        />
        <div className="grainient-blur-overlay" />
        <div className="grainient-dim-overlay" />
      </div>

      <Navbar />

      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/competitions" element={<Competitions />} />
          <Route path="/competitions/:genre" element={<GenreDetails />} />
          <Route path="/register/:category" element={<RegistrationForm />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
