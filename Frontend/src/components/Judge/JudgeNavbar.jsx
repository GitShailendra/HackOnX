import React, { useState, useEffect } from 'react';
import { Link, useLocation,useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
const JudgeNavbar = () => {
  const [judgeInfo, setJudgeInfo] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const {logout} = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    document.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  // Close mobile menu when location changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);
  const handlelogout = ()=>{
    
      logout();
      navigate('/')
    
  }
 

  return (
    <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-blue-900/90 shadow-lg backdrop-blur-sm' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center">
                <span className="text-xl font-bold text-white tracking-tight">
                  <span className="text-blue-300">Hack</span>Judge
                </span>
              </Link>
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <Link
                to="/judge-dashboard/rating"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === '/judge-dashboard/rating' || location.pathname === '/judge-dashboard'
                    ? 'bg-blue-700 text-white'
                    : 'text-blue-200 hover:bg-blue-800 hover:text-white'
                } transition-colors duration-300`}
              >
                Rate Teams
              </Link>
              <Link
                to="/judge-dashboard/leaderboard"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === '/judge-dashboard/leaderboard'
                    ? 'bg-blue-700 text-white'
                    : 'text-blue-200 hover:bg-blue-800 hover:text-white'
                } transition-colors duration-300`}
              >
                Leaderboard
              </Link>
              <button onClick={handlelogout}>
                <LogOut/>
              </button>
              
              
              
            
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-blue-300 hover:text-white hover:bg-blue-800 focus:outline-none"
              aria-expanded={mobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-blue-900 bg-opacity-90 backdrop-blur-md shadow-lg">
          <Link
            to="/judge-dashboard/rating"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              location.pathname === '/judge-dashboard/rating' || location.pathname === '/judge-dashboard'
                ? 'bg-blue-700 text-white'
                : 'text-blue-200 hover:bg-blue-800 hover:text-white'
            } transition-colors duration-300`}
          >
            Rate Teams
          </Link>
          <Link
            to="/judge-dashboard/leaderboard"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              location.pathname === '/judge-dashboard/leaderboard'
                ? 'bg-blue-700 text-white'
                : 'text-blue-200 hover:bg-blue-800 hover:text-white'
            } transition-colors duration-300`}
          >
            Leaderboard
          </Link>
         
        </div>
      </div>
    </nav>
  );
};

export default JudgeNavbar;