import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Code, Brain, Target, Rocket } from "lucide-react";
import "./App.css";
import { Toaster } from 'react-hot-toast';
// import { DashboardProvider } from './assets/dashboard/context/DashboardContext';

// Import components
import Navbar from "./components/home/Navbar";
import Footer from "./components/home/Footer";
// import BackToTopButton from './components/common/BackToTop'
import { AuthProvider } from './auth/AuthContext'
import ProtectedRoute from './auth/ProtectedRoute'
// import NotFound from "./error/NotFound";
import HackathonPage from "./components/Hackathon/HackathonPage";
import RegistrationPage from './components/registration/RegistrationPage';

import JudgeLeaderboard from './components/Judge/JudgeLeaderBoard'

import HackathonJudgeLogin from "./components/Judge/HackathonJudgeLogin";
import RatingPanel from "./components/Judge/RatingPanel";
import Leaderboard from "./components/Judge/Leaderboard";
import JudgingNavbar from "./components/Judge/JudgeNavbar";
import HackathonLoginPage from './components/registration/HackathonLoginPage'

const HackathonDashboard = React.lazy(() => import('./components/HackathonDashboard/HackathonDashboard'));
const HackathonAdminLogin = React.lazy(() => import('./components/HackAdmin/HackathonAdminLogin'))
const ManageHackathon = React.lazy(() => import('./components/HackAdmin/ManageHackathon'))

// Dashboard-related lazy-loaded components
// const WorkshopProgressCard = React.lazy(() => import('./assets/dashboard/learning/WorkshopProgressCard'));
// const AssessmentPage = React.lazy(() => import('./assets/dashboard/learning/AssessmentPage'));

// Loading spinner component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// Animated Background Component
const AnimatedBackground = () => {
  const icons = [Code, Brain, Target, Rocket];

  return (
    <div className="animated-background">
      {[...Array(20)].map((_, i) => {
        const Icon = icons[i % icons.length];
        return (
          <div
            key={i}
            className="floating-item"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          >
            <Icon />
          </div>
        );
      })}
    </div>
  );
};

// Layout Component to wrap all routes
const Layout = ({ children }) => {
  const location = useLocation();

  // Check if the current route is a dashboard route
  const isDashboardRoute =
    location.pathname.startsWith('/student-dashboard') ||
    location.pathname.startsWith('/university-dashboard') ||
    location.pathname.startsWith('/admin') || location.pathname.startsWith('/hackathon-manager') || location.pathname.startsWith('/hackathon-dashboard') ||
    location.pathname.startsWith('/innonvonox-admin') || location.pathname.startsWith('/innonvonox-organizer') || location.pathname.startsWith('/judge-dashboard') || location.pathname.startsWith('/judge/leaderboard') || location.pathname.startsWith('/innonvonox-participant') || location.pathname.startsWith('/hackathon-dashboard2') || location.pathname.startsWith('/hackathon-manager2') || location.pathname.startsWith('/innonvonox-judge') || location.pathname.startsWith('/innonvonx-sponsor') || location.pathname.startsWith('/innonvonx-marketing')
  return (
    <>
      {!isDashboardRoute && <Navbar />}
      <div className="relative min-h-screen">
        <AnimatedBackground />
        {children}
        {/* <BackToTopButton /> */}
      </div>
      {!isDashboardRoute && <Footer />}
    </>
  );
};

// Dashboard Layout Component
const DashboardLayout = ({ children }) => {
  return (

    <div className="min-h-screen bg-gray-50">
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            theme: {
              primary: '#4CAF50',
              secondary: '#ffffff',
            },
          },
          error: {
            duration: 4000,
            theme: {
              primary: '#F44336',
              secondary: '#ffffff',
            },
          },
        }}
      />
    </div>

  );
};
const JudgingLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 text-white">
      <JudgingNavbar />
      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            theme: {
              primary: '#4CAF50',
              secondary: '#ffffff',
            },
          },
          error: {
            duration: 4000,
            theme: {
              primary: '#F44336',
              secondary: '#ffffff',
            },
          },
        }}
      />
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Hackathon Routes without Layout */}
          <Route path="/" element={<HackathonPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/hackathon-manager-login" element={<HackathonAdminLogin />} />
          {/* <Route path="/Hackathon-login" element={<LoginPagehack />} /> */}
          <Route path='/new-participant-login' element={<HackathonLoginPage />} />



          {/* Routes with Layout */}On
          <Route path="/*" element={
            // <Layout>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>

                <Route path="/judge/login" element={<HackathonJudgeLogin />} />
                <Route path="/judge/leaderboard" element={<JudgeLeaderboard />} />

                {/* Hackathon Dashboard Routes */}
                <Route
                  path="/hackathon-dashboard/*"
                  element={
                    <ProtectedRoute allowedUserTypes={['HACKONXUser']}>
                      <DashboardLayout>
                        <Routes>
                          <Route index element={<HackathonDashboard />} />
                          {/* Add other hackathon user routes here if needed */}
                        </Routes>
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />


                <Route
                  path="/hackathon-manager"
                  element={
                    <ProtectedRoute allowedUserTypes={['HACKONXManager']}>
                      <DashboardLayout>
                        <ManageHackathon />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />


                <Route
                  path="/judge-dashboard/*"
                  element={
                    <ProtectedRoute allowedUserTypes={['HACKONXJudge']}>
                      <JudgingLayout>
                        <Routes>
                          <Route index element={<RatingPanel />} />
                          <Route path="rating" element={<RatingPanel />} />
                          <Route path="leaderboard" element={<Leaderboard />} />
                        </Routes>
                      </JudgingLayout>
                    </ProtectedRoute>
                  }
                />

                {/* <Route path="*" element={<NotFound />} /> */}
              </Routes>
            </Suspense>
            // </Layout>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;