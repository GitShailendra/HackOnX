import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Eye, EyeOff, X, MessageCircle } from 'lucide-react';
import axios from 'axios'; // Add axios import
import { useAuth } from "../../auth/AuthContext"; // Add useAuth import

// Import your logo files
import logo from "../../assets/logo/logo.png";
import logo2 from "../../assets/logo/logo.png";

const HackathonLoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    rememberMe: false,
    isSubmitting: false,
    error: null
  });
  const [showContactModal, setShowContactModal] = useState(false);
  
  const { login } = useAuth(); // Use the login function from auth context
  // const devUrl = 'http://localhost:5000';
   const devUrl = "https://hackonx.onrender.com"
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLoginData({
      ...loginData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoginData({
      ...loginData,
      isSubmitting: true,
      error: null
    });

    try {
      const response = await axios.post(`${devUrl}/hackathon/login`, {
        email: loginData.email,
        password: loginData.password
      });
      
      const { token, participant } = response.data;
      const userData = {
        ...participant,
        userType: 'HackOnXUser'
      };
      
      if (response.status === 200) {
        // Store token in localStorage and set user in context
        login(token, userData);
        navigate('/hackathon-dashboard');
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      setLoginData({
        ...loginData,
        isSubmitting: false,
        error: error.response?.data?.message || 'Invalid email or password. Please try again.'
      });
    }
  };

  return (
    <>
      {/* Header */}
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

            {/* Right side with register button */}
            <div className="hidden md:flex items-center space-x-3">
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
              <div className="px-3 py-3 space-y-2">
                <Link
                  to="/hackathon-dashboard"
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

      {/* Login Page Content */}
      <div className="min-h-screen w-full pt-24 flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:32px]" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl" />
        </div>

        {/* Glassmorphism Card */}
        <div className="w-full max-w-md relative z-10">
          <div className="backdrop-blur-xl bg-white/20 p-8 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] border border-white/30">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
              <p className="text-blue-100">Sign in to your HackOnX account</p>
            </div>

            {/* Show error message if there is one */}
            {loginData.error && (
              <div className="mb-4 p-3 bg-red-500/30 rounded-md border border-red-300/30 text-white text-sm">
                {loginData.error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-blue-100 mb-1">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-blue-200" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full pl-10 pr-3 py-3 bg-white/10 border border-white/30 rounded-lg placeholder-blue-200 text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
                    placeholder="you@example.com"
                    value={loginData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-blue-100 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-blue-200" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    className="block w-full pl-10 pr-10 py-3 bg-white/10 border border-white/30 rounded-lg placeholder-blue-200 text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
                    placeholder="••••••••"
                    value={loginData.password}
                    onChange={handleChange}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-blue-200 hover:text-white focus:outline-none"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <button 
                    onClick={() => setShowContactModal(true)}
                    className="font-medium text-blue-100 hover:text-white focus:outline-none"
                  >
                    Forgot password?
                  </button>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all"
                  disabled={loginData.isSubmitting}
                >
                  {loginData.isSubmitting ? (
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <>
                      Sign in <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-blue-100">
                Don't have an account?{' '}
                <Link to="/register" className="font-medium text-white hover:underline">
                  Register now
                </Link>
              </p>
            </div>

            <div className="mt-6 border-t border-white/20 pt-6">
              <div className="text-center">
                <Link to="/hackathon" className="text-sm text-blue-100 hover:text-white">
                  ← Back to home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Coordinators Modal */}
      {showContactModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowContactModal(false)}
          ></div>
          
          <div className="bg-blue-600 rounded-2xl p-8 w-full max-w-xl relative z-10 shadow-2xl">
            <button 
              onClick={() => setShowContactModal(false)}
              className="absolute top-4 right-4 text-white/80 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                Didn't find what you're looking for?
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ContactCard
                              title="Coordinator 1"
                              email="madan@skiilonx.net"
                              icon={<Mail className="w-5 h-5" />}
                            />
                          
                            <ContactCard
                              title="Coordinator 3"
                              email="akashayk2524@gmail.com"
                              icon={<Mail className="w-5 h-5" />}
                            />
              
                            <ContactCard
                              title="Mail Office"
                              email="ateeqbeme07@gmail.com"
                              icon={<Mail className="w-5 h-5" />}
                            />
            </div>
            
            <p className="text-center text-blue-100 mt-8">
              Our team is ready to assist you with any queries about HackOnX.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

// Contact Card Component
const ContactCard = ({ icon, title, email }) => (
  <a 
    href={`mailto:${email}`} 
    className="bg-blue-500/30 backdrop-blur-sm rounded-lg p-5 transition-transform hover:scale-105 block"
  >
    <div className="flex flex-col items-center text-center">
      <div className="w-10 h-10 rounded-full bg-blue-400/30 flex items-center justify-center mb-3">
        {icon}
      </div>
      <h3 className="font-medium text-white mb-1">{title}</h3>
      <p className="text-sm text-blue-100 truncate w-full">{email}</p>
    </div>
  </a>
);

export default HackathonLoginPage;