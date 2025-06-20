import React, { useState, Suspense, useEffect } from 'react';
import {
  Users,
  Trophy,
  MapPin,
  Mail,
  Calendar,
  Info,
  UserCheck,
  ArrowRight,
  ChevronRight,
  Star,
  Clock,
  Check,
  Award,
  MessageCircle,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';

import logo from "../../assets/logo/logo.png";
import logo2 from "../../assets/logo/logo2.png";

import ErrorBoundary from './ErrorBoundry';

// Import components
import TimelineComponent from './TimelineComponent';
import AboutSection from './AboutSection';
import EligibilitySection from './EligibilitySection';
import RewardsSection from './RewardsSection';
import FAQSection from './FAQSection';
import LoadingSpinner from './LoadingSpinner';

// Import data
import { timelineData } from './timelineData';
import { aboutData } from './aboutData';
import { eligibilityData } from './eligibilityData';

const HackathonPage = () => {
  const [activeTab, setActiveTab] = useState('timeline');
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const tabConfig = [
    {
      id: 'timeline',
      label: 'Timeline',
      component: TimelineComponent,
      data: timelineData,
      icon: <Calendar className="w-5 h-5" />
    },
    {
      id: 'about',
      label: 'About',
      component: AboutSection,
      data: aboutData,
      icon: <Info className="w-5 h-5" />
    },
    {
      id: 'eligibility',
      label: 'Eligibility',
      component: EligibilitySection,
      data: eligibilityData,
      icon: <UserCheck className="w-5 h-5" />
    }
  ];

  const renderContent = () => {
    const currentTab = tabConfig.find(tab => tab.id === activeTab);
    if (!currentTab) return null;

    const Component = currentTab.component;
    return (
      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          <Component data={currentTab.data} />
        </Suspense>
      </ErrorBoundary>
    );
  };

  return (
    <div className="w-screen max-w-[100vw] overflow-x-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">

      {/* Sticky Header */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-md py-3' : 'bg-transparent py-5'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo on the left */}
            <div className="flex items-center space-x-3">
              <Link to="/" className="flex items-center">
                {!isScrolled ? (
                  <img src={logo} alt="Logo" className="h-7 md:h-10 w-auto" />
                ) : (
                  <img src={logo2} alt="Logo" className="h-7 md:h-10 w-auto" />
                )}
              </Link>
            </div>

            {/* Center navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {tabConfig.map((tab) => (
                <button
                  key={tab.id}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab(tab.id);
                    document.getElementById('content-section').scrollIntoView({
                      behavior: 'smooth'
                    });
                  }}
                  className={`text-sm font-medium transition-colors ${activeTab === tab.id
                    ? isScrolled
                      ? 'text-blue-700 border-b-2 border-blue-700 pb-1'
                      : 'text-white border-b-2 border-white pb-1'
                    : isScrolled
                      ? 'text-gray-600 hover:text-blue-600'
                      : 'text-white hover:text-blue-100'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
              
            </div>

            {/* Right side with register and login buttons */}
            <div className="hidden md:flex items-center space-x-3">
              <Link
                to="/new-participant-login"
                className={`px-5 py-2.5 rounded-full font-medium transition-all text-sm ${isScrolled
                  ? 'bg-white text-blue-700 border border-blue-200 hover:bg-blue-50'
                  : 'bg-blue-600/20 backdrop-blur-sm text-white hover:bg-blue-600/30'
                  }`}
              >
                Login
              </Link>

              <Link
                to="/register"
                className={`px-6 py-2.5 rounded-full font-medium transition-all text-sm ${isScrolled
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:from-blue-700 hover:to-purple-700'
                  : 'bg-white text-blue-700 hover:bg-blue-50'
                  }`}
              >
                Register Now <ArrowRight className="w-4 h-4 inline ml-1" />
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className={`p-2 rounded-md ${isScrolled ? 'text-gray-700' : 'text-white'
                  }`}
              >
                <span className="sr-only">Open menu</span>
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={showMobileMenu ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {showMobileMenu && (
          <div className="md:hidden bg-white shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {tabConfig.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setShowMobileMenu(false);
                    document.getElementById('content-section').scrollIntoView({
                      behavior: 'smooth'
                    });
                  }}
                  className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left ${activeTab === tab.id
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  <div className="flex items-center">
                    {tab.icon}
                    <span className="ml-3">{tab.label}</span>
                  </div>
                </button>
              ))}
              <div className="px-3 py-3 space-y-2">
                <Link
                  to="/new-participant-login"
                  className="block w-full text-center px-4 py-2 rounded-full font-medium bg-white border border-blue-200 text-blue-700"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block w-full text-center px-4 py-2 rounded-full font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Register Now
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hero Section */}
      <header className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white pt-28 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ0MCIgaGVpZ2h0PSI3MjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9IndhdmUiIHg9IjAiIHk9IjAiIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNMTAwIDBDNDAgMCAwIDQwIDAgMTAwczQwIDEwMCAxMDAgMTAwIDEwMC00MCAxMDAtMTAwUzE2MCAwIDEwMCAweiIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjd2F2ZSkiLz48L3N2Zz4=')]"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h5 className="inline-block px-3 py-1 text-sm font-medium bg-white/10 rounded-full backdrop-blur-sm mb-5">
              DSATM Bangalore Presents
            </h5>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
              HackOnX
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-8">
              8 HOUR Hackathon with INR 50,000/- Prize pool
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <StatusBadge icon={<MapPin />} text="DSATM Bangalore" link="https://maps.app.goo.gl/JBtAoY4F2rBrAGJm7?g_st=com.google.maps.preview.copy" />
              <StatusBadge icon={<Clock />} text="Apr 16,2025" />
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/register"
                className="px-8 py-4 rounded-full text-blue-700 bg-white font-bold text-lg shadow-xl hover:shadow-2xl transition-all hover:transform hover:scale-105"
              >
                Register Now <ArrowRight className="w-5 h-5 inline-block ml-2" />
              </Link>
              <a
                href="#timeline"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab('timeline');
                  document.getElementById('content-section').scrollIntoView({
                    behavior: 'smooth'
                  });
                }}
                className="px-8 py-4 rounded-full text-white bg-white/10 backdrop-blur-sm font-medium text-lg hover:bg-white/20 transition-all"
              >
                See Timeline
              </a>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">

        </div>
      </header>

      {/* Quick Stats */}
      <section className="py-10 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StatCard
              icon={<Trophy className="w-10 h-10 text-yellow-500" />}
              title="₹50,000"
              description="Total prize pool for winning teams"
            />
            <StatCard
              icon={<Users className="w-10 h-10 text-blue-500" />}
              title="8 Hours"
              description="Intense coding & innovation challenge"
            />
            <StatCard
              icon={<Star className="w-10 h-10 text-purple-500" />}
              title="Industry Mentors"
              description="Get guidance from top tech professionals"
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main>
        {/* Tabbed Section */}
        <div id="content-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Navigation for larger screens */}
          <nav className="hidden md:flex justify-center mb-12 overflow-x-auto sticky top-20 z-40 py-2">
            <div className="bg-white rounded-lg p-1 shadow-md flex space-x-2">
              {tabConfig.map((tab) => (
                <NavButton
                  key={tab.id}
                  active={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  text={tab.label}
                  icon={tab.icon}
                />
              ))}
            </div>
          </nav>

          {/* Mobile tabs */}
          <div className="md:hidden mb-8">
            <div className="bg-white rounded-lg shadow-md p-2">
              <div className="flex overflow-x-auto space-x-2 py-1">
                {tabConfig.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setShowMobileMenu(false);
                      document.getElementById('content-section').scrollIntoView({
                        behavior: 'smooth'
                      });
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap flex items-center ${activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600'
                      }`}
                  >
                    {tab.icon}
                    <span className="ml-2">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="bg-white rounded-xl p-6 md:p-8 min-h-[400px] shadow-lg">
            {renderContent()}
          </div>
        </div>

        {/* Rewards Section */}
        <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Amazing Rewards</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Showcase your talent and win fantastic prizes at HackOnX
              </p>
            </div>
            <RewardsSection />
          </div>

          <div className="absolute inset-0 opacity-30 pointer-events-none">
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-purple-300 rounded-full filter blur-3xl"></div>
            <div className="absolute -top-10 -left-10 w-64 h-64 bg-blue-300 rounded-full filter blur-3xl"></div>
          </div>
        </section>

        {/* FAQ Section with improved design */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FAQSection />
          </div>
        </section>

        {/* Register CTA */}
        <div className="py-24 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ0MCIgaGVpZ2h0PSI3MjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9IndhdmUiIHg9IjAiIHk9IjAiIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNMTAwIDBDNDAgMCAwIDQwIDAgMTAwczQwIDEwMCAxMDAgMTAwIDEwMC00MCAxMDAtMTAwUzE2MCAwIDEwMCAweiIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjd2F2ZSkiLz48L3N2Zz4=')]"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-white mb-8">Ready to Innovate at HackOnX</h2>
              <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto">
                Join the premier AI & ML hackathon at VVIET Karnataka and showcase your talent to industry leaders
              </p>

              <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <Link
                  to="/new-participant-login"
                  className="px-8 py-4 rounded-full text-white bg-blue-700/50 backdrop-blur-sm font-bold text-lg hover:bg-blue-700/70 transition-all"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-8 py-4 rounded-full text-blue-700 bg-white font-bold text-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
                >
                  Register Now <ArrowRight className="w-5 h-5 inline-block ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div>
                <h3 className="text-xl font-semibold mb-6">HackOnX</h3>
                <p className="text-gray-400 mb-6">
                  The premier AI & ML Hackathon at DSATM Bangalore.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-6">Quick Links</h3>
                <ul className="space-y-3">
                  <li>
                    <Link to="/register" className="text-gray-400 hover:text-white transition-colors">
                      Registera Now
                    </Link>
                  </li>
                  <li>
                    <Link to="/hackathon-dashboard" className="text-gray-400 hover:text-white transition-colors">
                      Login
                    </Link>
                  </li>
                  <li>
                    <a href="#" onClick={(e) => {
                      e.preventDefault();
                      setActiveTab('timeline');
                      document.getElementById('content-section').scrollIntoView({
                        behavior: 'smooth'
                      });
                    }} className="text-gray-400 hover:text-white transition-colors">
                      Timeline
                    </a>
                  </li>
                  <li>
                    <a href="#" onClick={(e) => {
                      e.preventDefault();
                      setActiveTab('eligibility');
                      document.getElementById('content-section').scrollIntoView({
                        behavior: 'smooth'
                      });
                    }} className="text-gray-400 hover:text-white transition-colors">
                      Eligibility
                    </a>
                  </li>
                  <li>
                    <a href="https://maps.app.goo.gl/eGUxrFH2tCuJqqBYA" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors flex items-center">
                      Location <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-6">Contact Organizers</h3>
                <ul className="space-y-4">
                  <ContactLink email="Madan@skillonx.net" name="Coordinator 1" />
                  <ContactLink email="ateeqbeme07@gmail.com" name="Faculty Coordinator" />
                  
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
              <p>© 2025 HackOnX Hackathon. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

// Utility Components
const StatusBadge = ({ icon, text, link }) => {
  const content = (
    <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-5 py-2.5 rounded-full 
                  hover:bg-white/20 transition-colors">
      {icon}
      <span>{text}</span>
    </div>
  );

  return link ? (
    <a href={link} target="_blank" rel="noopener noreferrer" className="cursor-pointer">
      {content}
    </a>
  ) : (
    <div className="cursor-default">
      {content}
    </div>
  );
};

const NavButton = ({ active, onClick, text, icon }) => {
  const handleClick = (e) => {
    // Call the original onClick handler
    onClick(e);

    // No need to scroll again if we're already in the section
    // The scroll is only needed for the header navigation
  };

  return (
    <button
      onClick={handleClick}
      className={`px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap
                flex items-center gap-2
      ${active
          ? 'bg-blue-600 text-white shadow-md'
          : 'text-gray-700 hover:bg-gray-100'
        }`}
    >
      {icon}
      <span>{text}</span>
    </button>
  );
};

const ContactLink = ({ email, name }) => (
  <a
    href={`mailto:${email}`}
    className="flex items-center space-x-2 text-gray-400 hover:text-blue-400 
              transition-colors group"
  >
    <Mail className="w-5 h-5 group-hover:scale-110 transition-transform text-blue-500" />
    <div>
      <span className="block text-white">{name}</span>
      <span className="text-sm">{email}</span>
    </div>
  </a>
);

const StatCard = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
    <div className="flex items-start">
      <div className="p-3 rounded-lg bg-gray-50">{icon}</div>
      <div className="ml-4">
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        <p className="text-gray-600 mt-1">{description}</p>
      </div>
    </div>
  </div>
);

const SocialIcon = ({ type }) => {
  let icon;

  switch (type) {
    case 'twitter':
      // Replace with actual Twitter icon
      icon = <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">T</div>;
      break;
    case 'instagram':
      // Replace with actual Instagram icon
      icon = <div className="w-10 h-10 rounded-full bg-pink-600 flex items-center justify-center">I</div>;
      break;
    case 'linkedin':
      // Replace with actual LinkedIn icon
      icon = <div className="w-10 h-10 rounded-full bg-blue-800 flex items-center justify-center">L</div>;
      break;
    default:
      icon = <div className="w-10 h-10 rounded-full bg-gray-600"></div>;
  }

  return (
    <a href="#" className="transition-transform hover:scale-110">
      {icon}
    </a>
  );
};

export default HackathonPage;