import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Lock, Mail, AlertCircle, Code, Brain, Rocket } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../auth/AuthContext';

const HackathonAdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();
  // const devUrl = 'http://localhost:5000'
  const devUrl = "https://hackonx.onrender.com"
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${devUrl}/hackathon/admin-login`, formData);
      const {token,user} = response.data;
      const userData= {
        ...user,
        userType:'HackOnXManager'
      }
      if (response.data.success) {
        // Store token and user info using Auth Context
        login(token,userData);
        
        // Redirect to management dashboard
        navigate('/hackathon-manager');
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (err) {
      console.log('error is getting',err)
      setError(err.response?.data?.message || err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-violet-800 to-indigo-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Floating icons for background effect */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {[...Array(20)].map((_, i) => {
          const icons = [Code, Brain, Rocket];
          const Icon = icons[i % icons.length];
          const size = Math.floor(Math.random() * 30) + 15;
          const opacity = (Math.floor(Math.random() * 3) + 1) * 0.05;
          
          return (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 10 + 10}s`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            >
              <Icon 
                size={size} 
                className="text-white" 
                style={{ opacity }} 
              />
            </div>
          );
        })}
      </div>
      
      {/* Main login card */}
      <div className="max-w-md w-full z-10">
        {/* Glass morphism card */}
        <div className="backdrop-blur-lg bg-white/10 rounded-xl shadow-2xl overflow-hidden border border-white/20">
          <div className="px-6 py-8 sm:px-10">
            {/* Logo and title */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm mb-4">
                <Rocket className="h-10 w-10 text-purple-200" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-1">
                Hackathon Admin
              </h2>
              <p className="text-purple-200">
                Manage participants and applications
              </p>
            </div>
            
            {/* Error message */}
            {error && (
              <div className="bg-red-900/30 backdrop-blur-sm border-l-4 border-red-500 p-4 mb-6 rounded">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                  <span className="text-red-200">{error}</span>
                </div>
              </div>
            )}
            
            {/* Login form */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-purple-200 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-purple-300" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="appearance-none rounded-lg relative block w-full px-3 py-3 pl-10 
                                bg-white/5 backdrop-blur-sm border border-purple-300/20
                                placeholder-purple-300 text-white focus:outline-none 
                                focus:ring-2 focus:ring-purple-400 focus:border-transparent
                                transition-all duration-200"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-purple-200 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-purple-300" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="appearance-none rounded-lg relative block w-full px-3 py-3 pl-10 
                                bg-white/5 backdrop-blur-sm border border-purple-300/20
                                placeholder-purple-300 text-white focus:outline-none 
                                focus:ring-2 focus:ring-purple-400 focus:border-transparent
                                transition-all duration-200"
                      placeholder="Enter your password"
                    />
                  </div>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`group relative w-full flex justify-center py-3 px-4 
                            border border-transparent text-sm font-medium rounded-lg text-white
                            ${isLoading 
                              ? 'bg-purple-600/50 cursor-not-allowed' 
                              : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
                            } 
                            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500
                            transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99]`}
                >
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <LogIn className={`h-5 w-5 ${isLoading ? 'text-purple-300' : 'text-purple-300 group-hover:text-purple-200'}`} />
                  </span>
                  {isLoading ? 'Signing in...' : 'Sign in to Dashboard'}
                </button>
              </div>
            </form>
            
            {/* Footer link */}
            <div className="mt-6 text-center">
              <a 
                href="/" 
                className="text-sm text-purple-200 hover:text-white transition-colors duration-200"
              >
                Return to home page
              </a>
            </div>
          </div>
          
          {/* Bottom decorative bar */}
          <div className="h-1.5 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500"></div>
        </div>
      </div>
    </div>
  );
};

// Add this to your CSS (App.css or index.css)
const styleRules = `
@keyframes float {
  0% {
    transform: translateY(0px) translateX(0px);
  }
  50% {
    transform: translateY(-20px) translateX(10px);
  }
  100% {
    transform: translateY(0px) translateX(0px);
  }
}

.animate-float {
  animation-name: float;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
}
`;

// Add the style tag to the document head
const style = document.createElement('style');
style.textContent = styleRules;
document.head.appendChild(style);

export default HackathonAdminLogin;