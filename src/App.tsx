import { createBrowserRouter, RouterProvider, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Home from './pages/home/Home';
import Competitions from './pages/competitions/Competitions';
import GenreDetails from './pages/competitions/GenreDetails';
import RegistrationForm from './pages/competitions/RegistrationForm';
import Rules from './pages/rules/Rules';
import Contact from './pages/contact/Contact';
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import TermsOfService from './pages/legal/TermsOfService';
import NotFound from './pages/NotFound';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import Grainient from './components/background/Grainient';
import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';
import ScrollToTop from './components/navigation/ScrollToTop';
import PageTransition from './components/navigation/PageTransition';
import TopLoadingBar from './components/navigation/TopLoadingBar';
import BackToTop from './components/navigation/BackToTop';
import './components/background/Grainient.css';
import './App.css';

function RootLayout() {
  const location = useLocation();

  return (
    <div className="app-container">
      <TopLoadingBar />
      <BackToTop />
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
        <AnimatePresence mode="wait">
          <PageTransition key={location.pathname}>
            <Outlet />
          </PageTransition>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'competitions', element: <Competitions /> },
      { path: 'competitions/:genre', element: <GenreDetails /> },
      { path: 'register/:category', element: <RegistrationForm /> },
      { path: 'rules', element: <Rules /> },
      { path: 'contact', element: <Contact /> },
      { path: 'privacy-policy', element: <PrivacyPolicy /> },
      { path: 'terms-of-service', element: <TermsOfService /> },
      { path: 'admin-login', element: <AdminLogin /> },
      { path: 'admin-dashboard', element: <AdminDashboard /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
