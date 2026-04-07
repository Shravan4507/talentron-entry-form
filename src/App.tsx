import { createBrowserRouter, RouterProvider, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ComingSoon from './pages/coming-soon/ComingSoon';
import Grainient from './components/background/Grainient';
import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';
import ScrollToTop from './components/navigation/ScrollToTop';
import PageTransition from './components/navigation/PageTransition';
import TopLoadingBar from './components/navigation/TopLoadingBar';
import BackToTop from './components/navigation/BackToTop';
import VersionChecker from './components/version/VersionChecker';
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
  // The Coming Soon page is now the main entry point
  {
    path: '/',
    element: <ComingSoon />,
  },
  // Admin routes remain accessible for the USER
  {
    path: '/admin',
    element: <RootLayout />,
    children: [
      { path: 'login', element: <AdminLogin /> },
      { path: 'dashboard', element: <AdminDashboard /> },
    ]
  },
  // Redirect any other route to ComingSoon
  {
    path: '*',
    element: <ComingSoon />,
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <VersionChecker />
    </>
  );
}

export default App;

